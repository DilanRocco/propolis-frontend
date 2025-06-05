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

<CardWidget>
	<div class="mb-4 flex justify-between">
		<div>
			<div class="mb-1 text-xs text-gray-500">Total Revenue</div>
			<div class="text-2xl font-bold">
				<span class="text-coral-500">$</span>
				{totalRevenue.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</div>
		</div>
	</div>

	<div class="mb-4 border-t border-gray-200 pt-6">
		<div>
			<div class="mb-1 text-xs text-gray-500">Total long term</div>
			<div class="text-2xl font-bold">
				<span class="text-coral-500">$</span>
				{longTermRevenue.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</div>
		</div>
	</div>
	<div class="mb-4 border-t border-gray-200 pt-6">
		<div>
			<div class="mb-1 text-xs text-gray-500">Total short term</div>
			<div class="text-2xl font-bold">
				<span class="text-coral-500">$</span>
				{shortTermRevenue.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</div>
		</div>
	</div>

	<button on:click={viewChartMode} class="mt-6 flex cursor-pointer items-center gap-2">
		<div class="bg-coral-100 rounded-full p-1">
			<Eye class="text-coral-500 h-4 w-4" />
		</div>
		<div class="text-xs">
			<span class="font-medium">View</span>
			<span class="text-gray-500"> on chart mode</span>
		</div>
	</button>
</CardWidget>
