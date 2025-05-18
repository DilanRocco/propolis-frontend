<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'svelte-echarts';
	import { init, use } from 'echarts/core';
	import { BarChart } from 'echarts/charts';
	import {
		GridComponent,
		TitleComponent,
		TooltipComponent,
		LegendComponent
	} from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';

	import { propertyStore, type ListingData } from '$lib/stores/propertyStore';
	import type { PropertyState } from '$lib/stores/propertyStore';

	use([BarChart, GridComponent, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

	let listingNames: string[] = [];
	let filteredListingNames: string[] = []; // New array for filtered listings
	let listingData: Record<string, ListingData[]> = {};
	let loading = false;
	let error: string | null = null;
	let searchTerm = ''; // New search term property

	// Now an array of selected names
	let selectedNames: string[] = [];
	let selectedBucket: 'week' | 'month' | 'year' = 'month';
	let chartHeight = 400;
	let windowWidth: number = 0;

	// Responsive chart height and settings
	$: {
		if (windowWidth <= 640) {
			// Small mobile
			chartHeight = 300;
		} else if (windowWidth <= 768) {
			// Tablet
			chartHeight = 350;
		} else {
			chartHeight = 400; // Desktop
		}
	}

	// Filter properties based on search term
	$: {
		if (searchTerm.trim() === '') {
			filteredListingNames = [...listingNames]; // Show all if search is empty
		} else {
			const term = searchTerm.toLowerCase().trim();
			filteredListingNames = listingNames.filter(name => 
				name.toLowerCase().includes(term)
			);
		}
	}

	let options: any = {
		title: {
			text: 'Reservations Comparison',
			textStyle: {
				color: '#333'
			}
		},
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			borderColor: 'var(--color-coral-300)',
			textStyle: {
				color: '#333'
			}
		},
		legend: {
			data: [],
			textStyle: {
				color: '#333'
			},
			type: windowWidth <= 640 ? 'scroll' : 'plain'
		},
		xAxis: {
			type: 'category',
			data: [],
			axisLabel: {
				rotate: windowWidth <= 640 ? 45 : 0,
				margin: 8,
				color: '#666'
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				color: '#666'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: windowWidth <= 640 ? '15%' : '10%',
			top: windowWidth <= 640 ? '15%' : '10%',
			containLabel: true
		},
		series: [],
		color: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6']
	};

	const unsub = propertyStore.subscribe((s: PropertyState) => {
		// Sort listing names alphabetically
		listingNames = [...s.listingNames].sort((a, b) => a.localeCompare(b));
		// Initialize filtered names with the sorted array
		filteredListingNames = [...listingNames];
		listingData = s.listingData;
		loading = s.loading;
		error = s.error;
	});

	onMount(() => {
		propertyStore.loadListingNames(fetch);
		return unsub;
	});

	// Toggle property selection
	function toggleProperty(name: string) {
		if (selectedNames.includes(name)) {
			selectedNames = selectedNames.filter((n) => n !== name);
		} else {
			selectedNames = [...selectedNames, name];
		}

		// Fetch fresh data for this property if newly selected
		if (selectedNames.includes(name)) {
			propertyStore.getDataFor(name, fetch).then(() => rebuildChart());
		} else {
			rebuildChart();
		}
	}

	function onSelectBucket(e: Event) {
		selectedBucket = (e.target as HTMLSelectElement).value as any;
		rebuildChart();
	}

	// Clear search term
	function clearSearch() {
		searchTerm = '';
	}

	// utility to floor a date to bucket start
	function floorToBucket(dt: Date): Date {
		const d = new Date(dt);
		if (selectedBucket === 'week') {
			// move to Monday of this week
			const day = (d.getDay() + 6) % 7;
			d.setDate(d.getDate() - day);
			d.setHours(0, 0, 0, 0);
		} else if (selectedBucket === 'month') {
			d.setDate(1);
			d.setHours(0, 0, 0, 0);
		} else {
			d.setMonth(0, 1);
			d.setHours(0, 0, 0, 0);
		}
		return d;
	}

	// advance date by one bucket
	function advanceBucket(dt: Date): Date {
		const d = new Date(dt);
		if (selectedBucket === 'week') {
			d.setDate(d.getDate() + 7);
		} else if (selectedBucket === 'month') {
			d.setMonth(d.getMonth() + 1);
		} else {
			d.setFullYear(d.getFullYear() + 1);
		}
		return d;
	}

	// label formatter for each bucket
	function formatBucket(dt: Date): string {
		if (selectedBucket === 'week') {
			// ISO week number by using Thursday trick
			const th = new Date(dt);
			th.setDate(dt.getDate() + 3);
			const week1 = new Date(th.getFullYear(), 0, 4);
			const weekNo = Math.ceil(((th.getTime() - week1.getTime()) / 86400000 + 1) / 7);
			return `${th.getFullYear()}-W${weekNo}`;
		} else if (selectedBucket === 'month') {
			return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
		} else {
			return dt.getFullYear().toString();
		}
	}

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	function rebuildChart() {
		if (!selectedNames.length) {
			options = {
				...options,
				xAxis: { ...options.xAxis, data: [] },
				series: [],
				legend: { ...options.legend, data: [] }
			};
			return;
		}

		// collect all raw data, tag by property
		interface Tagged {
			name: string;
			rec: ListingData;
		}
		const all: Tagged[] = [];
		for (const name of selectedNames) {
			const arr = listingData[name] ?? [];
			for (const rec of arr) all.push({ name, rec });
		}
		if (!all.length) {
			options = {
				...options,
				xAxis: { ...options.xAxis, data: [] },
				series: [],
				legend: { ...options.legend, data: [] }
			};
			return;
		}

		// find global date range
		all.sort(
			(a, b) =>
				new Date(a.rec.guesty_created_at).getTime() - new Date(b.rec.guesty_created_at).getTime()
		);
		const start = floorToBucket(new Date(all[0].rec.guesty_created_at));
		const end = new Date(all[all.length - 1].rec.guesty_created_at);

		// build full categories
		const cats: string[] = [];
		let cur = start;
		while (cur.getTime() <= end.getTime()) {
			cats.push(formatBucket(cur));
			cur = advanceBucket(cur);
		}

		// per-listing sums map
		const sums: Record<string, Map<string, number>> = {};
		for (const name of selectedNames) sums[name] = new Map();
		all.forEach(({ name, rec }) => {
			const dt = new Date(rec.guesty_created_at);
			const floored = floorToBucket(dt);
			const lbl = formatBucket(floored);
			const m = sums[name];
			m.set(lbl, (m.get(lbl) || 0) + rec.total_paid);
		});

		// build series for each property
		const series = selectedNames.map((name) => ({
			name,
			type: 'bar',
			data: cats.map((c) => +(sums[name].get(c) || 0).toFixed(2)),
			itemStyle: {
				borderRadius: 4
			},
			emphasis: {
				focus: 'series',
				itemStyle: {
					
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.2)',
					// Prevent opacity issues by setting opacity explicitly
					opacity: 1
				}
			}
		}));

		// Update responsive settings based on current window width
		const legendType = windowWidth <= 640 ? 'scroll' : 'plain';
		const axisRotation = windowWidth <= 640 ? 45 : 0;
		const gridBottom = windowWidth <= 640 ? '15%' : '10%';
		const gridTop = windowWidth <= 640 ? '15%' : '10%';

		options = {
			title: {
				text: `Reservations — ${selectedBucket}`,
				textStyle: {
					color: '#333'
				}
			},
			tooltip: {
				trigger: 'axis',
				backgroundColor: 'rgba(255, 255, 255, 0.9)',
				borderColor: 'var(--color-coral-300)',
				textStyle: {
					color: '#333'
				},
				formatter: function (params: any) {
					let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].axisValue}</div>`;
					params.forEach((item: any) => {
						result += `<div style="display:flex;justify-content:space-between;margin:3px 0;">
              <span style="display:inline-block;margin-right:10px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
                ${item.seriesName}:
              </span>
              <span style="font-weight:bold;">${formatCurrency(item.value)}</span>
            </div>`;
					});
					return result;
				}
			},
			legend: {
				data: selectedNames,
				textStyle: {
					color: '#333'
				},
				type: legendType,
				pageButtonPosition: 'end',
				pageIconColor: 'var(--color-coral-500)',
				pageIconInactiveColor: 'var(--color-coral-200)',
				pageTextStyle: {
					color: '#333'
				}
			},
			xAxis: {
				type: 'category',
				data: cats,
				axisLabel: {
					rotate: axisRotation,
					margin: 8,
					color: '#666'
				},
				axisLine: {
					lineStyle: {
						color: '#ddd'
					}
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					color: '#666',
					formatter: function (value: number) {
						if (value >= 1000) {
							return '$' + value / 1000 + 'k';
						}
						return '$' + value;
					}
				},
				splitLine: {
					lineStyle: {
						color: '#eee'
					}
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: gridBottom,
				top: gridTop,
				containLabel: true
			},
			series,
			color: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6']
		};
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="dashboard-container">
	<div class="card">
		<h2 class="card-title">Property Revenue Comparison</h2>

		<div class="controls">
			<div class="control-group time-period">
				<label for="bucket">Time Period</label>
				<div class="select-wrapper">
					<select
						id="bucket"
						class="bucket-select"
						on:change={onSelectBucket}
						bind:value={selectedBucket}
					>
						<option value="week">Weekly</option>
						<option value="month">Monthly</option>
						<option value="year">Yearly</option>
					</select>
					<span class="select-icon">▼</span>
				</div>
			</div>

			<div class="control-group properties-section">
				<label>Properties</label>
				
				<!-- Search bar for properties -->
				<div class="search-container">
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
					{#if searchTerm && filteredListingNames.length === 0}
						<p class="search-no-results">No properties match your search</p>
					{/if}
				</div>

				<div class="chips-container">
					{#if listingNames.length === 0 && loading}
						<div class="chips-loading">Loading properties...</div>
					{:else if listingNames.length === 0}
						<div class="chips-empty">No properties available</div>
					{:else}
						{#each filteredListingNames as name}
							<button
								class="property-chip {selectedNames.includes(name) ? 'selected' : ''}"
								on:click={() => toggleProperty(name)}
							>
								{name}
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		{#if loading}
			<div class="loading-container">
				<div class="loading-spinner"></div>
				<p>Loading data...</p>
			</div>
		{:else if error}
			<div class="error-container">
				<p class="error">{error}</p>
				<button class="retry-button" on:click={() => propertyStore.loadListingNames(fetch)}>
					Try Again
				</button>
			</div>
		{:else if selectedNames.length === 0}
			<div class="empty-state">
				<p>Select one or more properties to view their reservation data</p>
			</div>
		{:else}
			<div class="chart-container" style="height: {chartHeight}px;">
				<Chart {init} {options} />
			</div>
			<div class="selected-properties">
				<p>
					Comparing {selectedNames.length}
					{selectedNames.length === 1 ? 'property' : 'properties'}
				</p>
				<button
					class="clear-button"
					on:click={() => {
						selectedNames = [];
						rebuildChart();
					}}
				>
					Clear All
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Theme variables from the application */
	:global(:root) {
		--font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		--color-coral-50: #fff5f5;
		--color-coral-100: #ffe0e0;
		--color-coral-200: #ffc1c1;
		--color-coral-300: #ff9a9a;
		--color-coral-400: #ff7171;
		--color-coral-500: #ff4848;
		--color-coral-600: #e63939;
		--color-coral-700: #bf2c2c;
		--color-coral-800: #991f1f;
		--color-coral-900: #7a1212;
	}

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

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.time-period {
		max-width: 300px;
	}

	label {
		font-size: 0.925rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #444;
	}

	/* Search box styles */
	.search-container {
		margin-bottom: 0.75rem;
	}

	.search-input-wrapper {
		position: relative;
		margin-bottom: 0.5rem;
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

	.select-wrapper {
		position: relative;
	}

	select {
		appearance: none;
		width: 100%;
		padding: 0.75rem;
		font-size: 0.95rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background-color: white;
		color: #333;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	select:focus {
		outline: none;
		border-color: var(--color-coral-300);
		box-shadow: 0 0 0 3px var(--color-coral-100);
	}

	.select-icon {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
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
		gap: 0.25rem;
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

	.check-icon {
		font-size: 0.75rem;
		margin-left: 0.25rem;
	}

	.chart-container {
		width: 100%;
		transition: height 0.3s ease;
		margin-top: 1rem;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200px;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-coral-100);
		border-top: 3px solid var(--color-coral-500);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 200px;
		padding: 1rem;
	}

	.error {
		color: var(--color-coral-600);
		font-weight: 500;
		margin-bottom: 1rem;
		text-align: center;
	}

	.retry-button {
		background-color: var(--color-coral-500);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.retry-button:hover {
		background-color: var(--color-coral-600);
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200px;
		color: #777;
		background-color: #fafafa;
		border-radius: 8px;
		border: 1px dashed #ddd;
		padding: 1rem;
		text-align: center;
	}

	.chips-loading,
	.chips-empty {
		width: 100%;
		padding: 1rem;
		text-align: center;
		color: #777;
		font-style: italic;
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

	.clear-button {
		background: none;
		border: none;
		color: var(--color-coral-500);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.clear-button:hover {
		background-color: var(--color-coral-50);
		color: var(--color-coral-700);
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.controls {
			flex-direction: row;
		}

		.time-period {
			flex: 0 0 220px;
		}

		.properties-section {
			flex: 1;
		}
	}

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

		.property-chip {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>