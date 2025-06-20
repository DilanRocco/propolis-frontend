<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { propertyStore, type ListingData } from '$lib/stores/propertyStore';
	import type { Listing } from '$lib/types/properties';
	import type { DoorloopProperty } from '$lib/types/doorloop';
	import { fade, fly, scale } from 'svelte/transition';
	import { ListFilter, Search, Grid, List } from 'lucide-svelte';
	import PropertyDetails from '$lib/components/PropertyDetails.svelte';
	import PictureGallery from '$lib/components/PictureGallery.svelte';

	// Subscribe to the store
	$: ({ listings, loading, error } = $propertyStore);

	// Filter state
	let searchQuery = '';
	let selectedPropertyTypes: string[] = [];
	let selectedBedrooms: number[] = [];
	let showActiveOnly = false;
	let showFilters = false;
	let viewMode: 'grid' | 'list' = 'grid';
	let showPropertyDetails = false;
	let selectedProperty: DoorloopProperty | null = null;
	let selectedPropertyData: ListingData[] = [];

	// Get unique property types and bedroom counts from listings
	$: propertyTypes = [...new Set(listings.map((listing) => listing.type))].sort();
	$: bedroomOptions = [...new Set(listings.map((listing) => listing.bedrooms).filter((b): b is number => b !== undefined))].sort(
		(a, b) => a - b
	);

	// Apply filters to listings
	$: filteredListings = listings.filter((listing) => {
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			const searchableText = [
				listing.title,
				listing.description,
				listing.address.formattedAddress,
				listing.type,
				listing.amenities.join(' ')
			]
				.join(' ')
				.toLowerCase();

			if (!searchableText.includes(query)) {
				return false;
			}
		}

		if (
			selectedPropertyTypes.length > 0 &&
			!selectedPropertyTypes.includes(listing.type)
		) {
			return false;
		}

		if (showActiveOnly && listing.source === 'doorloop' && !listing.active) {
			return false;
		}

		return true;
	});

	// Filter out listings with empty building names, then group by building name
	$: listingsWithBuildingNames = filteredListings.filter(listing => 
		listing.address_building_name && listing.address_building_name.trim() !== ''
	);

	// Function to normalize building names for grouping similar names
	function normalizeBuildingName(name: string): string {
		const normalized = name
			.toLowerCase()
			.replace(/\s+(apartments?|complex|building|tower|plaza|court|place)s?$/i, '')
			.trim();
		
		// Debug: log normalization for testing

		
		return normalized;
	}

	// Group filtered listings by normalized building name
	$: groupedListings = listingsWithBuildingNames.reduce(
		(acc, listing) => {
			const originalBuildingName = listing.address_building_name!;
			const normalizedName = normalizeBuildingName(originalBuildingName);
			
			// Use the first (alphabetically) building name as the display name for the group
			if (!acc[normalizedName]) {
				acc[normalizedName] = {
					displayName: originalBuildingName,
					listings: []
				};
			} else {
				// Update display name to the shorter one (usually the one without "apartments")
				const currentDisplayName = acc[normalizedName].displayName;
				if (originalBuildingName.length < currentDisplayName.length) {
					acc[normalizedName].displayName = originalBuildingName;
				}
			}
			
			acc[normalizedName].listings.push(listing);
			return acc;
		},
		{} as Record<string, { displayName: string; listings: Listing[] }>
	);

	// Track which buildings are expanded
	let expandedBuildings = new Set<string>();

	function toggleBuilding(buildingName: string) {
		if (expandedBuildings.has(buildingName)) {
			expandedBuildings.delete(buildingName);
		} else {
			expandedBuildings.add(buildingName);
		}
		expandedBuildings = expandedBuildings;
	}

	async function handlePropertyClick(propertyName: string) {
		// Find the property in our listings
		const property = listings.find(p => p.title === propertyName);
		if (property) {
			const addressParts = property.address.formattedAddress.split(',');
			selectedProperty = {
				active: property.active ?? false,
				address: {
					street1: addressParts[0]?.trim() ?? '',
					city: addressParts[1]?.trim() ?? '',
					state: addressParts[2]?.trim().split(' ')[0] ?? '',
					zip: addressParts[2]?.trim().split(' ')[1] ?? '',
					country: 'US',
					lat: property.address.location.lat,
					lng: property.address.location.lng
				},
				numActiveUnits: 1,
				class: 'Standard',
				settings: {},
				name: property.title,
				description: property.description,
				amenities: property.amenities,
				pictures: property.pictures.map(url => ({ fileId: '', rank: 0, url })),
				owners: [],
				type: property.type,
				id: property.id,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				createdBy: '',
				updatedBy: '',
				boardMembers: []
			};
			selectedPropertyData = $propertyStore.listingData[propertyName] || [];
			showPropertyDetails = true;
		}
	}

	function handleCloseDetails() {
		showPropertyDetails = false;
		selectedProperty = null;
	}

	function handleBuildingClick(buildingName: string, buildingListings: Listing[]) {
		const encodedBuildingName = encodeURIComponent(buildingName);
		goto(`/properties/buildings/${encodedBuildingName}`);
	}

	function handleExpandClick(buildingName: string) {
		toggleBuilding(buildingName);
	}

	function handleListingClick(listing: Listing, event: Event) {
		event.stopPropagation();
		const addressParts = listing.address.formattedAddress.split(',');
		selectedProperty = {
			active: listing.active ?? false,
			address: {
				street1: addressParts[0]?.trim() ?? '',
				city: addressParts[1]?.trim() ?? '',
				state: addressParts[2]?.trim().split(' ')[0] ?? '',
				zip: addressParts[2]?.trim().split(' ')[1] ?? '',
				country: 'US',
				lat: listing.address.location.lat,
				lng: listing.address.location.lng
			},
			numActiveUnits: 1,
			class: 'Standard',
			settings: {},
			name: listing.title,
			description: listing.description,
			amenities: listing.amenities,
			pictures: listing.pictures.map(url => ({ fileId: '', rank: 0, url })),
			owners: [],
			type: listing.type,
			id: listing.id,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: '',
			updatedBy: '',
			boardMembers: []
		};
		selectedPropertyData = $propertyStore.listingData[listing.title] || [];
		showPropertyDetails = true;
	}

	function togglePropertyType(type: string) {
		if (selectedPropertyTypes.includes(type)) {
			selectedPropertyTypes = selectedPropertyTypes.filter((t) => t !== type);
		} else {
			selectedPropertyTypes = [...selectedPropertyTypes, type];
		}
	}

	function toggleBedroom(bedrooms: number) {
		if (selectedBedrooms.includes(bedrooms)) {
			selectedBedrooms = selectedBedrooms.filter((b) => b !== bedrooms);
		} else {
			selectedBedrooms = [...selectedBedrooms, bedrooms];
		}
	}

	function clearAllFilters() {
		searchQuery = '';
		selectedPropertyTypes = [];
		selectedBedrooms = [];
		showActiveOnly = false;
	}

	function hasActiveFilters(): boolean {
		return (
			searchQuery.trim() !== '' ||
			selectedPropertyTypes.length > 0 ||
			selectedBedrooms.length > 0 ||
			showActiveOnly
		);
	}

	// Calculate total values for stats
	$: totalValue = filteredListings.reduce((sum, listing) => sum + (listing.base_price || 0), 0);
	$: averagePrice =
		filteredListings.length > 0 ? Math.round(totalValue / filteredListings.length) : 0;
	$: totalCapacity = filteredListings.reduce((sum, listing) => sum + (listing.accommodates || 0), 0);

	onMount(async () => {
		await Promise.all([
			propertyStore.loadListings(fetch),
			propertyStore.loadListingNames(fetch)
		]);
	});
</script>

<!-- Main Container with White Background -->
<div class="min-h-screen bg-white">
	<!-- Subtle Background Elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="bg-coral-500/5 absolute -right-1/2 -top-1/2 h-96 w-96 rounded-full blur-3xl"></div>
		<div
			class="bg-coral-300/3 absolute -bottom-1/2 -left-1/2 h-96 w-96 rounded-full blur-3xl"
		></div>
	</div>

	<div class="relative z-10">
		<!-- Header -->
		<div class="container mx-auto  pb-6 " style="max-width: 1400px;">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<!-- Title Section -->
				<div class="space-y-0">


					<!-- Stats Cards - Removed problematic transition -->
					{#if !loading}
						<div class="mt-4 flex flex-wrap gap-3">
							<div
								class="border-coral-200 rounded-xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg"
							>
								<div class="text-xl font-bold text-slate-800">{filteredListings.length}</div>
								<div class="text-xs text-slate-600">Apartments</div>
							</div>
							<div
								class="border-coral-200 rounded-xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg"
							>
								<div class="text-xl font-bold text-slate-800">
									{Object.keys(groupedListings).length}
								</div>
								<div class="text-xs text-slate-600">Buildings</div>
							</div>
							<div
								class="border-coral-200 rounded-xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg"
							>
								<div class="text-xl font-bold text-slate-800">${averagePrice.toLocaleString()}</div>
								<div class="text-xs text-slate-600">Avg. Price</div>
							</div>
							<div
								class="border-coral-200 rounded-xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg"
							>
								<div class="text-xl font-bold text-slate-800">{totalCapacity}</div>
								<div class="text-xs text-slate-600">Total Capacity</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Controls -->
				<div class="flex flex-col gap-3 sm:flex-row">
					<!-- Filters Button -->
					<button
						on:click={() => (showFilters = !showFilters)}
						class="border-coral-300 hover:bg-coral-50 group rounded-xl border bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm transition-all duration-300"
					>
						<div class="flex items-center space-x-2">
							<ListFilter />
							<span>Filters</span>
						</div>
						{#if hasActiveFilters()}
							<span class="bg-coral-500 ml-2 rounded-full px-2 py-0.5 text-xs text-white">
								{filteredListings.length}
							</span>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Advanced Filters Panel -->
		{#if showFilters}
			<div class="container mx-auto mb-6 px-6" style="max-width: 1400px;" transition:fly={{ y: -20, duration: 400 }}>
				<div class="border-coral-200 rounded-2xl border bg-white/90 p-6 shadow-lg backdrop-blur-xl">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						<!-- Search -->
						<div class="lg:col-span-2">
							<div class="mb-2 block font-medium text-slate-700">Search Properties</div>
							<div class="relative">
								<input
									type="text"
									bind:value={searchQuery}
									placeholder="Search by name, location, type..."
									class="focus:ring-coral-500 w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-700 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2"
								/>
								<svg
									class="absolute left-3 top-3 h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>

						<!-- Property Types -->
						<div>
							<div class="mb-2 block font-medium text-slate-700">Property Type</div>
							<div class="custom-scrollbar max-h-32 space-y-2 overflow-y-auto">
								{#each propertyTypes as type}
									<label class="group flex cursor-pointer items-center">
										<input
											type="checkbox"
											checked={selectedPropertyTypes.includes(type)}
											on:change={() => togglePropertyType(type)}
											class="sr-only"
										/>
										<div
											class="group-hover:border-coral-500 mr-2 flex h-4 w-4 items-center justify-center rounded border-2 border-slate-300 transition-all {selectedPropertyTypes.includes(
												type
											)
												? 'bg-coral-500 border-coral-500'
												: 'bg-white'}"
										>
											{#if selectedPropertyTypes.includes(type)}
												<svg class="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clip-rule="evenodd"
													/>
												</svg>
											{/if}
										</div>
										<span
											class="group-hover:text-coral-600 text-sm text-slate-700 transition-colors"
											>{type}</span
										>
									</label>
								{/each}
							</div>
						</div>

						<!-- Bedrooms -->
						<div>
							<div class="mb-2 block font-medium text-slate-700">Bedrooms</div>
							<div class="custom-scrollbar max-h-32 space-y-2 overflow-y-auto">
								{#each bedroomOptions as bedrooms}
									<label class="group flex cursor-pointer items-center">
										<input
											type="checkbox"
											checked={selectedBedrooms.includes(bedrooms)}
											on:change={() => toggleBedroom(bedrooms)}
											class="sr-only"
										/>
										<div
											class="group-hover:border-coral-500 mr-2 flex h-4 w-4 items-center justify-center rounded border-2 border-slate-300 transition-all {selectedBedrooms.includes(
												bedrooms
											)
												? 'bg-coral-500 border-coral-500'
												: 'bg-white'}"
										>
											{#if selectedBedrooms.includes(bedrooms)}
												<svg class="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clip-rule="evenodd"
													/>
												</svg>
											{/if}
										</div>
										<span
											class="group-hover:text-coral-600 text-sm text-slate-700 transition-colors"
										>
											{bedrooms}
											{bedrooms === 1 ? 'bedroom' : 'bedrooms'}
										</span>
									</label>
								{/each}
							</div>
						</div>
					</div>

					<!-- Filter Actions -->
					<div class="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
						<div class="text-sm text-slate-600">
							Showing <span class="font-semibold text-slate-800">{filteredListings.length}</span> of
							<span class="font-semibold text-slate-800">{listings.length}</span> apartments
						</div>
						{#if hasActiveFilters()}
							<button
								on:click={clearAllFilters}
								class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-100"
							>
								Clear Filters
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Content Area -->
		<div class="container mx-auto pb-8" style="max-width: 1400px;">
			{#if loading}
				<div class="flex flex-col items-center justify-center py-20" in:fade>
					<div class="relative">
						<div class="border-coral-200 h-12 w-12 animate-spin rounded-full border-4"></div>
						<div
							class="border-coral-500 absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
						></div>
					</div>
					<p class="mt-4 text-base text-slate-600">Loading your apartments...</p>
				</div>
			{:else if error}
				<div class="rounded-2xl border border-red-200 bg-red-50 p-6 backdrop-blur-lg" in:scale>
					<div class="flex items-center">
						<svg
							class="mr-3 h-6 w-6 text-red-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<h3 class="text-lg font-semibold text-red-800">Something went wrong</h3>
							<p class="mt-1 text-sm text-red-600">{error}</p>
						</div>
					</div>
				</div>
			{:else}
				<!-- Buildings Grid - Key added to force re-render with stable transitions -->
				<div class="space-y-6">
					{#each Object.entries(groupedListings) as [normalizedName, { displayName, listings: buildingListings }], i (normalizedName)}
						<div class="group">
							<!-- Building Card -->
							<div
								class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-[1.005] hover:shadow-lg"
							>
								<!-- Building Header -->
								<div class="border-b border-slate-100 p-6">
									<div class="flex items-center justify-between">
										<button
											on:click={() => handleBuildingClick(displayName, buildingListings)}
											class="group/header flex-1 text-left"
										>
																					<div class="flex items-center">
											<!-- Building Thumbnail -->
											<div class="mr-4 h-16 w-16 overflow-hidden rounded-xl shadow-md transition-transform duration-200 group-hover/header:scale-105">
																							{#if buildingListings[0]?.thumbnail_url || (buildingListings[0]?.pictures && buildingListings[0]?.pictures.length > 0)}
												<img 
													src={buildingListings[0]?.thumbnail_url || buildingListings[0]?.pictures?.[0]} 
													alt={displayName}
													class="h-full w-full object-cover"
													loading="lazy"
												/>
												{:else}
													<div class="from-coral-500 to-coral-600 flex h-full w-full items-center justify-center bg-gradient-to-br">
														<svg
															class="h-6 w-6 text-white"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-1a1 1 0 011-1h1m-1 4h12"
															/>
														</svg>
													</div>
												{/if}
											</div>
												<div>
													<h2
														class="group-hover/header:text-coral-600 text-2xl font-bold text-slate-800 transition-colors duration-200"
													>
														{displayName}
													</h2>
													<div class="mt-1 flex items-center text-slate-600">
														<svg
															class="mr-1 h-4 w-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
															/>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
															/>
														</svg>
														<span class="text-sm"
															>{buildingListings[0]?.address_city}, {buildingListings[0]
																?.address_state}</span
														>
													</div>
													<div class="mt-1 flex items-center space-x-2">
														<span
															class="bg-coral-100 border-coral-200 text-coral-700 rounded-full border px-2 py-1 text-xs font-medium"
														>
															{buildingListings.length}
															{buildingListings.length === 1 ? 'apartment' : 'apartments'}
														</span>
														<!-- Source indicators -->

													</div>
												</div>
											</div>
										</button>

										<button
										    aria-label = "Expand Click"
											on:click={(event) => handleExpandClick(displayName)}
											class="hover:bg-coral-50 ml-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 hover:scale-105"
										>
											<svg
												class="h-5 w-5 transform text-slate-600 transition-transform duration-300 {expandedBuildings.has(
													displayName
												)
													? 'rotate-180'
													: ''}"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
									</div>
								</div>

								<!-- Expandable Properties -->
								{#if expandedBuildings.has(displayName)}
									<div
										class="p-6"
										in:fly={{ y: -10, duration: 300 }}
										out:fly={{ y: -10, duration: 200 }}
									>
										<div
											class="grid gap-4 {viewMode === 'grid'
												? 'md:grid-cols-2 lg:grid-cols-3'
												: 'grid-cols-1'}"
										>
											{#each buildingListings as listing (listing.id)}
												<div
													class="group/card relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
													on:click={(event) => handleListingClick(listing, event)}
													on:keydown={(event) => event.key === 'Enter' && handleListingClick(listing, event)}
													role="button"
													tabindex="0"
												>
													<!-- Property Image Gallery -->
													<div class="relative h-48 w-full overflow-hidden">
														{#if listing.pictures && listing.pictures.length > 0}
															<div class="h-full w-full">
																<PictureGallery 
																	pictures={[listing.pictures[0]]}
																	title={listing.title}
																	showThumbnails={false}
																	maxHeight="192px"
																/>
															</div>
														{:else if listing.thumbnail_url || (listing.pictures && listing.pictures.length > 0)}
															<img
																src={listing.thumbnail_url || listing.pictures?.[0]}
																alt={listing.title}
																class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
																loading="lazy"
															/>
														{:else}
															<div class="h-full w-full bg-gray-100 flex items-center justify-center">
																<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
																</svg>
															</div>
														{/if}
														<div class="absolute right-3 top-3">
															<span class="rounded-full border border-slate-200 bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur-sm {listing.source === 'guesty' ? 'text-blue-700 bg-blue-50/90 border-blue-200' : 'text-green-700 bg-green-50/90 border-green-200'}">
																{listing.source === 'guesty' ? 'Short Term' : 'Long Term'}
															</span>
														</div>
													</div>

													<!-- Property Details -->
													<div class="flex flex-1 flex-col p-4">
														<h3 class="mb-1 text-lg font-semibold text-slate-900">{listing.title}</h3>
														<p class="mb-3 text-sm text-slate-600 line-clamp-2">{listing.description}</p>

														<!-- Property Info -->
														<div class="mt-auto space-y-3">
															<!-- Address -->
															<div class="text-sm text-slate-600">
																{listing.address.formattedAddress}
															</div>

															<!-- Stats -->
															<div class="flex items-center justify-between">
																<div class="flex items-center gap-2">
																	{#if listing.bedrooms}
																		<span class="text-sm text-slate-600">
																			{listing.bedrooms} beds
																		</span>
																	{/if}
																	{#if listing.accommodates}
																		<span class="text-sm text-slate-600">•</span>
																		<span class="text-sm text-slate-600">
																			{listing.accommodates} guests
																		</span>
																	{/if}
																</div>
																{#if listing.base_price}
																	<div class="text-lg font-semibold text-green-600">
																		${listing.base_price.toLocaleString()}
																		<span class="text-xs font-normal text-slate-500">
																			/{listing.source === 'doorloop' ? 'month' : 'night'}
																		</span>
																	</div>
																{/if}
															</div>

															<!-- Amenities -->
															{#if listing.amenities && listing.amenities.length > 0}
																<div class="flex flex-wrap gap-1">
																	{#each listing.amenities.slice(0, 3) as amenity}
																		<span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
																			{amenity}
																		</span>
																	{/each}
																	{#if listing.amenities.length > 3}
																		<span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
																			+{listing.amenities.length - 3} more
																		</span>
																	{/if}
																</div>
															{/if}
														</div>
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/each}

					<!-- Empty State -->
					{#if Object.keys(groupedListings).length === 0 && !loading}
						<div class="py-16 text-center" in:fade>
							<div
								class="bg-coral-100 border-coral-200 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border"
							>
								<svg
									class="text-coral-500 h-10 w-10"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-1a1 1 0 011-1h1m-1 4h12"
									/>
								</svg>
							</div>
							<h3 class="mb-3 text-xl font-semibold text-slate-800">
								{hasActiveFilters() ? 'No apartments match your filters' : 'No apartment found'}
							</h3>
							<p class="mx-auto mb-6 max-w-md text-sm text-slate-600">
								{hasActiveFilters()
									? 'Try adjusting your search criteria or clearing some filters to see more results.'
									: 'There are no apartments to display at this time.'}
							</p>
							{#if hasActiveFilters()}
								<button
									on:click={clearAllFilters}
									class="from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 rounded-xl bg-gradient-to-r px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105"
								>
									Clear All Filters
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<PropertyDetails 
	property={selectedProperty}
	listingData={selectedPropertyData}
	show={showPropertyDetails}
	on:close={handleCloseDetails}
/>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(248, 115, 103, 0.1);
		border-radius: 2px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(248, 115, 103, 0.4);
		border-radius: 2px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(248, 115, 103, 0.6);
	}
</style>
