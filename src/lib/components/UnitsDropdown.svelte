<script lang="ts">
	import { onMount } from 'svelte';
	import { globalPropertyFilter, type PropertyOption } from '$lib/stores/globalPropertyFilter';
	import { refetchDashboardData, updateUnitFilteringData, clearUnitFilteringData, type UnitFilteringData, unitFilteringData } from '$lib/stores/simpleDashboardStore';
	import { ChevronDown, X } from 'lucide-svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	// Subscribe to the global property filter store to watch for property changes
	$: ({ selectedProperty } = $globalPropertyFilter);

	// Sync selectedUnit with store data
	$: if ($unitFilteringData?.filters_applied?.unit && $unitFilteringData?.filters_applied?.type) {
		const storeUnit = {
			id: $unitFilteringData.filters_applied.unit,
			name: $unitFilteringData.filters_applied.unit,
			type: $unitFilteringData.filters_applied.type
		};
		if (!selectedUnit || selectedUnit.id !== storeUnit.id) {
			console.log('🔍 Syncing selectedUnit from store:', storeUnit);
			selectedUnit = storeUnit;
		}
	} else if (!$unitFilteringData && selectedUnit) {
		console.log('🔍 Clearing selectedUnit - no store data');
		selectedUnit = null;
	}

	// Local state for dropdown
	let isDropdownOpen = false;
	let dropdownElement: HTMLDivElement;
	let selectedUnit: {id: string, name: string, type: 'long-term' | 'short-term'} | null = null;

	// Units state
	let availableUnits: {id: string, name: string, type: 'long-term' | 'short-term'}[] = [];
	let loading = false;
	let error: string | null = null;
	let lastFetchedProperty: string | null = null;

	onMount(() => {
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

	// Watch for property changes and fetch units
	$: if (selectedProperty?.name !== lastFetchedProperty) {
		if (selectedProperty) {
			console.log('🔍 Property changed to:', selectedProperty.name);
			console.log('🔍 Property object:', selectedProperty);
			console.log('🔍 Current selected unit:', selectedUnit);
			fetchUnitsForProperty(selectedProperty.name);
		} else {
			// Clear units when no property selected
			availableUnits = [];
			selectedUnit = null;
			lastFetchedProperty = null;
		}
	}

	async function fetchUnitsForProperty(propertyName: string) {
		// Prevent unnecessary re-fetching
		if (lastFetchedProperty === propertyName && availableUnits.length > 0) {
			console.log('🔍 Skipping fetch - already have units for:', propertyName);
			return;
		}
		
		loading = true;
		error = null;
		lastFetchedProperty = propertyName;

		// Debug: Show the property name being used
		console.log('🔍 Original property name:', propertyName);
		
		// Try both the original name and normalized name
		const normalizedPropertyName = propertyName
			.toLowerCase()
			.replace(/\s+(apartments?|complex|building|tower|plaza|court|place)s?$/i, '')
			.trim();
		
		console.log('🔍 Normalized property name:', normalizedPropertyName);
		console.log('🔍 Will try both names:', [propertyName, normalizedPropertyName]);

		try {
			// Try both original and normalized property names
			const propertyNamesToTry = [propertyName, normalizedPropertyName];
			let shortTermUnits: {id: string, name: string, type: 'short-term'}[] = [];
			let longTermUnits: {id: string, name: string, type: 'long-term'}[] = [];
			
			// Try each property name variation
			for (const propName of propertyNamesToTry) {
				if (shortTermUnits.length > 0 && longTermUnits.length > 0) break; // Stop if we found units
				
				console.log('🔍 Trying property name:', propName);
				console.log('🔍 Short-term units found so far:', shortTermUnits.length);
				console.log('🔍 Long-term units found so far:', longTermUnits.length);
				
				// Fetch both short-term and long-term units in parallel
				const shortTermUrl = `${PUBLIC_API_URL}/db/units-for-property?property=${encodeURIComponent(propName)}`;
				const longTermUrl = `${PUBLIC_API_URL}/db/rent-paid-units?property=${encodeURIComponent(propName)}`;
				
				console.log('🔍 Short-term units URL:', shortTermUrl);
				console.log('🔍 Long-term units URL:', longTermUrl);
				
				const [shortTermUnitsRes, longTermUnitsRes] = await Promise.all([
					fetch(shortTermUrl),
					fetch(longTermUrl)
				]);

				console.log('🔍 Fetching units for property:', propName);
				
				// Process short-term units
				if (shortTermUnitsRes.ok && shortTermUnits.length === 0) {
					const shortTermData = await shortTermUnitsRes.json();
					console.log('🔍 Short-term units response for', propName, ':', shortTermData);
					console.log('🔍 Short-term units status:', shortTermUnitsRes.status);
					
					const allShortTermUnits = shortTermData.data?.map((item: any) => item.Unit) || [];
					console.log('🔍 All short-term units extracted for', propName, ':', allShortTermUnits);
					
					shortTermUnits = [...new Set(allShortTermUnits)]
						.filter((unit: unknown): unit is string => typeof unit === 'string' && unit.trim() !== '')
						.map((unitName: string) => ({
							id: unitName,
							name: unitName,
							type: 'short-term' as const
						}))
						.sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name));
					
					console.log('🔍 Processed short-term units for', propName, ':', shortTermUnits);
				} else if (!shortTermUnitsRes.ok) {
					console.error('🔍 Short-term units API failed for', propName, ':', shortTermUnitsRes.status, shortTermUnitsRes.statusText);
				}

				// Process long-term units
				if (longTermUnitsRes.ok && longTermUnits.length === 0) {
					const longTermData = await longTermUnitsRes.json();
					console.log('🔍 Long-term units response for', propName, ':', longTermData);
					console.log('🔍 Long-term units status:', longTermUnitsRes.status);
					
					const allLongTermUnits = longTermData.units || [];
					console.log('🔍 All long-term units extracted:', allLongTermUnits);
					
					longTermUnits = allLongTermUnits
						.filter((unit: unknown): unit is string => typeof unit === 'string' && unit.trim() !== '')
						.map((unitName: string) => ({
							id: unitName,
							name: unitName,
							type: 'long-term' as const
						}))
						.sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name));
					
					console.log('🔍 Processed long-term units:', longTermUnits);
				} else if (!longTermUnitsRes.ok) {
					console.error('🔍 Long-term units API failed:', longTermUnitsRes.status, longTermUnitsRes.statusText);
				}
			}

			// Combine both types of units
			availableUnits = [...shortTermUnits, ...longTermUnits];
			console.log('🔍 Combined units:', availableUnits);
			console.log('🔍 Summary for', propertyName, ':');
			console.log('  - Short-term units:', shortTermUnits.length);
			console.log('  - Long-term units:', longTermUnits.length);
			console.log('  - Total units:', availableUnits.length);
			console.log('  - Working property?', availableUnits.length > 0 ? 'YES' : 'NO');
			console.log('  - Property name pattern:', {
				original: propertyName,
				normalized: normalizedPropertyName,
				hasApartments: propertyName.toLowerCase().includes('apartments'),
				length: propertyName.length
			});

		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch units';
			availableUnits = [];
		} finally {
			loading = false;
		}
	}

	function toggleDropdown() {
		if (!selectedProperty) return; // Don't open if no property selected
		isDropdownOpen = !isDropdownOpen;
	}

	async function selectUnit(unit: {id: string, name: string, type: 'long-term' | 'short-term'}) {
		console.log('🔍 Selecting unit:', unit);
		selectedUnit = unit;
		console.log('🔍 Selected unit after assignment:', selectedUnit);
		isDropdownOpen = false;
		
		// Call different APIs based on unit type
		if (selectedProperty) {
			if (unit.type === 'long-term') {
				// For long-term units, call the rent-paid-unit-details endpoint
				await fetchLongTermUnitData(selectedProperty.name, unit.name);
			} else {
				// For short-term units, call the existing unit-filtering endpoint
				await fetchUnitFilteringData(selectedProperty.name, unit.name);
			}
		}
		
		console.log('🔍 About to call refetchDashboardData');
		refetchDashboardData();
		console.log('🔍 After refetchDashboardData call');
	}

	async function clearSelection() {
		console.log('🔍 Clearing selection');
		selectedUnit = null;
		console.log('🔍 Selected unit after clearing:', selectedUnit);
		isDropdownOpen = false;
		
		// Clear unit filtering data when no unit is selected
		clearUnitFilteringData();
		
		refetchDashboardData();
	}

	// Fetch long-term unit data from rent-paid-unit-details endpoint
	async function fetchLongTermUnitData(propertyName: string, unitName: string) {
		try {
			const url = new URL(`${PUBLIC_API_URL}/db/rent-paid-unit-details`);
			url.searchParams.append('property', propertyName);
			url.searchParams.append('unit', unitName);
			
			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`Failed to fetch long-term unit data: ${response.statusText}`);
			}
			
			const data = await response.json();
			console.log('Long-term unit data received:', data);
			
			// Update the store with the long-term unit data
			// For long-term units, we'll store the total paid amount
			const longTermUnitData: UnitFilteringData = {
				data: [{
					Revenue: data.unit_total_paid || 0,
					Unit: unitName,
					Property: propertyName
				}],
				count: 1,
				filters_applied: {
					property: propertyName,
					unit: unitName,
					type: 'long-term' as const
				}
			};
			
			updateUnitFilteringData(longTermUnitData);
			
		} catch (err) {
			console.error('Error fetching long-term unit data:', err);
			// Clear unit filtering data on error
			clearUnitFilteringData();
		}
	}

	// Fetch unit filtering data from your Supabase endpoint
	async function fetchUnitFilteringData(propertyName: string, unitName: string) {
		try {
			const url = new URL(`${PUBLIC_API_URL}/db/unit-filtering`);
			url.searchParams.append('property', propertyName);
			url.searchParams.append('unit', unitName);
			
			const response = await fetch(url.toString());
			if (!response.ok) {
				throw new Error(`Failed to fetch unit filtering data: ${response.statusText}`);
			}
			
			const data = await response.json();
			console.log('Unit filtering data received:', data);
			
			// Update the store with the unit filtering data
			const unitFilteringData: UnitFilteringData = {
				data: data.data || [],
				count: data.count || 0,
				filters_applied: {
					property: data.filters_applied?.property || propertyName,
					unit: data.filters_applied?.unit || unitName,
					type: 'short-term' as const
				}
			};
			updateUnitFilteringData(unitFilteringData);
			
		} catch (err) {
			console.error('Error fetching unit filtering data:', err);
			// Clear unit filtering data on error
			clearUnitFilteringData();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isDropdownOpen = false;
		}
	}

	// Get display text for the dropdown button
	$: dropdownButtonText = !selectedProperty 
		? 'Select Property First'
		: selectedUnit 
		? `${selectedUnit.name} (${selectedUnit.type === 'long-term' ? 'Long-term' : 'Short-term'})`
		: loading 
		? 'Loading...' 
		: availableUnits.length === 0
		? 'No Units Available'
		: 'All Units';

	$: {
		console.log('🔍 Button text reactive update:');
		console.log('🔍 selectedProperty:', selectedProperty?.name);
		console.log('🔍 selectedUnit:', selectedUnit);
		console.log('🔍 dropdownButtonText:', dropdownButtonText);
	}

	$: isDisabled = !selectedProperty || loading;
</script>

<div class="units-dropdown" bind:this={dropdownElement}>
	<button
		class="dropdown-button"
		class:selected={selectedUnit}
		class:disabled={isDisabled}
		on:click={toggleDropdown}
		on:keydown={handleKeydown}
		disabled={isDisabled}
		aria-haspopup="listbox"
		aria-expanded={isDropdownOpen}
	>
		<div class="button-content">
			<span class="button-text">{dropdownButtonText}</span>
			{#if selectedUnit}
				<span class="selected-indicator">✓</span>
				<span
					class="clear-button"
					on:click|stopPropagation={clearSelection}
					on:keydown={(e) => e.key === 'Enter' && clearSelection()}
					role="button"
					tabindex="0"
					aria-label="Clear unit selection"
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
					Loading units...
				</div>
			{:else if error}
				<div class="dropdown-item error">
					Error: {error}
				</div>
			{:else if availableUnits.length === 0}
				<div class="dropdown-item empty">
					No units available for this property
				</div>
			{:else}
				<!-- "All Units" option -->
				<button
					class="dropdown-item"
					class:selected={!selectedUnit}
					on:click={clearSelection}
				>
					<div class="item-content">
						<span>All Units</span>
					</div>
				</button>

				<div class="dropdown-divider"></div>

				<!-- Long-term units -->
				{#if availableUnits.filter(u => u.type === 'long-term').length > 0}
					<div class="dropdown-section-header">
						<span class="section-title">Long-term Units</span>
					</div>
					{#each availableUnits.filter(u => u.type === 'long-term') as unit, index (`long-term-${unit.id}-${index}`)}
						<button
							class="dropdown-item"
							class:selected={selectedUnit?.id === unit.id}
							on:click={() => selectUnit(unit)}
						>
							<div class="item-content">
								<span class="unit-name">{unit.name}</span>
							</div>
						</button>
					{/each}
				{/if}

				<!-- Short-term units -->
				{#if availableUnits.filter(u => u.type === 'short-term').length > 0}
					{#if availableUnits.filter(u => u.type === 'long-term').length > 0}
						<div class="dropdown-divider"></div>
					{/if}
					<div class="dropdown-section-header">
						<span class="section-title">Short-term Units</span>
					</div>
					{#each availableUnits.filter(u => u.type === 'short-term') as unit, index (`short-term-${unit.id}-${index}`)}
						<button
							class="dropdown-item"
							class:selected={selectedUnit?.id === unit.id}
							on:click={() => selectUnit(unit)}
						>
							<div class="item-content">
								<span class="unit-name">{unit.name}</span>
							</div>
						</button>
					{/each}
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.units-dropdown {
		position: relative;
		min-width: 180px;
	}

	.dropdown-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
		background: white;
		border: 1.5px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		color: #374151;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.dropdown-button:not(.disabled):hover {
		border-color: var(--color-propolis-teal);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dropdown-button:not(.disabled):focus {
		outline: none;
		border-color: var(--color-propolis-teal);
		box-shadow: 0 0 0 3px rgba(0, 150, 136, 0.1);
	}

	.dropdown-button.selected {
		border-color: var(--color-propolis-teal);
		background: rgba(0, 150, 136, 0.02);
	}

	.dropdown-button.disabled {
		background: #f8fafc;
		color: #94a3b8;
		cursor: not-allowed;
		border-color: #e2e8f0;
	}

	.button-content {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
	}

	.button-text {
		flex: 1;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 8px;
	}

	.clear-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #f1f5f9;
		color: #64748b;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-right: 8px;
	}

	.clear-button:hover {
		background: #e2e8f0;
		color: #475569;
	}

	.selected-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-propolis-teal);
		color: white;
		font-size: 12px;
		font-weight: bold;
		margin-right: 8px;
	}

	.chevron-wrapper {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.chevron-wrapper.rotate-180 {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 50;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		margin-top: 4px;
		max-height: 300px;
		overflow-y: auto;
	}

	.dropdown-item {
		width: 100%;
		padding: 10px 12px;
		text-align: left;
		background: white;
		border: none;
		color: #374151;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s ease;
		border-bottom: 1px solid #f1f5f9;
	}

	.dropdown-item:last-child {
		border-bottom: none;
	}

	.dropdown-item:hover:not(.loading):not(.error):not(.empty) {
		background: rgba(0, 150, 136, 0.05);
		color: var(--color-propolis-teal);
	}

	.dropdown-item.selected {
		background: rgba(0, 150, 136, 0.08);
		color: var(--color-propolis-teal);
		font-weight: 600;
	}

	.dropdown-item.loading,
	.dropdown-item.error,
	.dropdown-item.empty {
		color: #64748b;
		font-style: italic;
		cursor: default;
	}

	.dropdown-item.error {
		color: #dc2626;
	}

	.dropdown-divider {
		height: 1px;
		background: #e2e8f0;
		margin: 4px 0;
	}

	.item-content {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.unit-name {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dropdown-section-header {
		padding: 0.5rem 0.75rem 0.25rem;
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
	}

	.section-title {
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
