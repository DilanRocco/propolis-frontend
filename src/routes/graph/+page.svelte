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
	
	// Import the PropertyFilters component
	import PropertyFilters from '$lib/components/Filter.svelte';

	use([BarChart, GridComponent, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

	// This now reflects the store structure as a dictionary
	let listingData: Record<string, ListingData[]> = {};
	let loading = false;
	let error: string | null = null;

	// Now an array of selected names
	let selectedNames: string[] = [];
	let selectedBucket: 'week' | 'month' | 'year' = 'month';
	let chartHeight = 400;
	let windowWidth: number = 0;
	
	// Filter state
	let dateStart: string | null = null;
	let dateEnd: string | null = null;
	let selectedBeds: number | null = null;
	let selectedPropertyType: string | null = null;

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
		color: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#0ea5e9']
	};

	const unsub = propertyStore.subscribe((s: PropertyState) => {
		listingData = s.listingData; // Now getting a dictionary
		loading = s.loading;
		error = s.error;
		
		// Rebuild chart when data changes
		if (!loading && !error) {
			rebuildChart();
		}
	});

	onMount(() => {
		propertyStore.loadListingNames(fetch);
		return unsub;
	});

	// Event handlers for the PropertyFilters component
	function handleSelectionChange(event: CustomEvent) {
		const newSelectedNames = event.detail.selectedNames;
		
		// Get properties to remove (ones that were deselected)
		const removedProperties = selectedNames.filter(name => !newSelectedNames.includes(name));
		
		// Get properties to add (ones that were just selected)
		const addedProperties = newSelectedNames.filter(name => !selectedNames.includes(name));
		
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
		rebuildChart();
	}
	
	function handleDataUpdated() {
		rebuildChart();
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

		// Collect all data for selected properties
		const allPropertyData: Array<{name: string, rec: ListingData}> = [];
		
		for (const name of selectedNames) {
			const propertyData = listingData[name] || [];
			for (const rec of propertyData) {
				allPropertyData.push({ name, rec });
			}
		}
		
		if (!allPropertyData.length) {
			options = {
				...options,
				xAxis: { ...options.xAxis, data: [] },
				series: [],
				legend: { ...options.legend, data: [] }
			};
			return;
		}

		// Find global date range for all selected properties
		allPropertyData.sort(
			(a, b) =>
				new Date(a.rec.guesty_created_at).getTime() - new Date(b.rec.guesty_created_at).getTime()
		);
		
		const start = floorToBucket(new Date(allPropertyData[0].rec.guesty_created_at));
		const end = new Date(allPropertyData[allPropertyData.length - 1].rec.guesty_created_at);

		// Build full categories (time buckets)
		const cats: string[] = [];
		let cur = start;
		while (cur.getTime() <= end.getTime()) {
			cats.push(formatBucket(cur));
			cur = advanceBucket(cur);
		}

		// Per-listing sums map by time bucket
		const sums: Record<string, Map<string, number>> = {};
		for (const name of selectedNames) sums[name] = new Map();
		
		allPropertyData.forEach(({ name, rec }) => {
			const dt = new Date(rec.guesty_created_at);
			const floored = floorToBucket(dt);
			const lbl = formatBucket(floored);
			const m = sums[name];
			m.set(lbl, (m.get(lbl) || 0) + rec.total_paid);
		});

		// Build series for each property
		const series = selectedNames.map((name, index) => ({
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
		
		// Generate title with date range and filter info
		let chartTitle = `Reservations — ${selectedBucket}`;
		
		// Add date range to title if present
		if (dateStart && dateEnd) {
			chartTitle += ` (${dateStart} - ${dateEnd})`;
		} else if (dateStart) {
			chartTitle += ` (From ${dateStart})`;
		} else if (dateEnd) {
			chartTitle += ` (Until ${dateEnd})`;
		}
		
		// Add beds/property type to title if filters are active
		const filterParts = [];
		if (selectedBeds) {
			filterParts.push(`${selectedBeds} Beds`);
		}
		if (selectedPropertyType) {
			filterParts.push(selectedPropertyType);
		}
		
		if (filterParts.length > 0) {
			chartTitle += ` | ${filterParts.join(', ')}`;
		}

		// Update chart options
		options = {
			title: {
				text: chartTitle,
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
					
					// Sort bars by value in descending order for better readability
					params.sort((a: any, b: any) => b.value - a.value);
					
					params.forEach((item: any) => {
						result += `<div style="display:flex;justify-content:space-between;margin:3px 0;">
							<span style="display:inline-block;margin-right:10px;">
								<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
								${item.seriesName}:
							</span>
							<span style="font-weight:bold;">${formatCurrency(item.value)}</span>
						</div>`;
					});
					
					// Add a total if there's more than one property
					if (params.length > 1) {
						const total = params.reduce((sum: number, item: any) => sum + item.value, 0);
						result += `<div style="margin-top:5px;padding-top:5px;border-top:1px solid #eee;">
							<div style="display:flex;justify-content:space-between;">
								<span style="font-weight:bold;">Total:</span>
								<span style="font-weight:bold;">${formatCurrency(total)}</span>
							</div>
						</div>`;
					}
					
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
			color: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#0ea5e9']
		};
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="dashboard-container">
	<div class="card">
		<h2 class="card-title">Property Revenue Comparison</h2>

		<!-- Use the PropertyFilters component -->
		<PropertyFilters 
			bind:selectedNames={selectedNames}
			bind:selectedBucket={selectedBucket}
			initialDateStart={dateStart}
			initialDateEnd={dateEnd}
			bind:selectedBeds={selectedBeds}
			bind:selectedPropertyType={selectedPropertyType}
			on:selectionChange={handleSelectionChange}
			on:bucketChange={handleBucketChange}
			on:dataUpdated={handleDataUpdated}
			on:filtersApplied={handleFiltersApplied}
		/>

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