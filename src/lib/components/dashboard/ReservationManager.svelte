<script lang="ts">
	import type { ReservationManager} from '../../types/dashboard'
	import { Filter, MoreVertical, Search, DollarSign } from 'lucide-svelte';
	import CardWidget from './CardWidget.svelte';

	// Props
	export let reservations: ReservationManager;

	// State
	let searchQuery = '';
	let selectedTags = ['Upcoming', 'Active', 'All'];

	// Create an array for bar chart
	let barData = Array(10)
		.fill(0)
		.map((_, i) => ({
			height: 12,
			active: i % 2 === 0
		}));

	function removeTag(tag: string) {
		selectedTags = selectedTags.filter((t) => t !== tag);
	}


</script>

<CardWidget marginBottom={false}>
	<div class="mb-6 flex items-center justify-between">
		<h3 class="font-medium">Activity manager</h3>
		<div class="flex items-center gap-4">
			<Filter class="h-5 w-5 text-gray-500" />
			<MoreVertical class="h-5 w-5 text-gray-500" />
		</div>
	</div>

	<div class="relative mb-6">
		<Search class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search in activities..."
			class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm"
		/>
	</div>

	<div class="mb-6 flex items-center gap-2">
		{#each selectedTags as tag}
			<div
				class="{tag === 'Team' ? 'bg-coral-100 text-coral-500' : 'bg-gray-100 text-gray-700'} 
                flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
			>
				{tag}
				{#if tag !== 'Team'}
					<button on:click={() => removeTag(tag)} class="ml-1 text-xs">×</button>
				{/if}
			</div>
		{/each}
	</div>

	<div>

	</div>
</CardWidget>
