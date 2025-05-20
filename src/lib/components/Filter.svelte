<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { propertyStore, type PropertyState } from '$lib/stores/propertyStore';
	
	// Props
	export let selectedNames: string[] = [];
	export let initialDateStart: string | null = null;
	export let initialDateEnd: string | null = null;
	
	// State
	let listingNames: string[] = [];
	let buildingNames: string[] = [];
	let allNames: string[] = []; // Combined list of all names
	let filteredListingNames: string[] = [];
	let searchTerm = '';
	let loading = false;
	let error: string | null = null;
	let dateStart: string | null = initialDateStart;
	let dateEnd: string | null = initialDateEnd;
	let selectedBeds: number | null = null;
	let selectedPropertyType: string | null = null;
	let searchMode: 'buildings' | 'properties' = 'buildings';
	
	// Property types options
	const propertyTypes = [
		{ value: '', label: 'All Property Types' },
		{ value: 'Dorm', label: 'Co-Living' },
		{ value: 'Apartment', label: 'Apartment' }
	];
	
	// Bed options
	const bedOptions = [
		{ value: null, label: 'Any Beds' },
		{ value: 1, label: '1 Bed' },
		{ value: 2, label: '2 Beds' },
		{ value: 3, label: '3 Beds' },
		{ value: 4, label: '4 Beds' },
		{ value: 5, label: '5+ Beds' }
	];
	
	// Search mode options
	const searchModeOptions = [

		{ value: 'buildings', label: 'Buildings' },
		{ value: 'properties', label: 'Properties' }
	];
	
	const dispatch = createEventDispatcher();
	
	// Subscribe to property store
	const unsub = propertyStore.subscribe((s: PropertyState) => {
		// Sort names alphabetically
		buildingNames = [...s.listingNames.building_names].sort((a, b) => a.localeCompare(b));
		listingNames = [...s.listingNames.property_names].sort((a, b) => a.localeCompare(b));
		// Create combined list that doesn't have duplicates
		allNames = [...new Set([...buildingNames, ...listingNames])].sort((a, b) => a.localeCompare(b));
		// Initialize filtered names based on current search mode
		updateFilteredList();
		loading = s.loading;
		error = s.error;
	});
	
	onMount(() => {
		return unsub;
	});
	
	// Update filtered list based on search mode and term
	function updateFilteredList() {
		let namesToFilter = 
			searchMode === 'buildings' ? buildingNames : 
			searchMode === 'properties' ? listingNames : 
			allNames;
			
		if (searchTerm.trim() === '') {
			filteredListingNames = [...namesToFilter]; // Show all if search is empty
		} else {
			const term = searchTerm.toLowerCase().trim();
			filteredListingNames = namesToFilter.filter(name => 
				name.toLowerCase().includes(term)
			);
		}
	}
	
	// Filter properties based on search term and mode
	$: {
		updateFilteredList();
	}
	
	// When search mode changes, update filtered list
	$: {
		if (searchMode) {
			updateFilteredList();
		}
	}
	
	// Toggle property selection
	function toggleProperty(name: string) {
		if (selectedNames.includes(name)) {
			selectedNames = selectedNames.filter((n) => n !== name);
		} else {
			selectedNames = [...selectedNames, name];
		}
		
		// Dispatch event to parent component
		dispatch('selectionChange', { selectedNames });
		
		// If newly selected, fetch data for this property
		if (selectedNames.includes(name)) {
			propertyStore.getDataFor(
				fetch, 
				name, 
				dateStart || undefined, 
				dateEnd || undefined, 
				selectedBeds || undefined, 
				selectedPropertyType || undefined
			).then(() => {
				dispatch('dataUpdated');
			});
		} else {
			dispatch('dataUpdated');
		}
	}
	
	// Clear search term
	function clearSearch() {
		searchTerm = '';
	}
	
	// Handle filter changes
	function applyFilters() {
		// Re-fetch data for all selected properties with new filters
		const promises = selectedNames.map(name => 
			propertyStore.getDataFor(
				fetch, 
				name, 
				dateStart || undefined, 
				dateEnd || undefined, 
				selectedBeds || undefined, 
				selectedPropertyType || undefined
			)
		);
		
		Promise.all(promises).then(() => {
			dispatch('filtersApplied', {
				dateStart,
				dateEnd,
				selectedBeds,
				selectedPropertyType
			});
			dispatch('dataUpdated');
		});
	}
	
	// Reset all filters
	function resetFilters() {
		dateStart = null;
		dateEnd = null;
		selectedBeds = null;
		selectedPropertyType = null;
		
		// Apply the reset filters
		applyFilters();
	}
	
	// Clear all selected properties
	function clearAllProperties() {
		selectedNames = [];
		dispatch('selectionChange', { selectedNames });
		dispatch('dataUpdated');
	}
</script>

<div class="filters-container">
	<div class="filters-row">
		<!-- Date Range -->
		<div class="filter-group date-filters">
			<div class="date-inputs">
				<div class="date-input-wrapper">
					<label for="date-start" class="filter-label">From</label>
					<input 
						type="date" 
						id="date-start" 
						class="date-input" 
						bind:value={dateStart}
					/>
				</div>
				<div class="date-input-wrapper">
					<label for="date-end" class="filter-label">To</label>
					<input 
						type="date" 
						id="date-end" 
						class="date-input" 
						bind:value={dateEnd}
					/>
				</div>
			</div>
		</div>

		<!-- Property Filters -->
		<div class="filter-group property-filters">
			<div class="property-filter-inputs">
				<div class="select-wrapper">
					<label for="property-type" class="filter-label">Type</label>
					<select
						id="property-type"
						class="filter-select"
						bind:value={selectedPropertyType}
					>
						{#each propertyTypes as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					<span class="select-icon">▼</span>
				</div>
				
				<div class="select-wrapper">
					<label for="beds" class="filter-label">Beds</label>
					<select
						id="beds"
						class="filter-select"
						bind:value={selectedBeds}
					>
						{#each bedOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					<span class="select-icon">▼</span>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="filter-actions">
			<button class="apply-button" on:click={applyFilters}>
				Apply
			</button>
			<button class="reset-button" on:click={resetFilters}>
				Reset
			</button>
		</div>
	</div>

	<!-- Properties Section -->
	<div class="properties-section">
		<div class="properties-header">
			<label>Properties</label>
			{#if selectedNames.length > 0}
				<button class="clear-button" on:click={clearAllProperties}>
					Clear All ({selectedNames.length})
				</button>
			{/if}
		</div>
		
		<!-- Search bar for properties with mode selection -->
		<div class="search-container">
			<div class="search-mode-wrapper">
				<div class="search-input-wrapper">
					<input 
						type="text" 
						placeholder="Search properties..." 
						bind:value={searchTerm}
						class="search-input"
					/>
					{#if searchTerm}
						<button class="search-clear-button" on:click={clearSearch}>×</button>
					{/if}
					<span class="search-icon">🔍</span>
				</div>
				
				<div class="search-mode-selector">
					{#each searchModeOptions as mode}
						<button 
							class="mode-button {searchMode === mode.value ? 'active' : ''}" 
							on:click={() => searchMode = mode.value}
						>
							{mode.label}
						</button>
					{/each}
				</div>
			</div>
			
			{#if searchTerm && filteredListingNames.length === 0}
				<p class="search-no-results">No properties match your search</p>
			{/if}
		</div>

		<div class="chips-container">
			{#if (searchMode === 'buildings' ? buildingNames : listingNames).length === 0 && loading}
				<div class="chips-loading">Loading properties...</div>
			{:else if (searchMode === 'buildings' ? buildingNames : listingNames).length === 0}
				<div class="chips-empty">No properties available</div>
			{:else}
				{#each filteredListingNames as name}
					<button
						class="property-chip {selectedNames.includes(name) ? 'selected' : ''}"
						on:click={() => toggleProperty(name)}
					>
						{name}
						{#if buildingNames.includes(name) && listingNames.includes(name)}
							<span class="chip-badge">B&P</span>
						{:else if buildingNames.includes(name)}
							<span class="chip-badge">B</span>
						{:else if listingNames.includes(name)}
							<span class="chip-badge">P</span>
						{/if}
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.filters-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
		font-family: var(--font-family);
	}
	
	.filters-row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
		width: 100%;
	}
	
	.filter-group {
		margin-bottom: 0;
	}
	
	.date-filters {
		flex: 2;
	}
	
	.date-inputs {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}
	
	.date-input-wrapper {
		flex: 1;
	}
	
	.filter-label {
		font-size: 0.75rem;
		color: #666;
		margin-bottom: 0.25rem;
		font-weight: 500;
		display: block;
	}
	
	.date-input {
		width: 100%;
		padding: 0.5rem;
		font-size: 0.875rem;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		color: #333;
		background-color: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}
	
	.date-input:focus {
		outline: none;
		border-color: var(--color-coral-300);
		box-shadow: 0 0 0 3px var(--color-coral-100);
	}
	
	.property-filters {
		flex: 2;
	}
	
	.property-filter-inputs {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}
	
	.filter-select {
		width: 100%;
	}
	
	.property-filters .select-wrapper {
		flex: 1;
	}
	
	.filter-actions {
		display: flex;
		gap: 0.5rem;
		flex: 1;
	}
	
	.apply-button {
		background-color: var(--color-coral-500);
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
		flex: 1;
	}
	
	.apply-button:hover {
		background-color: var(--color-coral-600);
	}
	
	.reset-button {
		background-color: #f5f5f7;
		color: #555;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.reset-button:hover {
		background-color: #efefef;
	}
	
	.properties-section {
		width: 100%;
	}
	
	.properties-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	
	label {
		font-size: 0.925rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #444;
	}
	
	.clear-button {
		background: none;
		border: none;
		color: var(--color-coral-500);
		font-size: 0.815rem;
		font-weight: 500;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}
	
	.clear-button:hover {
		background-color: var(--color-coral-50);
		color: var(--color-coral-700);
	}

	/* Search box styles */
	.search-container {
		margin-bottom: 0.75rem;
	}

	.search-mode-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.search-input-wrapper {
		position: relative;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem;
		padding-left: 2.5rem;
		padding-right: 2rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		font-size: 0.95rem;
		color: #333;
		background-color: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-coral-300);
		box-shadow: 0 0 0 3px var(--color-coral-100);
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #777;
		font-size: 0.875rem;
		pointer-events: none;
		opacity: 0.6;
	}

	.search-clear-button {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #eee;
		border: none;
		color: #666;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.search-clear-button:hover {
		background: #ddd;
		color: #333;
	}

	.search-no-results {
		color: #666;
		font-size: 0.875rem;
		font-style: italic;
		margin: 0;
		padding: 0.25rem 0;
	}

	/* Search mode selector */
	.search-mode-selector {
		display: flex;
		border-radius: 6px;
		overflow: hidden;
		border: 1px solid #e0e0e0;
		background-color: #f5f5f7;
	}

	.mode-button {
		flex: 1;
		background: none;
		border: none;
		padding: 0.5rem;
		font-size: 0.815rem;
		color: #555;
		cursor: pointer;
		transition: all 0.2s;
	}

	.mode-button:not(:last-child) {
		border-right: 1px solid #e0e0e0;
	}

	.mode-button:hover {
		background-color: rgba(0,0,0,0.05);
	}

	.mode-button.active {
		background-color: var(--color-coral-100);
		color: var(--color-coral-700);
		font-weight: 500;
	}

	.select-wrapper {
		position: relative;
	}

	select {
		appearance: none;
		width: 100%;
		padding: 0.5rem;
		font-size: 0.875rem;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		background-color: white;
		color: #333;
		font-weight: 400;
		transition: all 0.2s;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	select:focus {
		outline: none;
		border-color: var(--color-coral-300);
		box-shadow: 0 0 0 3px var(--color-coral-100);
	}

	.select-icon {
		position: absolute;
		right: 8px;
		bottom: 9px;
		color: #777;
		font-size: 0.65rem;
		pointer-events: none;
	}

	.chips-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		max-height: 200px;
		overflow-y: auto;
		padding: 0.25rem 0;
		border-radius: 8px;
	}

	.property-chip {
		background-color: #f5f5f7;
		border: 1px solid #eee;
		border-radius: 20px;
		padding: 0.5rem 0.875rem;
		font-size: 0.875rem;
		color: #444;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.property-chip:hover {
		background-color: #efefef;
		transform: translateY(-1px);
	}

	.property-chip.selected {
		background-color: var(--color-coral-100);
		border-color: var(--color-coral-300);
		color: var(--color-coral-700);
		font-weight: 500;
	}

	.chip-badge {
		font-size: 0.7rem;
		background: rgba(0,0,0,0.1);
		border-radius: 4px;
		padding: 0.1rem 0.3rem;
		color: #666;
	}

	.property-chip.selected .chip-badge {
		background: rgba(var(--color-coral-rgb-500), 0.2);
		color: var(--color-coral-700);
	}

	.chips-loading,
	.chips-empty {
		width: 100%;
		padding: 1rem;
		text-align: center;
		color: #777;
		font-style: italic;
	}
	
	/* Responsive adjustments */
	@media (max-width: 768px) {
		.filters-row {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}
		
		.filter-actions {
			flex-direction: row;
		}
	}
	
	@media (max-width: 640px) {
		.date-inputs {
			flex-direction: column;
			gap: 0.5rem;
		}
		
		.property-filter-inputs {
			flex-direction: column;
			gap: 0.5rem;
		}
		
		.property-chip {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>