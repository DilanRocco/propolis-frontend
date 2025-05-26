<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { propertyStore, type PropertyState } from '$lib/stores/propertyStore';
	
	// Props
	export let selectedNames: string[] = [];
	export let selectedBucket: 'week' | 'month' | 'year' = 'month';
	export let initialDateStart: string | null = null;
	export let initialDateEnd: string | null = null;
	export let selectedBeds: number | null = null;
	export let selectedPropertyType: string | null = null;
	
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
	let searchMode: 'buildings' | 'units' | 'all' = 'buildings';
	let showAdvancedFilters = false;
	
	// Time bucket options
	const bucketOptions = [
		{ value: 'week', label: 'Weekly' },
		{ value: 'month', label: 'Monthly' },
		{ value: 'year', label: 'Yearly' }
	];
	
	// Property types options
	const propertyTypes = [
		{ value: null, label: 'All Property Types' },
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
		{ value: 'units', label: 'Units' },
		{ value: 'all', label: 'All' }
	] as const
	
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
	
	// When bucket selection changes
	function changeBucket(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedBucket = select.value as 'week' | 'month' | 'year';
		dispatch('bucketChange', { selectedBucket });
	}
	
	// Update filtered list based on search mode and term
	function updateFilteredList() {
		// Select which list of names to filter based on current search mode
		let namesToFilter = 
			searchMode === 'buildings' ? buildingNames : 
			searchMode === 'units' ? listingNames : 
			allNames;
			
		if (searchTerm.trim() === '') {
			filteredListingNames = [...namesToFilter]; // Show all if search is empty
		} else {
			const term = searchTerm.toLowerCase().trim();
			
			// Enhanced search with word boundary detection and partial matching
			filteredListingNames = namesToFilter.filter(name => {
				const nameLower = name.toLowerCase();
				
				// Exact match has highest priority
				if (nameLower === term) {
					return true;
				}
				
				// Check if it's a word boundary match (starts with the term)
				if (nameLower.startsWith(term)) {
					return true;
				}
				
				// Check if it contains the term as a whole word
				if (nameLower.includes(` ${term}`) || nameLower.includes(`${term} `)) {
					return true;
				}
				
				// Fall back to simple inclusion for shorter terms (less than 3 chars)
				if (term.length < 3) {
					return nameLower.includes(term);
				}
				
				// For longer search terms, split the term and check if all words are included
				const searchWords = term.split(/\s+/);
				return searchWords.every(word => nameLower.includes(word));
			});
			
			// Sort results to prioritize items that start with the search term
			filteredListingNames.sort((a, b) => {
				const aLower = a.toLowerCase();
				const bLower = b.toLowerCase();
				
				// Items that start with the term come first
				const aStarts = aLower.startsWith(term);
				const bStarts = bLower.startsWith(term);
				
				if (aStarts && !bStarts) return -1;
				if (!aStarts && bStarts) return 1;
				
				// Then sort alphabetically
				return a.localeCompare(b);
			});
		}
	}
	
	// Debounce function to limit how often search updates are performed
	function debounce(func: Function, wait: number) {
		let timeout: ReturnType<typeof setTimeout>;
		return function executedFunction(...args: any[]) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}
	
	// Create a debounced version of updateFilteredList
	const debouncedUpdateFilteredList = debounce(updateFilteredList, 300);
	
	// Filter properties based on search term and mode
	$: {
		if (searchTerm !== undefined) {
			debouncedUpdateFilteredList();
		}
	}
	
	// When search mode changes, update filtered list
	$: {
		if (searchMode) {
			updateFilteredList();
		}
	}
	
	// Handle keyboard events in search input
	function handleKeydown(event: KeyboardEvent) {
		// Clear search on Escape key
		if (event.key === 'Escape') {
			clearSearch();
		}
		
		// If user presses Enter and we have filtered results, select the first one
		if (event.key === 'Enter' && filteredListingNames.length > 0 && !selectedNames.includes(filteredListingNames[0])) {
			toggleProperty(filteredListingNames[0]);
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
		applyFilters();
	}
	
	// Clear search term
	function clearSearch() {
		searchTerm = '';
	}
	
	// Handle filter changes
	function applyFilters() {
		// Dispatch event with all filter values
		dispatch('filtersApplied', {
			dateStart,
			dateEnd,
			selectedBeds,
			selectedPropertyType
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
	}
	
	// Toggle advanced filters display
	function toggleAdvancedFilters() {
		showAdvancedFilters = !showAdvancedFilters;
	}
	
	// Highlight matching text in search results
	function highlightMatch(text: string, term: string) {
		if (!term || term.trim() === '') return text;
		
		const termLower = term.toLowerCase().trim();
		const textLower = text.toLowerCase();
		const index = textLower.indexOf(termLower);
		
		if (index === -1) return text;
		
		const before = text.substring(0, index);
		const match = text.substring(index, index + termLower.length);
		const after = text.substring(index + termLower.length);
		
		return `${before}<span class="highlight">${match}</span>${after}`;
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

		<!-- Time Bucket Selector -->
		<div class="filter-group bucket-select">
			<label for="time-bucket" class="filter-label">Time Period</label>
			<div class="select-wrapper">
				<select
					id="time-bucket"
					class="filter-select"
					value={selectedBucket}
					on:change={changeBucket}
				>
					{#each bucketOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<span class="select-icon">▼</span>
			</div>
		</div>

		<!-- Advanced Filters Toggle -->
		<div class="filter-group advanced-toggle">
			<button class="toggle-button" on:click={toggleAdvancedFilters}>
				{showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
			</button>
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
	<div></div>

	<!-- Advanced Filters Row -->
	{#if showAdvancedFilters}
		<div class="advanced-filters-row">
			<!-- Property Type -->
			<div class="filter-group">
				<label for="property-type" class="filter-label">Property Type</label>
				<div class="select-wrapper">
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
			</div>
			
			<!-- Beds -->
			<div class="filter-group">
				<label for="beds" class="filter-label">Number of Beds</label>
				<div class="select-wrapper">
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
	{/if}

	<!-- Properties Section -->
	<div class="properties-section">
		<div class="properties-header">
			<div class="properties-title">
				<div>Properties</div>
				{#if selectedNames.length > 0}
					<span class="selected-count">({selectedNames.length} selected)</span>
				{/if}
			</div>
			{#if selectedNames.length > 0}
				<button class="clear-button" on:click={clearAllProperties}>
					Clear All
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
						on:keydown={handleKeydown}
						aria-label="Search properties"
					/>
					{#if searchTerm}
						<button class="search-clear-button" on:click={clearSearch} aria-label="Clear search">×</button>
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
			{#if loading}
				<div class="chips-loading">Loading properties...</div>
			{:else if filteredListingNames.length === 0 && !searchTerm}
				<div class="chips-empty">No properties available</div>
			{:else}
				{#each filteredListingNames as name}
					<button
						class="property-chip {selectedNames.includes(name) ? 'selected' : ''}"
						on:click={() => toggleProperty(name)}
					>
							{name}
						{#if selectedNames.includes(name)}
							<span class="chip-check">✓</span>
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
	
	.filters-row, .advanced-filters-row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
		width: 100%;
	}
	
	.advanced-filters-row {
		background-color: #f9f9f9;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #eee;
	}
	
	.filter-group {
		margin-bottom: 0;
		flex: 1;
	}
	
	.date-filters {
		flex: 2;
	}
	
	.bucket-select, .advanced-toggle {
		flex: 1;
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
	
	.toggle-button {
		padding: 0.5rem;
		background-color: #f5f5f7;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		color: #555;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
	}
	
	.toggle-button:hover {
		background-color: #efefef;
		border-color: #d0d0d0;
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
	
	.properties-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.selected-count {
		font-size: 0.875rem;
		color: #666;
		font-weight: normal;
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

	.chip-check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-coral-500);
		color: white;
		font-size: 0.7rem;
		line-height: 1;
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
		.filters-row, .advanced-filters-row {
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
		
		.property-chip {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>