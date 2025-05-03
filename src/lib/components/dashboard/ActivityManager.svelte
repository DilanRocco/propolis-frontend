<script lang="ts">
	import { Filter, MoreVertical, Search, DollarSign } from 'lucide-svelte';
	import CardWidget from './CardWidget.svelte';

	// Props
	export let businessPlanAmount = 43.2;

	// State
	let searchQuery = '';
	let selectedTags = ['Team', 'Insights', 'Today'];
	let activityItems = [
		{ id: 1, name: 'Bank loans', isOpen: true },
		{ id: 2, name: 'Accounting', isOpen: false },
		{ id: 3, name: 'HR management', isOpen: false }
	];

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

	function toggleActivity(id: number) {
		activityItems = activityItems.map((item) =>
			item.id === id ? { ...item, isOpen: !item.isOpen } : item
		);
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
		<div class="mb-4 flex items-center justify-between">
			<h4 class="font-medium">Business plans</h4>
			<MoreVertical class="h-4 w-4 text-gray-500" />
		</div>

		<div class="mb-4">
			<div class="text-3xl font-medium">
				<span class="text-coral-500">$ {businessPlanAmount.toFixed(2)}</span>
				<span class="ml-1 text-xs text-gray-400">USD</span>
			</div>

			<div class="mb-6 mt-4 flex items-center gap-1">
				{#each barData as bar, i}
					<div
						class="h-{bar.height} w-2 {bar.active ? 'bg-coral-500' : 'bg-gray-300'} rounded-sm"
					></div>
				{/each}
			</div>

			<div class="mb-2 flex items-center justify-between">
				<div class="h-2 w-2 rounded-full bg-gray-300"></div>
				<div class="h-2 w-2 rounded-full bg-gray-300"></div>
				<div class="h-2 w-2 rounded-full bg-gray-800"></div>
				<div class="w-8 border-t border-gray-300"></div>
			</div>
		</div>

		<div class="border-coral-500 space-y-6 border-l-2 pl-4">
			{#each activityItems as item}
				<div class="relative">
					<div
						class="bg-coral-500 absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white"
					>
						<DollarSign class="h-3 w-3" />
					</div>
					<div class="flex items-center justify-between">
						<span class="font-medium">{item.name}</span>
						{#if item.isOpen}
							<button on:click={() => toggleActivity(item.id)} class="text-xs">▼</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</CardWidget>
