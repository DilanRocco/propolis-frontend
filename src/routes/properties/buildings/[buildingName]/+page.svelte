<!-- src/routes/properties/buildings/[buildingName]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { propertyStore } from '$lib/stores/propertyStore';
  import type { Listing } from '$lib/types/properties';
  import PropertyAttributes from '$lib/components/dashboard/PropertyAttributes.svelte';

  // Get building name from URL params
  $: buildingName = decodeURIComponent($page.params.buildingName);
  
  // Subscribe to store
  $: ({ listings, listingData, loading, error } = $propertyStore);
  
  // Filter listings for this building
  $: buildingListings = listings.filter(listing => 
    listing.address_building_name === buildingName
  );

  // Calculate building stats
  $: buildingStats = {
    totalProperties: buildingListings.length,
    activeProperties: buildingListings.filter(l => l.active).length,
    totalAccommodates: buildingListings.reduce((sum, l) => sum + (l.accommodates || 0), 0),
    avgPrice: Math.round(buildingListings.reduce((sum, l) => sum + (l.base_price || 0), 0) / buildingListings.length || 0),
    propertyTypes: [...new Set(buildingListings.map(l => l.property_type || l.type))],
    cleanProperties: buildingListings.filter(l => l.cleaning_status === 'clean').length,
    totalRevenue: Object.values(listingData).flat().reduce((sum, reservation) => sum + reservation.total_paid, 0)
  };

  // Get building location info from first listing
  $: buildingInfo = buildingListings[0] || null;

  function goToListing(listingId: string) {
    goto(`/properties/listings/${listingId}`);
  }

  function goBack() {
    goto('/properties');
  }

  async function loadReservationData() {
    if (buildingListings.length > 0) {
      const propertyNames = buildingListings.map(l => l.title);
      await propertyStore.getDataFor(fetch, propertyNames);
    }
  }

  onMount(async () => {
    
    await propertyStore.loadListings(fetch);
    await loadReservationData();
  });
</script>

<svelte:head>
  <title>{buildingName} - Building Overview</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            on:click={goBack}
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>
        </div>
        
        <div class="flex items-center space-x-3">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Manage Building
          </button>
          <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-6 py-8">
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading building data...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading building data</h3>
            <p class="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Building Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">{buildingName}</h1>
            {#if buildingInfo}
              <p class="text-lg text-gray-600 mt-2">
                {buildingInfo.address_full}
              </p>
              <p class="text-gray-500">
                {buildingInfo.address_city}, {buildingInfo.address_state}
              </p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-1a1 1 0 011-1h1m-1 4h12" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Properties</p>
              <p class="text-2xl font-bold text-gray-900">{buildingStats.totalProperties}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Properties</p>
              <p class="text-2xl font-bold text-gray-900">{buildingStats.activeProperties}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Capacity</p>
              <p class="text-2xl font-bold text-gray-900">{buildingStats.totalAccommodates}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg. Price</p>
              <p class="text-2xl font-bold text-gray-900">${buildingStats.avgPrice}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Building Attributes -->
      <div class="mb-8">
        <PropertyAttributes 
          propertyId={buildingName}
          isEditable={true}
          isBuilding={true}
          on:change={(e) => {
            // Handle attribute changes here
            console.log('Building attributes changed:', e.detail.attributes);
          }}
        />
      </div>

      <!-- Additional Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Property Types</h3>
          <div class="space-y-2">
            {#each buildingStats.propertyTypes as type}
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 capitalize">{type}</span>
                <span class="text-sm font-medium text-gray-900">
                  {buildingListings.filter(l => l.property_type === type).length}
                </span>
              </div>
            {/each}
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Revenue Overview</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Revenue</span>
              <span class="text-lg font-bold text-green-600">${buildingStats.totalRevenue.toLocaleString()}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Avg per Property</span>
              <span class="text-sm font-medium text-gray-900">
                ${Math.round(buildingStats.totalRevenue / buildingStats.totalProperties || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Properties List -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Properties in {buildingName}</h2>
            <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Details
            </button>
          </div>
        </div>

        <div class="divide-y divide-gray-200">
          {#each buildingListings as listing}
            <div class="p-6 hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  {console.log(listing)}
                  {#if listing.pictures && listing.pictures.length > 0}
                    <img 
                      src={listing.pictures[0]} 
                      alt={listing.title}
                      class="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                  {:else if listing.thumbnail_url && listing.thumbnail_url !== ""}
                    <img 
                      src={listing.thumbnail_url} 
                      alt={listing.title}
                      class="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                  {:else}
                    <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  {/if}

                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{listing.title}</h3>
                    {#if listing.nickname}
                      <p class="text-sm text-gray-600">{listing.nickname}</p>
                    {/if}
                    <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{listing.property_type || listing.type}</span>
                      <span>•</span>
                      <span>{listing.bedrooms || 0} bed</span>
                      <span>•</span>
                      <span>Sleeps {listing.accommodates || 0}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <div class="text-lg font-semibold text-gray-900">${listing.base_price}</div>
                    <div class="text-sm text-gray-500">per night</div>
                  </div>

                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {listing.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      {listing.active ? 'Active' : 'Inactive'}
                    </span>
                    
                  </div>

                  <button
                    on:click={() => goToListing(listing.id)}
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>