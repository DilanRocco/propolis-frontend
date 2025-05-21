<script lang="ts">
	import { onMount } from 'svelte';
	import { propertyStore, type ListingData } from '$lib/stores/propertyStore';
	import type { PropertyState } from '$lib/stores/propertyStore';
	
	// Import components
	import Filter  from '$lib/components/Filter.svelte';
	import RevenueChart from '$lib/components/graph/RevenueChart.svelte';
	import LoadingSpinner from '$lib/components/graph/LoadingSpinner.svelte';
	import ErrorDisplay from '$lib/components/graph/ErrorDisplay.svelte';
	import EmptyState from '$lib/components/graph/EmptyState.svelte';

	// State variables
	let listingData: Record<string, ListingData[]> = {};
	let loading = false;
	let error: string | null = null;

	// Selected properties and filter state
	let selectedNames: string[] = [];
	let selectedBucket: 'week' | 'month' | 'year' = 'month';
	let windowWidth: number = 0;
	let dateStart: string | null = null;
	let dateEnd: string | null = null;
	let selectedBeds: number | null = null;
	let selectedPropertyType: string | null = null;

	// Subscribe to property store
	const unsub = propertyStore.subscribe((s: PropertyState) => {
		listingData = s.listingData;
		loading = s.loading;
		error = s.error;
	});

	onMount(() => {
		propertyStore.loadListingNames(fetch);
		return unsub;
	});

	// Event handlers
	function handleSelectionChange(event: CustomEvent) {
		const newSelectedNames = event.detail.selectedNames;

		// Get properties to remove (ones that were deselected)
		const removedProperties = selectedNames.filter((name) => !newSelectedNames.includes(name));

		// Get properties to add (ones that were just selected)
		const addedProperties = newSelectedNames.filter((name) => !selectedNames.includes(name));

		// Update the selected names
		selectedNames = newSelectedNames;

		// Remove data for deselected properties
		if (removedProperties.length > 0) {
			propertyStore.clearProperties(removedProperties);
		}

		// Fetch data for newly selected properties
		if (addedProperties.length > 0) {
			propertyStore.getDataFor(
				fetch,
				addedProperties,
				dateStart || undefined,
				dateEnd || undefined,
				selectedBeds || undefined,
				selectedPropertyType || undefined
			);
		}
	}

	function handleBucketChange(event: CustomEvent) {
		selectedBucket = event.detail.selectedBucket;
	}

	function handleFiltersApplied(event: CustomEvent) {
		dateStart = event.detail.dateStart;
		dateEnd = event.detail.dateEnd;
		selectedBeds = event.detail.selectedBeds;
		selectedPropertyType = event.detail.selectedPropertyType;

		// Fetch updated data for all selected properties
		if (selectedNames.length > 0) {
			propertyStore.getDataFor(
				fetch,
				selectedNames,
				dateStart || undefined,
				dateEnd || undefined,
				selectedBeds || undefined,
				selectedPropertyType || undefined
			);
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="dashboard-container">
	<div class="card">
		<h2 class="card-title">Property Revenue Comparison</h2>

		<!-- Property filters component -->
		<Filter
			bind:selectedNames
			bind:selectedBucket
			initialDateStart={dateStart}
			initialDateEnd={dateEnd}
			bind:selectedBeds
			bind:selectedPropertyType
			on:selectionChange={handleSelectionChange}
			on:bucketChange={handleBucketChange}
			on:filtersApplied={handleFiltersApplied}
		/>

		{#if loading}
			<LoadingSpinner />
		{:else if error}
			<ErrorDisplay 
				{error} 
				onRetry={() => propertyStore.loadListingNames(fetch)} 
			/>
		{:else if selectedNames.length === 0}
			<EmptyState message="Select one or more properties to view their reservation data" />
		{:else}
			<RevenueChart
				{listingData}
				{selectedNames}
				{selectedBucket}
				{dateStart}
				{dateEnd}
				{selectedBeds}
				{selectedPropertyType}
				{windowWidth}
			/>
			<div class="selected-properties">
				<p>
					Comparing {selectedNames.length}
					{selectedNames.length === 1 ? 'property' : 'properties'}
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Theme variables - moved to app.css or _variables.css */
	
	.dashboard-container {
		font-family: var(--font-family);
		max-width: 100%;
		padding: 1rem;
	}

	.card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.card-title {
		color: #333;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 1.5rem 0;
		border-bottom: 2px solid #f5f5f5;
		padding-bottom: 0.75rem;
	}

	.selected-properties {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid #f0f0f0;
		font-size: 0.875rem;
		color: #666;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.dashboard-container {
			padding: 0.5rem;
		}

		.card {
			padding: 1rem;
			border-radius: 10px;
		}

		.card-title {
			font-size: 1.25rem;
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
		}
	}
</style>