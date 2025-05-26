<!-- RevenueChart.svelte - Chart visualization component -->
<script lang="ts">
	import { Chart } from 'svelte-echarts';
	import { init, use } from 'echarts/core';
	import { BarChart } from 'echarts/charts';
	import {
		GridComponent,
		TitleComponent,
		TooltipComponent,
		GraphicComponent,
		LegendComponent
	} from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';
	import type { ListingData } from '$lib/stores/propertyStore';
	import { chartUtils } from './chartUtils';

	// Register ECharts components
	use([
		BarChart,
		GridComponent,
		TitleComponent,
		GraphicComponent,
		TooltipComponent,
		LegendComponent,
		CanvasRenderer
	]);

	// Props
	export let listingData: Record<string, ListingData[]> = {};
	export let selectedNames: string[] = [];
	export let selectedNameTypes: Record<string, 'building' | 'unit'> = {}; // NEW PROP
	export let selectedBucket: 'week' | 'month' | 'year' = 'month';
	export let dateStart: string | null = null;
	export let dateEnd: string | null = null;
	export let selectedBeds: number | null = null;
	export let selectedPropertyType: string | null = null;
	export let windowWidth: number = 0;

	// Reactive chart height
	let chartHeight = 400;
	$: {
		if (windowWidth <= 640) {
			chartHeight = 300; // Small mobile
		} else if (windowWidth <= 768) {
			chartHeight = 350; // Tablet
		} else {
			chartHeight = 400; // Desktop
		}
	}

	// Chart options with reactive updates
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

	// Reactive chart rebuild
	$: if (listingData && selectedNames && selectedBucket) {
		console.log('Chart data:', listingData);
		console.log('Selected name types:', selectedNameTypes);
		rebuildChart();
	}

	// Reactive window width
	$: if (windowWidth) {
		updateResponsiveSettings();
	}

	function updateResponsiveSettings() {
		options = {
			...options,
			legend: {
				...options.legend,
				type: windowWidth <= 640 ? 'scroll' : 'plain'
			},
			xAxis: {
				...options.xAxis,
				axisLabel: {
					...options.xAxis.axisLabel,
					rotate: windowWidth <= 640 ? 45 : 0
				}
			},
			grid: {
				...options.grid,
				bottom: windowWidth <= 640 ? '15%' : '10%',
				top: windowWidth <= 640 ? '15%' : '10%'
			}
		};
	}

	// Helper function to format legend name with type indicator
	function formatLegendName(name: string): string {
		const type = selectedNameTypes[name];
		if (type === 'building') {
			return `🏢 ${name}`;
		} else if (type === 'unit') {
			return `🏠 ${name}`;
		}
		return name; // fallback if type not found
	}

	// Helper function to get color for property based on type
	function getPropertyColor(name: string, index: number): string {
		const type = selectedNameTypes[name];
		const baseColors = [
			'#6366f1',
			'#10b981',
			'#f59e0b',
			'#8b5cf6',
			'#ec4899',
			'#14b8a6',
			'#f43f5e',
			'#0ea5e9'
		];

		const buildingColors = [
			'#dc2626',
			'#ea580c',
			'#d97706',
			'#ca8a04',
			'#65a30d',
			'#16a34a',
			'#059669',
			'#0891b2'
		];

		if (type === 'building') {
			return buildingColors[index % buildingColors.length];
		}
		return baseColors[index % baseColors.length];
	}

	function rebuildChart() {
		// Set up the "no data" state if needed
		console.log("DATA")
		console.log(listingData)

		if (Object.keys(listingData).length === 0) {
			console.log("DATA2")
			setNoDataState('Please select at least one property to display data.');
			return;
		}

		// Process data differently for buildings vs units
		const processedData: Record<string, ListingData[]> = {};

		console.log(selectedNames)
		console.log('selectedName')
		console.log(selectedNameTypes)
		for (const selectedName of selectedNames) {

			const nameType = selectedNameTypes[selectedName];

			console.log(nameType)
			if (nameType === 'building') {
				// For buildings, aggregate all units within that building
				const buildingData: ListingData[] = [];
				console.log("HERE1")
				// Find all units that belong to this building
				for (const [propertyName, propertyReservations] of Object.entries(listingData)) {
					// Check if this property belongs to the selected building
					if (propertyName.startsWith(selectedName)) {
						buildingData.push(...propertyReservations);
					}
				}

				processedData[selectedName] = buildingData;
			} else {
				// For individual units, use data as-is
				processedData[selectedName] = listingData[selectedName] || [];
			}
		}

		// Collect all data for date range calculation
		const allPropertyData: Array<{ name: string; rec: ListingData }> = [];
		
		for (const [name, records] of Object.entries(processedData)) {
			for (const rec of records) {
				allPropertyData.push({ name, rec });
			}
		}
		console.log(allPropertyData)
		console.log("ALL PROPERTY DATA")

		if (!allPropertyData.length) {
			// Create a helpful message based on what filters are active
			let filterMessage = 'No reservations found with the current filters:';
			const activeFilters = [];

			if (selectedBucket) activeFilters.push(`Time bucket: ${selectedBucket}`);
			if (dateStart) activeFilters.push(`Start date: ${dateStart}`);
			if (dateEnd) activeFilters.push(`End date: ${dateEnd}`);
			if (selectedBeds) activeFilters.push(`${selectedBeds} Beds`);
			if (selectedPropertyType) activeFilters.push(`Type: ${selectedPropertyType}`);

			filterMessage +=
				activeFilters.length > 0
					? ' ' + activeFilters.join(', ')
					: ' No active filters, but no data found.';

			setNoDataState(filterMessage);
			return;
		}

		// Clear any previous "no data" graphic elements
		options = {
			...options,
			graphic: [] // Remove the "no data" message if it was previously showing
		};

		// Find global date range for all selected properties
		allPropertyData.sort(
			(a, b) =>
				new Date(a.rec.guesty_created_at).getTime() - new Date(b.rec.guesty_created_at).getTime()
		);

		const start = chartUtils.floorToBucket(
			new Date(allPropertyData[0].rec.guesty_created_at),
			selectedBucket
		);
		const end = new Date(allPropertyData[allPropertyData.length - 1].rec.guesty_created_at);

		// Build full categories (time buckets)
		const cats: string[] = [];
		let cur = start;
		while (cur.getTime() <= end.getTime()) {
			cats.push(chartUtils.formatBucket(cur, selectedBucket));
			cur = chartUtils.advanceBucket(cur, selectedBucket);
		}

		// Per-listing sums map by time bucket (now using processed data)
		const sums: Record<string, Map<string, number>> = {};
		for (const name of selectedNames) sums[name] = new Map();

		// Use processed data for calculations
		for (const [name, records] of Object.entries(processedData)) {
			records.forEach((rec) => {
				const dt = new Date(rec.guesty_created_at);
				const floored = chartUtils.floorToBucket(dt, selectedBucket);
				const lbl = chartUtils.formatBucket(floored, selectedBucket);
				const m = sums[name];
				m.set(lbl, (m.get(lbl) || 0) + rec.total_paid);
			});
		}

		// Build series for each property with type-based styling
		const series = selectedNames.map((name, index) => ({
			name: formatLegendName(name),
			type: 'bar',
			data: cats.map((c) => +(sums[name].get(c) || 0).toFixed(2)),
			itemStyle: {
				borderRadius: 4,
				color: getPropertyColor(name, index)
			},
			emphasis: {
				focus: 'series',
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.2)',
					opacity: 1
				}
			}
		}));

		// Generate title with date range and filter info
		let chartTitle = `Reservations — ${selectedBucket}`;

		// Add property type breakdown to title
		const buildingCount = Object.values(selectedNameTypes).filter((t) => t === 'building').length;
		const unitCount = Object.values(selectedNameTypes).filter((t) => t === 'unit').length;

		if (buildingCount > 0 && unitCount > 0) {
			chartTitle += ` (${buildingCount} Buildings, ${unitCount} Units)`;
		} else if (buildingCount > 0) {
			chartTitle += ` (${buildingCount} Buildings)`;
		} else if (unitCount > 0) {
			chartTitle += ` (${unitCount} Units)`;
		}

		// Add date range to title if present
		if (dateStart && dateEnd) {
			chartTitle += ` | ${dateStart} - ${dateEnd}`;
		} else if (dateStart) {
			chartTitle += ` | From ${dateStart}`;
		} else if (dateEnd) {
			chartTitle += ` | Until ${dateEnd}`;
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

		// Create formatted legend data
		const legendData = selectedNames.map((name) => formatLegendName(name));

		// Update chart options
		options = {
			title: {
				text: chartTitle,
				textStyle: {
					color: '#333',
					fontSize: windowWidth <= 640 ? 14 : 16
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
					let result = `<strong>${params[0].name}</strong><br/>`;
					params.forEach((param: any) => {
						const propertyName = param.seriesName.replace(/^[🏢🏠]\s/, ''); // Remove icon from tooltip
						const type = selectedNameTypes[propertyName] === 'building' ? 'Building' : 'Unit';

						// For buildings, show aggregated unit count
						let unitInfo = '';
						if (selectedNameTypes[propertyName] === 'building') {
							const unitCount = Object.keys(listingData).filter((name) =>
								name.startsWith(propertyName)
							).length;
							unitInfo = ` (${unitCount} units)`;
						}

						result += `${param.marker} ${param.seriesName} (${type}${unitInfo}): $${param.value.toLocaleString()}<br/>`;
					});
					return result;
				}
			},
			legend: {
				data: legendData,
				textStyle: {
					color: '#333'
				},
				type: windowWidth <= 640 ? 'scroll' : 'plain',
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
					rotate: windowWidth <= 640 ? 45 : 0,
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
				bottom: windowWidth <= 640 ? '15%' : '10%',
				top: windowWidth <= 640 ? '20%' : '15%', // More space for longer title
				containLabel: true
			},
			series
		};
	}

	function setNoDataState(message: string) {
		options = {
			title: {
				text: 'No Reservations Found',
				textStyle: {
					color: '#333'
				}
			},
			...options,
			xAxis: { ...options.xAxis, data: [] },
			series: [],
			legend: { ...options.legend, data: [] },
			graphic: [
				{
					type: 'group',
					left: 'center',
					top: 'middle',
					children: [
						{
							type: 'text',
							style: {
								text: 'No Data Available',
								font: 'bold 18px sans-serif',
								fill: '#888'
							},
							left: 'center',
							top: 0
						},
						{
							type: 'text',
							style: {
								text: message,
								font: '14px sans-serif',
								fill: '#666',
								lineHeight: 20
							},
							left: 'center',
							top: 30
						}
					]
				}
			]
		};
	}
</script>

<div class="chart-container" style="height: {chartHeight}px;">
	<Chart {init} {options} />
</div>

<style>
	.chart-container {
		width: 100%;
		transition: height 0.3s ease;
		margin-top: 1rem;
	}
</style>
