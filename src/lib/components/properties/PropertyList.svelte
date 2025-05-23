<script lang="ts">
	import type { FilterOptions, Listing } from '$lib/types/properties';

	export let properties: Listing[] = [];
	// eslint-disable-next-line no-unused-vars
	export let selectProperty: (property: Listing) => void;

	// Internal state for filtered properties
	let filteredProperties: Listing[] = [];
	let filters: FilterOptions = {};

	$: {
		// Update filtered properties whenever the source properties or filters change
		filteredProperties = [...properties];
		applyFilters();
	}

	function applyFilters() {
		let filtered = [...properties];

		if (filters.search) {
			const q = filters.search.toLowerCase();
			filtered = filtered.filter(
				(p) => p.nickname.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
			);
		}

		if (filters.propertyType) {
			filtered = filtered.filter((p) => p.property_type === filters.propertyType);
		}

		if (filters.location) {
			filtered = filtered.filter((p) => p.address_city === filters.location);
		}

		if (filters.status === 'active') {
			filtered = filtered.filter((p) => p.active);
		} else if (filters.status === 'inactive') {
			filtered = filtered.filter((p) => !p.active);
		}

		filteredProperties = filtered;
	}

	function handleFilterChange(event: Event) {
		const target = event.target as HTMLInputElement | HTMLSelectElement;
		const filterType = target.dataset.filterType || 'search';
		
		filters = {
			...filters,
			[filterType]: target.value || undefined
		};
		applyFilters();
	}
</script>

<div>
	<!-- Filter Bar -->
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
					data-filter-type="search"
					on:input={handleFilterChange}
				/>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<div class="relative">
				<select
					class="appearance-none rounded-md border border-gray-200 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
					data-filter-type="propertyType"
					on:change={handleFilterChange}
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
					data-filter-type="location"
					on:change={handleFilterChange}
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
					data-filter-type="status"
					on:change={handleFilterChange}
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

	<!-- Property Cards -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredProperties as property (property.id)}
			<button
				class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
				on:click={() => selectProperty(property)}
			>
				<div class="relative h-48">
					<img
						src={property.thumbnail_url}
						alt={property.title}
						class="h-full w-full object-cover"
					/>
					<div class="absolute right-3 top-3">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {property.active
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'}"
						>
							{property.active ? 'Active' : 'Inactive'}
						</span>
					</div>
				</div>
				<div class="p-4 text-start">
					<h3 class="mb-1 truncate text-lg font-semibold">{property.nickname}</h3>
					<p class="mb-2 truncate text-sm text-gray-500">{property.title}</p>

					<div class="mb-2 flex items-center text-sm text-gray-600">
						<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<span>{property.address_city}, {property.address_state}</span>
					</div>

					<div class="mb-2 flex items-center justify-between">
						<div class="flex items-center text-sm text-gray-600">
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span>{property.property_type == "Dorm" ? "Co-living" : property.property_type}</span>
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="font-medium">{property.base_price}</span>
							<span class="ml-1 text-xs">/ night</span>
						</div>
					</div>

					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-3">
							<div class="flex items-center">
								<svg
									class="mr-1 h-4 w-4 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width={2}
										d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
									/>
								</svg>
								<span>{property.bedrooms}</span>
							</div>
							<div class="flex items-center">
								<svg
									class="mr-1 h-4 w-4 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width={2}
										d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
									/>
								</svg>
								<span>{property.bathrooms}</span>
							</div>
							<div class="flex items-center">
								<svg
									class="mr-1 h-4 w-4 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
								<span>{property.accommodates}</span>
							</div>
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>