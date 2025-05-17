<script lang="ts">
	import ProtectedRoute from '$lib/protectedRoute.svelte';
	import type { FilterOptions, Listing } from '../../lib/types/properties';
	import { onMount } from 'svelte';

	// this comes from your load fn
	  import { propertyStore } from '$lib/stores/propertyStore';
    let store = $propertyStore;

	// keep the original array, and a mutable one for filtering
	let properties: Listing[] = [];

	let activeTab = 'overview';
	let filters: FilterOptions = {};
	let selectedProperty: Listing | undefined = undefined;

	onMount(() => {
		// start with everything visible
		properties = [...store.listings];
	});

	function handleFilterChange(newFilters: Partial<FilterOptions>) {
		filters = { ...filters, ...newFilters };

		let filtered = store.listings;

		if (filters.search) {
			const q = filters.search.toLowerCase();
			filtered = filtered.filter(
				(p) => p.nickname.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
			);
		}

		if (filters.propertyType) {
			filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
		}

		if (filters.location) {
			filtered = filtered.filter((p) => p.address.city === filters.location);
		}

		if (filters.status === 'active') {
			filtered = filtered.filter((p) => p.active);
		} else if (filters.status === 'inactive') {
			filtered = filtered.filter((p) => !p.active);
		}

		properties = filtered;
	}

	function selectProperty(p: Listing) {
		selectedProperty = p;
	}

	function goBack() {
		selectedProperty = undefined;
	}

	function setActiveTab(tab: string) {
		activeTab = tab;
	}
</script>

<ProtectedRoute>
	<div class="min-h-screen bg-gray-50 p-6">
		{#if selectedProperty}
			<!-- Property Detail View -->
			<div>
				<div class="mb-6 flex items-center justify-between">
					<button on:click={goBack} class="flex items-center text-gray-600 hover:text-gray-900">
						<svg class="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to listings
					</button>
				</div>

				<div class="mb-6">
					<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<h1 class="text-2xl font-bold">{selectedProperty.nickname}</h1>
							<p class="text-gray-600">{selectedProperty.title}</p>
						</div>
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium {selectedProperty.active
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800'}"
							>
								{selectedProperty.active ? 'Active' : 'Inactive'}
							</span>
							<span
								class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium {selectedProperty
									.cleaningStatus.value === 'clean'
									? 'bg-blue-100 text-blue-800'
									: 'bg-amber-100 text-amber-800'}"
							>
								{selectedProperty.cleaningStatus.value === 'clean' ? 'Clean' : 'Needs Cleaning'}
							</span>
						</div>
					</div>

					<div class="mb-2 flex items-center text-gray-600">
						<svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
						<span>{selectedProperty.address.full}</span>
					</div>

					<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
						<div class="flex items-center">
							<svg
								class="mr-1.5 h-4 w-4 text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span>{selectedProperty.propertyType}</span>
						</div>
						<div class="flex items-center">
							<svg
								class="mr-1.5 h-4 w-4 text-gray-500"
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
							<span>{selectedProperty.bedrooms} Bedrooms</span>
						</div>
						<div class="flex items-center">
							<svg
								class="mr-1.5 h-4 w-4 text-gray-500"
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
							<span>{selectedProperty.bathrooms} Bathrooms</span>
						</div>
						<div class="flex items-center">
							<svg
								class="mr-1.5 h-4 w-4 text-gray-500"
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
							<span>Sleeps {selectedProperty.accommodates}</span>
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
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="font-medium">{selectedProperty.prices.basePrice}</span>
							<span class="ml-1 text-xs">/ night</span>
						</div>
					</div>
				</div>

				<div class="mb-6">
					<div class="flex border-b border-gray-200">
						<button
							class="px-4 py-2 text-sm font-medium {activeTab === 'overview'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-600 hover:text-gray-900'}"
							on:click={() => setActiveTab('overview')}
						>
							Overview
						</button>
						<button
							class="px-4 py-2 text-sm font-medium {activeTab === 'photos'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-600 hover:text-gray-900'}"
							on:click={() => setActiveTab('photos')}
						>
							Photos
						</button>
						<button
							class="px-4 py-2 text-sm font-medium {activeTab === 'bookings'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-600 hover:text-gray-900'}"
							on:click={() => setActiveTab('bookings')}
						>
							Bookings
						</button>
						<button
							class="px-4 py-2 text-sm font-medium {activeTab === 'calendar'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-600 hover:text-gray-900'}"
							on:click={() => setActiveTab('calendar')}
						>
							Calendar
						</button>
						<button
							class="px-4 py-2 text-sm font-medium {activeTab === 'settings'
								? 'border-b-2 border-blue-600 text-blue-600'
								: 'text-gray-600 hover:text-gray-900'}"
							on:click={() => setActiveTab('settings')}
						>
							Settings
						</button>
					</div>
				</div>

				<!-- Tab Content -->
				{#if activeTab === 'overview'}
					<div>
						<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div class="rounded-lg bg-white p-5 shadow-sm">
								<h3 class="mb-4 flex items-center text-lg font-medium">
									<svg
										class="mr-2 h-5 w-5 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width={2}
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										/>
									</svg>
									Property Details
								</h3>
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-gray-500">Type</span>
										<span class="font-medium">{selectedProperty.propertyType}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Room Type</span>
										<span class="font-medium">{selectedProperty.roomType}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Bedrooms</span>
										<span class="font-medium">{selectedProperty.bedrooms}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Bathrooms</span>
										<span class="font-medium">{selectedProperty.bathrooms}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Accommodates</span>
										<span class="font-medium">{selectedProperty.accommodates} guests</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Status</span>
										<span
											class="font-medium {selectedProperty.active
												? 'text-green-600'
												: 'text-red-600'}"
										>
											{selectedProperty.active ? 'Active' : 'Inactive'}
										</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Cleaning</span>
										<span
											class="font-medium {selectedProperty.cleaningStatus.value === 'clean'
												? 'text-blue-600'
												: 'text-amber-600'}"
										>
											{selectedProperty.cleaningStatus.value === 'clean'
												? 'Clean'
												: 'Needs Cleaning'}
										</span>
									</div>
								</div>
							</div>

							<div class="rounded-lg bg-white p-5 shadow-sm">
								<h3 class="mb-4 flex items-center text-lg font-medium">
									<svg
										class="mr-2 h-5 w-5 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width={2}
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									Pricing
								</h3>
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-gray-500">Base Price</span>
										<span class="font-medium">${selectedProperty.prices.basePrice} per night</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Weekly Discount</span>
										<span class="font-medium"
											>{(1 - selectedProperty.prices.weeklyPriceFactor) * 100}%</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Monthly Discount</span>
										<span class="font-medium"
											>{(1 - selectedProperty.prices.monthlyPriceFactor) * 100}%</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Extra Guest Fee</span>
										<span class="font-medium"
											>${selectedProperty.prices.extraPersonFee} per person</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Included Guests</span>
										<span class="font-medium"
											>{selectedProperty.prices.guestsIncludedInRegularFee} guests</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Security Deposit</span>
										<span class="font-medium">${selectedProperty.prices.securityDepositFee}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Currency</span>
										<span class="font-medium">{selectedProperty.prices.currency}</span>
									</div>
								</div>
							</div>

							<div class="rounded-lg bg-white p-5 shadow-sm">
								<h3 class="mb-4 flex items-center text-lg font-medium">
									<svg
										class="mr-2 h-5 w-5 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									Stay Terms
								</h3>
								<div class="space-y-3">
									<div class="flex justify-between">
										<span class="text-gray-500">Minimum Nights</span>
										<span class="font-medium">{selectedProperty.terms.minNights} nights</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Maximum Nights</span>
										<span class="font-medium">{selectedProperty.terms.maxNights} nights</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Check-in Time</span>
										<span class="font-medium">4:00 PM</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-500">Check-out Time</span>
										<span class="font-medium">11:00 AM</span>
									</div>
								</div>

								<div class="mt-6 border-t border-gray-100 pt-4">
									<h4 class="mb-2 text-sm font-medium">Channel Distribution</h4>
									<div class="flex items-center gap-3">
										{#if selectedProperty.integrations}
											{#each selectedProperty.integrations as integration}
												<a
													href={integration.externalUrl}
													target="_blank"
													rel="noopener noreferrer"
													class="flex items-center text-sm text-blue-600 hover:text-blue-800"
												>
													<span class="capitalize">{integration.platform.replace(/\d+$/, '')}</span>
													<svg
														class="ml-1 h-3 w-3"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width={2}
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												</a>
											{/each}
										{/if}
									</div>
								</div>
							</div>
						</div>

						<div class="mb-8 rounded-lg bg-white p-5 shadow-sm">
							<h3 class="mb-4 text-lg font-medium">Description</h3>
							<p class="whitespace-pre-line text-gray-700">
								{selectedProperty.publicDescription.summary}
							</p>
						</div>

						<div class="mb-8 rounded-lg bg-white p-5 shadow-sm">
							<h3 class="mb-4 text-lg font-medium">Location</h3>
							<div class="flex items-start">
								<svg
									class="text-gselectedPropertyray-500 mr-2 mt-0.5 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
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
								<div>
									<p class="text-gray-700">{selectedProperty.address.buildingName}</p>
									<p class="text-gray-700">{selectedProperty.address.full}</p>
									<p class="mt-1 text-gray-500">
										Neighborhood: {selectedProperty.address.neighborhood}
									</p>
								</div>
							</div>
						</div>

						<div class="rounded-lg bg-white p-5 shadow-sm">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-lg font-medium">Amenities</h3>
							</div>
							<div class="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
								{#each selectedProperty.amenities.slice(0, 20) as amenity, i}
									<div class="flex items-center">
										<div class="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
										<span class="text-gray-700">{amenity}</span>
									</div>
								{/each}
							</div>
							{#if selectedProperty.amenities.length > 20}
								<button class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800">
									Show all {selectedProperty.amenities.length} amenities
								</button>
							{/if}
						</div>
					</div>
				{:else if activeTab === 'photos'}
					<div class="rounded-lg bg-white p-5 shadow-sm">
						<h3 class="mb-4 text-lg font-medium">Property Photos</h3>
						<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{#each selectedProperty.pictures as picture, i}
								<div class="aspect-square overflow-hidden rounded-lg">
									<img
										src={picture.thumbnail}
										alt={`Property view ${i + 1}`}
										class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
									/>
								</div>
							{/each}
						</div>
					</div>
				{:else if activeTab === 'settings'}
					<div class="rounded-lg bg-white p-5 shadow-sm">
						<h3 class="mb-6 text-lg font-medium">Property Settings</h3>
						<div class="max-w-2xl">
							<div class="mb-8">
								<h4 class="text-md mb-4 font-medium">Basic Information</h4>
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label class="mb-1 block text-sm font-medium text-gray-700">Property Name</label
										>
										<input
											type="text"
											value={selectedProperty.nickname}
											class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label class="mb-1 block text-sm font-medium text-gray-700">Property Type</label
										>
										<select
											class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option selected={selectedProperty.propertyType === 'Apartment'}
												>Apartment</option
											>
											<option selected={selectedProperty.propertyType === 'House'}>House</option>
											<option selected={selectedProperty.propertyType === 'Condo'}>Condo</option>
											<option selected={selectedProperty.propertyType === 'Villa'}>Villa</option>
										</select>
									</div>
								</div>
							</div>

							<div class="mb-8">
								<h4 class="text-md mb-4 font-medium">Property Status</h4>
								<div class="flex items-center space-x-4">
									<label class="inline-flex items-center">
										<input
											type="radio"
											name="status"
											checked={selectedProperty.active}
											class="form-radio h-4 w-4 text-blue-600"
										/>
										<span class="ml-2 text-gray-700">Active</span>
									</label>
									<label class="inline-flex items-center">
										<input
											type="radio"
											name="status"
											checked={!selectedProperty.active}
											class="form-radio h-4 w-4 text-blue-600"
										/>
										<span class="ml-2 text-gray-700">Inactive</span>
									</label>
								</div>
							</div>

							<div class="border-t border-gray-200 pt-6">
								<button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
									Save Changes
								</button>
								<button
									class="ml-3 rounded-md bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				{:else if activeTab === 'bookings'}
					<div class="rounded-lg bg-white p-5 shadow-sm">
						<h3 class="mb-4 text-lg font-medium">Bookings</h3>
						<p class="text-gray-500">No bookings found for this property.</p>
					</div>
				{:else if activeTab === 'calendar'}
					<div class="rounded-lg bg-white p-5 shadow-sm">
						<h3 class="mb-4 text-lg font-medium">Calendar</h3>
						<p class="text-gray-500">Calendar functionality will be implemented here.</p>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Properties List View -->
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
								on:input={(e: any) => handleFilterChange({ search: e.target.value })}
							/>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div class="relative">
							<select
								class="appearance-none rounded-md border border-gray-200 bg-white py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
								on:change={(e: any) => handleFilterChange({ propertyType: e.target.value })}
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
								on:change={(e: any) => handleFilterChange({ location: e.target.value })}
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
								on:change={(e: any) => handleFilterChange({ status: e.target.value })}
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
					{#each properties as property}
						<button
							class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
							on:click={() => selectProperty(property)}
						>
							<div class="relative h-48">
								<img
									src={property.picture.thumbnail}
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
								<div class="absolute bottom-3 left-3">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {property
											.cleaningStatus.value === 'clean'
											? 'bg-blue-100 text-blue-800'
											: 'bg-amber-100 text-amber-800'}"
									>
										{property.cleaningStatus.value === 'clean' ? 'Clean' : 'Needs Cleaning'}
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
									<span>{property.address.city}, {property.address.state}</span>
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
										<span>{property.propertyType}</span>
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
										<span class="font-medium">{property.prices.basePrice}</span>
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
		{/if}
	</div>
</ProtectedRoute>
