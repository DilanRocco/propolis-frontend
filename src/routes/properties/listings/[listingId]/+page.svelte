<!-- src/routes/properties/listings/[listingId]/+page.svelte -->
<script lang="ts">
  // 🚩 FEATURE FLAG: Toggle between full gallery and single image mode
  const ENABLE_GALLERY_MODE = false; // Set to false to show only first image
  
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { propertyStore } from '$lib/stores/propertyStore';
  import type { Listing } from '$lib/types/properties';
  import { fetchPropertyById, type DetailedListing } from '$lib/api/properties';
  import PictureGallery from '$lib/components/PictureGallery.svelte';

  // Get listing ID from URL params
  $: listingId = $page.params.listingId;
  
  // Subscribe to store
  $: ({ listings, listingData, loading, error } = $propertyStore);
  
  // Find the specific listing
  $: listing = listings.find(l => l.id === listingId) as Listing | undefined;
  
  // Get reservation data for this property
  $: propertyReservations = listing ? listingData[listing.title] || [] : [];
  
  // Calculate reservation stats
  $: reservationStats = {
    totalReservations: propertyReservations.length,
    totalRevenue: propertyReservations.reduce((sum, r) => sum + r.total_paid, 0),
    avgRevenue: propertyReservations.length > 0 ? propertyReservations.reduce((sum, r) => sum + r.total_paid, 0) / propertyReservations.length : 0,
    recentReservations: propertyReservations
      .sort((a, b) => new Date(b.guesty_created_at).getTime() - new Date(a.guesty_created_at).getTime())
      .slice(0, 5)
  };

  let activeTab = 'overview';
  let detailedListing: DetailedListing | null = null;
  let loadingImages = false;
  let imageError: string | null = null;
  let showEnhancedImages = false; // Start with basic images, upgrade to enhanced
  
  function goBack() {
    // Go back to building overview if we came from there, otherwise to properties list
    const buildingName = listing?.address_building_name;
    if (buildingName) {
      goto(`/properties/buildings/${encodeURIComponent(buildingName)}`);
    } else {
      goto('/properties');
    }
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  async function loadReservationData() {
    if (listing) {
      await propertyStore.getDataFor(fetch, [listing.title]);
    }
  }

  async function loadDetailedImages() {
    if (!listing?.id || detailedListing?.id === listing.id) return;

    loadingImages = true;
    imageError = null;

    try {
      detailedListing = await fetchPropertyById(listing.id, fetch);
      showEnhancedImages = true; // Switch to enhanced images once loaded
      console.log('Loaded high-quality images for property:', detailedListing);
    } catch (err) {
      imageError = err instanceof Error ? err.message : 'Could not load high-quality images';
      console.error('Error loading detailed images:', err);
    } finally {
      loadingImages = false;
    }
  }

  onMount(async () => {
    await propertyStore.loadListings(fetch);
    await loadReservationData();
    
    // Load detailed images in background after initial render
    if (listing) {
      // Small delay to let the page render first
      setTimeout(() => {
        loadDetailedImages();
      }, 100);
    }
  });

  // Watch for listing changes to load detailed images
  $: if (listing?.id && !detailedListing) {
    // Load detailed images in background
    setTimeout(() => {
      loadDetailedImages();
    }, 100);
  }
</script>

<svelte:head>
  <title>{listing?.title || 'Property Details'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-6 py-4" style="max-width: 1400px;">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            on:click={goBack}
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Building
          </button>
          
          {#if listing}
            <nav class="flex items-center space-x-2 text-sm text-gray-500">
              <span>Properties</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>{listing.address_building_name}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-gray-900">{listing.title}</span>
            </nav>
          {/if}
        </div>
        
        <div class="flex items-center space-x-3">


          <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            View Calendar
          </button>
          <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-6 py-8" style="max-width: 1400px;">
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading property details...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading property</h3>
            <p class="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    {:else if !listing}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.18 14.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Property not found</h3>
        <p class="mt-2 text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
      </div>
    {:else}
      <!-- Property Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            {#if listing.nickname}
              <p class="text-xl text-gray-600 mb-2">{listing.nickname}</p>
            {/if}
            <p class="text-xl text-gray-500">{listing.address_full}</p>
            <p class="text-xl text-gray-500">{listing.address_city}, {listing.address_state}</p>
          </div>
          
          <div class="text-right">
            <div class="text-3xl font-bold text-gray-900">${listing.base_price}</div>
            <div class="text-sm text-gray-500">per night • {listing.currency}</div>
            <div class="mt-2 flex items-center space-x-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {listing.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                {listing.active ? 'Active' : 'Inactive'}
              </span>
              {#if listing.cleaning_status}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {listing.cleaning_status === 'clean' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
                  {listing.cleaning_status === 'clean' ? 'Clean' : 'Needs Cleaning'}
                </span>
              {/if}
            </div>
          </div>
        </div>

        <!-- Property Image Gallery -->
        <div class="mb-6">
          <div class="bg-white rounded-xl shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Property Photos</h2>
              {#if loadingImages && !showEnhancedImages}
                <div class="flex items-center text-sm text-gray-500">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Upgrading to high-quality images...
                </div>
                             {:else if showEnhancedImages && detailedListing?.detailed_pictures && detailedListing.detailed_pictures.length > 0}
                 <div class="text-sm text-green-600">
                   ✓ {detailedListing.detailed_pictures.length} high-quality photos
                 </div>
              {:else}
                <div class="text-sm text-gray-500">
                  {(listing.pictures?.length || 0) + (listing.thumbnail_url ? 1 : 0)} photos
                </div>
              {/if}
            </div>
            
            {#if ENABLE_GALLERY_MODE}
              <PictureGallery 
                pictures={showEnhancedImages && detailedListing?.detailed_pictures.length ? 
                  detailedListing.detailed_pictures.map(p => p.full_url) : 
                  (listing.pictures && listing.pictures.length > 0 ? listing.pictures : (listing.thumbnail_url ? [listing.thumbnail_url] : []))}
                title={listing.title}
                showThumbnails={true}
                maxHeight="500px"
              />
            {:else}
              <!-- Single Image Mode -->
              <div class="single-image-container" style="height: 500px">
                {#if showEnhancedImages && detailedListing?.detailed_pictures.length}
                  <img 
                    src={detailedListing.detailed_pictures[0].full_url}
                    alt={listing.title}
                    class="w-full h-full object-cover rounded-lg"
                  />
                {:else if listing.pictures && listing.pictures.length > 0}
                  <img 
                    src={listing.pictures[0]}
                    alt={listing.title}
                    class="w-full h-full object-cover rounded-lg"
                  />
                {:else if listing.thumbnail_url}
                  <img 
                    src={listing.thumbnail_url}
                    alt={listing.title}
                    class="w-full h-full object-cover rounded-lg"
                  />
                {:else}
                  <div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-gray-500">No image available</span>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-4 border text-center">
          <div class="text-2xl font-bold text-gray-900">{listing.accommodates}</div>
          <div class="text-sm text-gray-600">Guests</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border text-center">
          <div class="text-2xl font-bold text-gray-900">{listing.bedrooms}</div>
          <div class="text-sm text-gray-600">Bedrooms</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border text-center">
          <div class="text-2xl font-bold text-gray-900">{listing.bathrooms}</div>
          <div class="text-sm text-gray-600">Bathrooms</div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border text-center">
          <div class="text-2xl font-bold text-gray-900">{listing.area_square_feet}</div>
          <div class="text-sm text-gray-600">Sq Ft</div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-6">
        <nav class="flex space-x-8 border-b border-gray-200">
          <button
            on:click={() => setActiveTab('overview')}
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            Overview
          </button>
          <button
            on:click={() => setActiveTab('reservations')}
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'reservations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            Reservations
          </button>
          <button
            on:click={() => setActiveTab('amenities')}
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'amenities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            Amenities
          </button>
          <button
            on:click={() => setActiveTab('pricing')}
            class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'pricing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            Pricing
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      {#if activeTab === 'overview'}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Property Details -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Property Type</dt>
                <dd class="text-sm text-gray-900 capitalize">{listing.property_type}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Room Type</dt>
                <dd class="text-sm text-gray-900 capitalize">{listing.room_type}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Min Nights</dt>
                <dd class="text-sm text-gray-900">{listing.min_nights}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Max Nights</dt>
                <dd class="text-sm text-gray-900">{listing.max_nights}</dd>
              </div>
              {#if listing.minimum_age}
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-600">Minimum Age</dt>
                  <dd class="text-sm text-gray-900">{listing.minimum_age}</dd>
                </div>
              {/if}
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Security Deposit</dt>
                <dd class="text-sm text-gray-900">${listing.security_deposit_fee}</dd>
              </div>
            </dl>
          </div>

          <!-- Reservation Stats -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Reservation Statistics</h2>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Total Reservations</dt>
                <dd class="text-sm font-bold text-gray-900">{reservationStats.totalReservations}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Total Revenue</dt>
                <dd class="text-sm font-bold text-green-600">${reservationStats.totalRevenue.toLocaleString()}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm font-medium text-gray-600">Average per Reservation</dt>
                <dd class="text-sm font-bold text-gray-900">${Math.round(reservationStats.avgRevenue).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>

        {#if listing.description_summary}
          <div class="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-700 leading-relaxed">{listing.description_summary}</p>
          </div>
        {/if}
      {:else if activeTab === 'reservations'}
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Recent Reservations</h2>
          </div>
          
          {#if reservationStats.recentReservations.length > 0}
            <div class="divide-y divide-gray-200">
              {#each reservationStats.recentReservations as reservation}
                <div class="px-6 py-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-gray-900">Reservation #{reservation.id}</div>
                      <div class="text-sm text-gray-600">
                        Created: {new Date(reservation.guesty_created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-semibold text-green-600">${reservation.total_paid.toLocaleString()}</div>
                      <div class="text-sm text-gray-500">Total Paid</div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="px-6 py-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No reservations found</h3>
              <p class="mt-2 text-gray-600">This property doesn't have any reservation data yet.</p>
            </div>
          {/if}
        </div>
      {:else if activeTab === 'amenities'}
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
          {#if listing.amenities.length > 0}
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {#each listing.amenities as amenity}
                <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm text-gray-700">{amenity}</span>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-600">No amenities listed for this property.</p>
          {/if}

          {#if listing.tags && listing.tags.length > 0}
            <div class="mt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                {#each listing.tags as tag}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {:else if activeTab === 'pricing'}
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Pricing Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Base Price</dt>
              <dd class="text-sm text-gray-900">${listing.base_price} {listing.currency}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Weekly Price Factor</dt>
              <dd class="text-sm text-gray-900">{listing.weekly_price_factor}x</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Monthly Price Factor</dt>
              <dd class="text-sm text-gray-900">{listing.monthly_price_factor}x</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Extra Person Fee</dt>
              <dd class="text-sm text-gray-900">${listing.extra_person_fee}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Security Deposit</dt>
              <dd class="text-sm text-gray-900">${listing.security_deposit_fee}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Guests Included</dt>
              <dd class="text-sm text-gray-900">{listing.guests_included}</dd>
            </div>
          </dl>
        </div>
      {/if}
    {/if}
  </div>
</div>