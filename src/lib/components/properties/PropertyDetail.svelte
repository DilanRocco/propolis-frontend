<script lang="ts">
	import type { Listing } from '$lib/types/properties';

	export let property: Listing;
	export let goBack: () => void;

	let activeTab = 'overview';
	let showAll = false;

	function setActiveTab(tab: string) {
		activeTab = tab;
	}
</script>

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
				<h1 class="text-2xl font-bold">{property.nickname}</h1>
				<p class="text-gray-600">{property.title}</p>
			</div>
			<div class="flex items-center gap-2">
				<span
					class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium {property.active
						? 'bg-green-100 text-green-800'
						: 'bg-red-100 text-red-800'}"
				>
					{property.active ? 'Active' : 'Inactive'}
				</span>
				<span
					class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium {property.cleaning_status ===
					'clean'
						? 'bg-blue-100 text-blue-800'
						: 'bg-amber-100 text-amber-800'}"
				>
					{property.cleaning_status === 'clean' ? 'Clean' : 'Needs Cleaning'}
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
			<span>{property.address_full}</span>
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
				<span>{property.property_type}</span>
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
				<span>{property.bedrooms} Bedrooms</span>
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
				<span>{property.bathrooms} Bathrooms</span>
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
				<span>Sleeps {property.accommodates}</span>
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
				<span class="font-medium">{property.base_price}</span>
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
							<span class="font-medium">{property.property_type}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Room Type</span>
							<span class="font-medium">{property.room_type}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Bedrooms</span>
							<span class="font-medium">{property.bedrooms}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Bathrooms</span>
							<span class="font-medium">{property.bathrooms}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Accommodates</span>
							<span class="font-medium">{property.accommodates} guests</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Status</span>
							<span
								class="font-medium {property.active
									? 'text-green-600'
									: 'text-red-600'}"
							>
								{property.active ? 'Active' : 'Inactive'}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Cleaning</span>
							<span
								class="font-medium {property.cleaning_status === 'clean'
									? 'text-blue-600'
									: 'text-amber-600'}"
							>
								{property.cleaning_status === 'clean' ? 'Clean' : 'Needs Cleaning'}
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
							<span class="font-medium">${property.base_price} per night</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Weekly Discount</span>
							<span class="font-medium">{(1 - property.weekly_price_factor) * 100}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Monthly Discount</span>
							<span class="font-medium">{(1 - property.monthly_price_factor) * 100}%</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Extra Guest Fee</span>
							<span class="font-medium">${property.extra_person_fee} per person</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Included Guests</span>
							<span class="font-medium">{property.guests_included} guests</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Security Deposit</span>
							<span class="font-medium">${property.security_deposit_fee}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Currency</span>
							<span class="font-medium">{property.currency}</span>
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
							<span class="font-medium">{property.min_nights} nights</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Maximum Nights</span>
							<span class="font-medium">{property.max_nights} nights</span>
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
							<!-- Channel distribution code would go here -->
						</div>
					</div>
				</div>
			</div>

			<div class="mb-8 rounded-lg bg-white p-5 shadow-sm">
				<h3 class="mb-4 text-lg font-medium">Description</h3>
				<p class="whitespace-pre-line text-gray-700">
					{property.description_summary}
				</p>
			</div>

			<div class="mb-8 rounded-lg bg-white p-5 shadow-sm">
				<h3 class="mb-4 text-lg font-medium">Location</h3>
				<div class="flex items-start">
					<svg
						class="text-gpropertyray-500 mr-2 mt-0.5 h-5 w-5"
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
						<p class="text-gray-700">{property.address_building_name}</p>
						<p class="text-gray-700">{property.address_full}</p>
						<p class="mt-1 text-gray-500">
							Neighborhood: {property.address_neighborhood}
						</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-5 shadow-sm">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-medium">Amenities</h3>
				</div>
				<div class="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
					{#each showAll ? property.amenities : property.amenities.slice(0, 20) as amenity, i}
						<div class="flex items-center">
							<div class="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
							<span class="text-gray-700">{amenity}</span>
						</div>
					{/each}
				</div>
				{#if property.amenities.length > 20}
					<button
						on:click={() => (showAll = !showAll)}
						class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
					>
						{showAll ? 'Show less' : `Show all ${property.amenities.length} amenities`}
					</button>
				{/if}
			</div>
		</div>
	{:else if activeTab === 'photos'}
		<div class="rounded-lg bg-white p-5 shadow-sm">
			<h3 class="mb-4 text-lg font-medium">Property Photos</h3>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				<!-- Photo grid would go here -->
			</div>
		</div>
	{:else if activeTab === 'bookings'}
		<div class="rounded-lg bg-white p-5 shadow-sm">
			<h3 class="mb-4 text-lg font-medium">Bookings</h3>
			<p class="text-gray-500">No bookings found for this property.</p>
		</div>
	{/if}
</div>