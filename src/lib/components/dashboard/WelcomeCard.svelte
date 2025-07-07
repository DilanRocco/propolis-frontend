<script lang="ts">
	import { Mic, Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { dashboardDateRange, updateDateRange } from '../../stores/simpleDashboardStore';
	import AIView from './AIView.svelte';
	import PropertyDropdown from '../PropertyDropdown.svelte';
	
	let day = 19;
	let dayOfWeek = 'Tue';
	let month = 'December';
	let year = '2025';
	
	// Date range variables
	let startDate = '';
	let endDate = '';
	
	// AI View state
	let isAIViewOpen = false;
	
	onMount(() => {
		const now = new Date();
		day = now.getDate();
		dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
		month = now.toLocaleDateString('en-US', { month: 'long' });
		year = now.toLocaleDateString('en-us', { year: 'numeric' });
		
		// Initialize date range from store
		const unsubscribe = dashboardDateRange.subscribe(dateRange => {
			startDate = dateRange.startDate;
			endDate = dateRange.endDate;
		});
		unsubscribe();
	});
	
	function toggleAIView() {
		isAIViewOpen = !isAIViewOpen;
	}
	
	// Handle date range changes
	function handleDateRangeChange() {
		if (startDate && endDate) {
			updateDateRange({
				startDate,
				endDate
			});
		}
	}
	
	// Quick date range presets
	function setQuickRange(days: number) {
		const today = new Date();
		const start = new Date(today);
		start.setDate(today.getDate() - days);
		
		startDate = start.toISOString().split('T')[0];
		endDate = today.toISOString().split('T')[0];
		handleDateRangeChange();
	}
	
	function setCurrentMonth() {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		
		startDate = startOfMonth.toISOString().split('T')[0];
		endDate = endOfMonth.toISOString().split('T')[0];
		handleDateRangeChange();
	}
</script>

<!-- Date Header Section with Inline Filters -->
<div class="mb-8">
	<!-- Desktop layout: all in one row -->
	<div class="hidden lg:flex items-center justify-between w-full gap-6">
		<!-- Date Section -->
		<div class="flex items-center gap-4">
			<div class="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-gray-200">
				<div class="text-4xl font-semibold">{day}</div>
			</div>
			<div>
				<div class="text-xl font-medium text-gray-600">{dayOfWeek},</div>
				<div class="text-2xl font-bold text-gray-800">{month} {year}</div>
			</div>
		</div>

		<!-- Filters Section -->
		<div class="flex items-end gap-6">
			<!-- Date Range Filter -->
			<div class="flex flex-col gap-2">
				<div class="text-sm font-medium text-slate-700">Date Range</div>
				<div class="flex gap-2">
					<input
						type="date"
						bind:value={startDate}
						on:change={handleDateRangeChange}
						class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2"
						placeholder="Start Date"
					/>
					<input
						type="date"
						bind:value={endDate}
						on:change={handleDateRangeChange}
						class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2"
						placeholder="End Date"
					/>
				</div>
			</div>

			<!-- Property Filter -->
			<div class="flex flex-col gap-2">
				<div class="text-sm font-medium text-slate-700">Property Filter</div>
				<PropertyDropdown />
			</div>
		</div>

		<!-- AI Button -->
		<button 
			on:click={() => isAIViewOpen = true}
			class="relative cursor-pointer hover:scale-105 transition-transform duration-200"
		>
			<div class="absolute inset-0 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl animate-pulse"></div>
			<div class="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl shadow-lg">
				<Sparkles class="w-7 h-7 text-white animate-bounce" />
			</div>
		</button>
	</div>

	<!-- Mobile/Tablet layout: stacked -->
	<div class="lg:hidden space-y-4">
		<!-- Date and AI button row -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-full border border-gray-200">
					<div class="text-2xl sm:text-3xl font-semibold">{day}</div>
				</div>
				<div>
					<div class="text-lg sm:text-xl font-medium text-gray-600">{dayOfWeek},</div>
					<div class="text-xl sm:text-2xl font-bold text-gray-800">{month} {year}</div>
				</div>
			</div>
			<!-- AI Button -->
			<button 
				on:click={() => isAIViewOpen = true}
				class="relative cursor-pointer hover:scale-105 transition-transform duration-200"
			>
				<div class="absolute inset-0 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl animate-pulse"></div>
				<div class="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl shadow-lg">
					<Sparkles class="w-5 h-5 sm:w-7 sm:h-7 text-white animate-bounce" />
				</div>
			</button>
		</div>

		<!-- Filters row -->
		<div class="flex flex-col sm:flex-row gap-4">
			<!-- Date Range Filter -->
			<div class="flex flex-col gap-2 flex-1">
				<div class="text-sm font-medium text-slate-700">Date Range</div>
				<div class="flex flex-col sm:flex-row gap-2">
					<input
						type="date"
						bind:value={startDate}
						on:change={handleDateRangeChange}
						class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2 flex-1"
						placeholder="Start Date"
					/>
					<input
						type="date"
						bind:value={endDate}
						on:change={handleDateRangeChange}
						class="focus:ring-coral-500 rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 transition-all focus:border-transparent focus:ring-2 flex-1"
						placeholder="End Date"
					/>
				</div>
			</div>

			<!-- Property Filter -->
			<div class="flex flex-col gap-2 flex-1">
				<div class="text-sm font-medium text-slate-700">Property Filter</div>
				<PropertyDropdown />
			</div>
		</div>
	</div>

	<!-- Quick preset buttons row -->
	<div class="flex flex-wrap gap-1 mt-3">
		<button
			on:click={() => setQuickRange(7)}
			class="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition-colors"
		>
			7 Days
		</button>
		<button
			on:click={() => setQuickRange(30)}
			class="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition-colors"
		>
			30 Days
		</button>
		<button
			on:click={setCurrentMonth}
			class="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition-colors"
		>
			This Month
		</button>
	</div>
</div>

<!-- AI View -->
<AIView bind:isOpen={isAIViewOpen} />

