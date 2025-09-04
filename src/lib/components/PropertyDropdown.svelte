<script lang="ts">
	import { onMount } from 'svelte';
	import { globalPropertyFilter, type PropertyOption } from '$lib/stores/globalPropertyFilter';
	import { refetchDashboardData } from '$lib/stores/simpleDashboardStore';
	import { propertyStore } from '$lib/stores/propertyStore';
	import { ChevronDown, X } from 'lucide-svelte';

	// Subscribe to the global property filter store
	$: ({ selectedProperty, availableProperties, loading, error } = $globalPropertyFilter);

	// Local state for dropdown
	let isDropdownOpen = false;
	let dropdownElement: HTMLDivElement;

	onMount(() => {
		// Load properties when component mounts
		globalPropertyFilter.loadProperties(fetch);
		
		// Also load property store to enable property mapping
		propertyStore.loadListings(fetch);

		// Close dropdown when clicking outside
		function handleClickOutside(event: MouseEvent) {
			if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
				isDropdownOpen = false;
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function selectProperty(property: PropertyOption) {
		globalPropertyFilter.setSelectedProperty(property);
		isDropdownOpen = false;
		refetchDashboardData();
	}

	function clearSelection() {
		globalPropertyFilter.clearSelectedProperty();
		isDropdownOpen = false;
		refetchDashboardData();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isDropdownOpen = false;
		}
	}

	// Get display text for the dropdown button
	$: dropdownButtonText = selectedProperty 
		? selectedProperty.name 
		: loading 
		? 'Loading...' 
		: 'All Properties';
</script>

<div class="property-dropdown" bind:this={dropdownElement}>
	<button
		class="dropdown-button"
		class:selected={selectedProperty}
		on:click={toggleDropdown}
		on:keydown={handleKeydown}
		disabled={loading}
		aria-haspopup="listbox"
		aria-expanded={isDropdownOpen}
	>
		<div class="button-content">
			<span class="button-text">{dropdownButtonText}</span>
			{#if selectedProperty}
				<span
					class="clear-button"
					on:click|stopPropagation={clearSelection}
					on:keydown={(e) => e.key === 'Enter' && clearSelection()}
					role="button"
					tabindex="0"
					aria-label="Clear property selection"
				>
					<X class="w-3 h-3" />
				</span>
			{/if}
		</div>
		<div class="chevron-wrapper" class:rotate-180={isDropdownOpen}>
			<ChevronDown class="w-4 h-4 text-gray-400" />
		</div>
	</button>

	{#if isDropdownOpen}
		<div class="dropdown-menu">
			{#if loading}
				<div class="dropdown-item loading">
					Loading properties...
				</div>
			{:else if error}
				<div class="dropdown-item error">
					Error: {error}
				</div>
			{:else if availableProperties.length === 0}
				<div class="dropdown-item empty">
					No properties available
				</div>
			{:else}
				<!-- "All Properties" option -->
				<button
					class="dropdown-item"
					class:selected={!selectedProperty}
					on:click={clearSelection}
				>
					<div class="item-content">
						<span>All Properties</span>
					</div>
				</button>

				<div class="dropdown-divider"></div>

				<!-- Individual property options -->
				{#each availableProperties as property (property.id)}
					<button
						class="dropdown-item"
						class:selected={selectedProperty?.id === property.id}
						on:click={() => selectProperty(property)}
					>
						<div class="item-content">
							<span class="property-name">{property.name}</span>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.property-dropdown {
		position: relative;
		min-width: 180px;
	}

	.dropdown-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.5rem 0.75rem;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: #374151;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}

	.dropdown-button:hover {
		border-color: #9ca3af;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.dropdown-button:focus {
		outline: none;
		border-color: #f97316;
		box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
	}

	.dropdown-button.selected {
		border-color: #f97316;
		background: #fff7ed;
	}

	.dropdown-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	.button-text {
		flex: 1;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.clear-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.125rem;
		background: rgba(0, 0, 0, 0.1);
		border: none;
		border-radius: 0.25rem;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-button:hover {
		background: rgba(0, 0, 0, 0.2);
		color: #374151;
	}

	.chevron-wrapper {
		transition: transform 0.2s ease;
	}

	.chevron-wrapper.rotate-180 {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		z-index: 50;
		max-height: 300px;
		overflow-y: auto;
	}

	.dropdown-item {
		display: block;
		width: 100%;
		padding: 0.75rem;
		text-align: left;
		border: none;
		background: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
		font-size: 0.875rem;
	}

	.dropdown-item:hover {
		background: #f9fafb;
	}

	.dropdown-item.selected {
		background: #fff7ed;
		color: #ea580c;
	}

	.dropdown-item.loading,
	.dropdown-item.error,
	.dropdown-item.empty {
		color: #6b7280;
		cursor: default;
	}

	.dropdown-item.error {
		color: #dc2626;
	}

	.item-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.property-name {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dropdown-divider {
		height: 1px;
		background: #e5e7eb;
		margin: 0.25rem 0;
	}
</style> 