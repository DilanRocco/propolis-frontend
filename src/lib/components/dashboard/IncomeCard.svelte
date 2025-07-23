<script lang="ts">
	import { Eye } from 'lucide-svelte';
	import CardWidget from './CardWidget.svelte';

	// Props with defaults
	export let shortTermRevenue: number;
	export let longTermRevenue: number;
	export let totalRevenue: number;

	function changeTimeFrame() {
		//TODO
	}
	function viewChartMode() {
		//TODO
		// Handle view chart mode
	}
</script>

<CardWidget info="Formula: coming soon">
	<span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Total Revenue</span>
	<div class="text-2xl font-bold">
		<span class="text-[color:var(--color-propolis-teal)]">$</span>
		{totalRevenue.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}
	</div>

	<div class="mb-4 border-t border-gray-200 pt-6">
		<div class="mb-1 text-xs text-gray-500">Total long term</div>
		<div class="text-2xl font-bold">
			<span class="text-[color:var(--color-propolis-yellow)]">$</span>
			{longTermRevenue.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})}
		</div>
	</div>
	<div class="mb-4 border-t border-gray-200 pt-6">
		<div class="mb-1 text-xs text-gray-500">Total short term</div>
		<div class="text-2xl font-bold">
			<span class="text-[color:var(--color-propolis-yellow)]">$</span>
			{shortTermRevenue.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})}
		</div>
	</div>

	<button on:click={viewChartMode} class="mt-6 flex cursor-pointer items-center gap-2">
		<div class="bg-[color:var(--color-propolis-yellow)] rounded-full p-1">
			<Eye class="text-[color:var(--color-propolis-teal)] h-4 w-4" />
		</div>
		<div class="text-xs">
			<span class="font-medium">View</span>
			<span class="text-gray-500"> on chart mode</span>
		</div>
	</button>
</CardWidget>
