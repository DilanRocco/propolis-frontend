<script lang="ts">
	import type { FilterOptions, Listing } from '$lib/types/properties';
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher<{
		filterChange: FilterOptions;
	}>();

	export let initialFilters: FilterOptions = {};
	
	let filters: FilterOptions = { ...initialFilters };

	function handleFilterChange(newFilters: Partial<FilterOptions>) {
		filters = { ...filters, ...newFilters };
		dispatch('filterChange', filters);
	}
</script>

<div class="mb-6 flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
	<div class="min-w-64 flex-1">
		<div class="relative">
			<svg
				class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				type="text"
				placeholder="Search properties..."
				class="w-full rounded-md border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={filters.search || ''}
				on:input={(e) => handleFilterChange({ search: e.target.value })}
			/>
		</div>
	</div>

	<div class="flex items-center gap-3">
		<div class="relative">
			<select
				class="appearance-none rounded-md border border-gray-200 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={filters.propertyType || ''}
				on:change={(e) => handleFilterChange({ propertyType: e.target.value })}
			>
				<option value="">Property Type</option>
				<option value="Apartment">Apartment</option>
				<option value="Condo">Condo</option>
				<option value="House">House</option>
				<option value="Villa">Villa</option>
			</select>
			<svg
				class="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		</div>

		<div class="relative">
			<select
				class="appearance-none rounded-md border border-gray-200 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={filters.location || ''}
				on:change={(e) => handleFilterChange({ location: e.target.value })}
			>
				<option value="">Location</option>
				<option value="Miami">Miami</option>
				<option value="Fort Lauderdale">Fort Lauderdale</option>
				<option value="Key Biscayne">Key Biscayne</option>
			</select>
			<svg
				class="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		</div>

		<div class="relative">
			<select
				class="appearance-none rounded-md border border-gray-200 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={filters.status || ''}
				on:change={(e) => handleFilterChange({ status: e.target.value as 'active' | 'inactive' | '' })}
			>
				<option value="">Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
			<svg
				class="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		</div>
	</div>
</div>