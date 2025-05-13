<script lang="ts">
    // Properties data - would normally be fetched from an API
    import type { Property, FilterOptions } from "../../lib/types/properties"
    import { onMount } from 'svelte';
  
    // Mock properties data
    const dummyProperties: Property[] = [
      {
        _id: "67929fe72f91560011fb87c5",
        nickname: "Saffron 41 PH",
        title: "3 Bed & Bath Penthouse | Near Beach & Downtown",
        propertyType: "Apartment",
        address: {
          city: "Miami",
          state: "Florida",
          neighborhood: "East Little Havana"
        },
        bedrooms: 3,
        bathrooms: 3,
        accommodates: 6,
        prices: {
          basePrice: 212,
          currency: "USD"
        },
        picture: {
          thumbnail: "https://assets.guesty.com/image/upload/h_200,c_fit/v1741032467/production/5ec3f5d82d5b66002d600010/zoduosbbbrsbj3kmd9gc.jpg"
        },
        active: true,
        cleaningStatus: { value: "dirty" }
      },
      {
        _id: "67929fe72f91560011fb87c6",
        nickname: "Bayfront Luxury",
        title: "2 Bed Modern Condo with Ocean Views",
        propertyType: "Condo",
        address: {
          city: "Miami",
          state: "Florida",
          neighborhood: "Brickell"
        },
        bedrooms: 2,
        bathrooms: 2,
        accommodates: 4,
        prices: {
          basePrice: 175,
          currency: "USD"
        },
        picture: {
          thumbnail: "/api/placeholder/400/320"
        },
        active: true,
        cleaningStatus: { value: "clean" }
      },
      {
        _id: "67929fe72f91560011fb87c7",
        nickname: "Palm Breeze Villa",
        title: "4 Bed Villa with Private Pool & Garden",
        propertyType: "Villa",
        address: {
          city: "Fort Lauderdale",
          state: "Florida",
          neighborhood: "Las Olas"
        },
        bedrooms: 4,
        bathrooms: 3.5,
        accommodates: 8,
        prices: {
          basePrice: 345,
          currency: "USD"
        },
        picture: {
          thumbnail: "/api/placeholder/400/320"
        },
        active: true,
        cleaningStatus: { value: "clean" }
      },
      {
        _id: "67929fe72f91560011fb87c8",
        nickname: "Urban Loft",
        title: "Modern Downtown Loft | Walk to Everything",
        propertyType: "Apartment",
        address: {
          city: "Miami",
          state: "Florida",
          neighborhood: "Downtown"
        },
        bedrooms: 1,
        bathrooms: 1,
        accommodates: 2,
        prices: {
          basePrice: 135,
          currency: "USD"
        },
        picture: {
          thumbnail: "/api/placeholder/400/320"
        },
        active: false,
        cleaningStatus: { value: "dirty" }
      },
      {
        _id: "67929fe72f91560011fb87c9",
        nickname: "Beachside Cottage",
        title: "Cozy Beach Cottage Steps from Ocean",
        propertyType: "House",
        address: {
          city: "Key Biscayne",
          state: "Florida",
          neighborhood: "Oceanfront"
        },
        bedrooms: 2,
        bathrooms: 1,
        accommodates: 4,
        prices: {
          basePrice: 225,
          currency: "USD"
        },
        picture: {
          thumbnail: "/api/placeholder/400/320"
        },
        active: true,
        cleaningStatus: { value: "clean" }
      }
    ];
  
    // Main property data from the provided JSON
    const samplePropertyData = {
      _id: "67929fe72f91560011fb87c5",
      nickname: "Saffron 41 PH",
      title: "3 Bed & Bath Penthouse | Near Beach & Downtown",
      bedrooms: 3,
      bathrooms: 3,
      accommodates: 6,
      propertyType: "Apartment",
      roomType: "Entire home/apt",
      address: {
        full: "1110 Northwest 7th Street, Miami, Florida 33136, United States",
        city: "Miami",
        state: "Florida",
        neighborhood: "East Little Havana",
        buildingName: "Saffron Apartments"
      },
      prices: {
        basePrice: 212,
        monthlyPriceFactor: 0.88,
        weeklyPriceFactor: 0.89,
        currency: "USD",
        extraPersonFee: 10,
        guestsIncludedInRegularFee: 6,
        securityDepositFee: 150
      },
      terms: {
        minNights: 3,
        maxNights: 180
      },
      active: true,
      amenities: [
        "Air conditioning",
        "Bed linens",
        "Body soap",
        "Carbon monoxide detector",
        "Cooking essentials",
        "Wifi",
        "TV",
        "Kitchen",
        "Washer"
      ],
      cleaningStatus: { value: "dirty" },
      picture: {
        thumbnail: "https://assets.guesty.com/image/upload/h_200,c_fit/v1741032467/production/5ec3f5d82d5b66002d600010/zoduosbbbrsbj3kmd9gc.jpg"
      },
      publicDescription: {
        summary: "PENTHOUSE | Elegant 3-Bedroom, 3-Bathroom with Stunning Views\nExperience the comfort and sophistication of this stunning penthouse, featuring expansive windows, soaring ceilings, and a million-dollar view of the city skyline and nearby river. Perfectly situated just minutes from Downtown, Brickell, and the Health District, this apartment offers convenience and style in equal measure.\n\nEach bedroom is thoughtfully designed with premium-quality beds for unparalleled comfort, private en-suite bathrooms, generous closet space, and dedicated workstations equipped with ergonomic office chairs.\n\nStep outside and enjoy the shared outdoor lounge or take in the incredible views from the rooftop deck. Just across the street, the river offers a vibrant scene of passing boats and a scenic path for leisurely strolls in the heart of the city."
      },
      pictures: [
        { _id: "67c60c2a482b95001e5c7e72", thumbnail: "https://assets.guesty.com/image/upload/h_200,c_fit/v1741032467/production/5ec3f5d82d5b66002d600010/zoduosbbbrsbj3kmd9gc.jpg" },
        { _id: "67c6176bca13d60012268b31", thumbnail: "/api/placeholder/400/320" },
        { _id: "67c60c2a482b95001e5c7e78", thumbnail: "/api/placeholder/400/320" }
      ],
      integrations: [
        {
          platform: "airbnb2",
          externalUrl: "https://www.airbnb.com/rooms/1359652595503598516"
        }
      ]
    };
  
    // Reactive variables
    let properties = [...dummyProperties];
    let selectedPropertyId: string = "";
    let activeTab = 'overview';
    let filters: FilterOptions = {};
    
    // Get selected property
    $: selectedProperty = selectedPropertyId 
      ? selectedPropertyId === samplePropertyData._id 
        ? samplePropertyData 
        : samplePropertyData
      : samplePropertyData;
    
    // Handle filter changes
    function handleFilterChange(newFilters: Object) {
      filters = {...filters, ...newFilters};
      
      // Here you would normally fetch filtered data from an API
      // For demo purposes, we'll just filter the dummy data
      let filteredProperties = dummyProperties;
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredProperties = filteredProperties.filter(p => 
          p.nickname.toLowerCase().includes(search) || 
          p.title.toLowerCase().includes(search)
        );
      }
      
      if (filters.propertyType && filters.propertyType !== '') {
        filteredProperties = filteredProperties.filter(p => 
          p.propertyType === filters.propertyType
        );
      }
      
      if (filters.location && filters.location !== '') {
        filteredProperties = filteredProperties.filter(p => 
          p.address.city === filters.location
        );
      }
      
      if (filters.status) {
        if (filters.status === 'active') {
          filteredProperties = filteredProperties.filter(p => p.active);
        } else if (filters.status === 'inactive') {
          filteredProperties = filteredProperties.filter(p => !p.active);
        }
      }
      
      properties = filteredProperties;
    }
    
    function selectProperty(id: string) {
      selectedPropertyId = id;
    }
    
    function goBack() {
      selectedPropertyId = "";
    }
    
    function setActiveTab(tab: string) {
      activeTab = tab;
    }
  </script>
  
  <div class="bg-gray-50 min-h-screen p-6">
    {#if selectedPropertyId}
      <!-- Property Detail View -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <button 
            on:click={goBack}
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </button>
          
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
            <button class="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bookings</span>
            </button>
          </div>
        </div>
        
        <div class="mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 class="text-2xl font-bold">{selectedProperty.nickname}</h1>
              <p class="text-gray-600">{selectedProperty.title}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium {
                selectedProperty.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }">
                {selectedProperty.active ? 'Active' : 'Inactive'}
              </span>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium {
                selectedProperty.cleaningStatus.value === 'clean' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }">
                {selectedProperty.cleaningStatus.value === 'clean' ? 'Clean' : 'Needs Cleaning'}
              </span>
            </div>
          </div>
          
          <div class="flex items-center text-gray-600 mb-2">
            <svg class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{selectedProperty.address.full}</span>
          </div>
          
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div class="flex items-center">
              <svg class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{selectedProperty.propertyType}</span>
            </div>
            <div class="flex items-center">
              <svg class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span>{selectedProperty.bedrooms} Bedrooms</span>
            </div>
            <div class="flex items-center">
              <svg class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span>{selectedProperty.bathrooms} Bathrooms</span>
            </div>
            <div class="flex items-center">
              <svg class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Sleeps {selectedProperty.accommodates}</span>
            </div>
            <div class="flex items-center">
              <svg class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">{selectedProperty.prices.basePrice}</span>
              <span class="text-xs ml-1">/ night</span>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <div class="flex border-b border-gray-200">
            <button
              class="px-4 py-2 text-sm font-medium {
                activeTab === 'overview' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }"
              on:click={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              class="px-4 py-2 text-sm font-medium {
                activeTab === 'photos' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }"
              on:click={() => setActiveTab('photos')}
            >
              Photos
            </button>
            <button
              class="px-4 py-2 text-sm font-medium {
                activeTab === 'bookings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }"
              on:click={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              class="px-4 py-2 text-sm font-medium {
                activeTab === 'calendar' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }"
              on:click={() => setActiveTab('calendar')}
            >
              Calendar
            </button>
            <button
              class="px-4 py-2 text-sm font-medium {
                activeTab === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }"
              on:click={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
        {#if activeTab === 'overview'}
          <div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div class="bg-white p-5 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium mb-4 flex items-center">
                  <svg class="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
                    <span class="font-medium {selectedProperty.active ? 'text-green-600' : 'text-red-600'}">
                      {selectedProperty.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Cleaning</span>
                    <span class="font-medium {selectedProperty.cleaningStatus.value === 'clean' ? 'text-blue-600' : 'text-amber-600'}">
                      {selectedProperty.cleaningStatus.value === 'clean' ? 'Clean' : 'Needs Cleaning'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="bg-white p-5 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium mb-4 flex items-center">
                  <svg class="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    <span class="font-medium">{(1 - selectedProperty.prices.weeklyPriceFactor) * 100}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Monthly Discount</span>
                    <span class="font-medium">{(1 - selectedProperty.prices.monthlyPriceFactor) * 100}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Extra Guest Fee</span>
                    <span class="font-medium">${selectedProperty.prices.extraPersonFee} per person</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Included Guests</span>
                    <span class="font-medium">{selectedProperty.prices.guestsIncludedInRegularFee} guests</span>
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
              
              <div class="bg-white p-5 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium mb-4 flex items-center">
                  <svg class="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                
                <div class="mt-6 pt-4 border-t border-gray-100">
                  <h4 class="text-sm font-medium mb-2">Channel Distribution</h4>
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
                          <svg class="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      {/each}
                    {/if}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-5 rounded-lg shadow-sm mb-8">
              <h3 class="text-lg font-medium mb-4">Description</h3>
              <p class="text-gray-700 whitespace-pre-line">{selectedProperty.publicDescription.summary}</p>
            </div>
            
            <div class="bg-white p-5 rounded-lg shadow-sm mb-8">
              <h3 class="text-lg font-medium mb-4">Location</h3>
              <div class="flex items-start">
                <svg class="h-5 w-5 text-gselectedPropertyray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p class="text-gray-700">{selectedProperty.address.buildingName}</p>
                  <p class="text-gray-700">{selectedProperty.address.full}</p>
                  <p class="text-gray-500 mt-1">Neighborhood: {selectedProperty.address.neighborhood}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-5 rounded-lg shadow-sm">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">Amenities</h3>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
                {#each selectedProperty.amenities.slice(0, 20) as amenity, i}
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span class="text-gray-700">{amenity}</span>
                  </div>
                {/each}
              </div>
              {#if selectedProperty.amenities.length > 20}
                <button class="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Show all {selectedProperty.amenities.length} amenities
                </button>
              {/if}
            </div>
          </div>
        {:else if activeTab === 'photos'}
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-4">Property Photos</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each selectedProperty.pictures as picture, i}
                <div class="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={picture.thumbnail} 
                    alt={`Property view ${i + 1}`} 
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              {/each}
            </div>
          </div>
        {:else if activeTab === 'settings'}
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-6">Property Settings</h3>
            <div class="max-w-2xl">
              <div class="mb-8">
                <h4 class="text-md font-medium mb-4">Basic Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input 
                      type="text" 
                      value={selectedProperty.nickname}
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option selected={selectedProperty.propertyType === "Apartment"}>Apartment</option>
                      <option selected={selectedProperty.propertyType === "House"}>House</option>
                      <option selected={selectedProperty.propertyType === "Condo"}>Condo</option>
                      <option selected={selectedProperty.propertyType === "Villa"}>Villa</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="mb-8">
                <h4 class="text-md font-medium mb-4">Property Status</h4>
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
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Save Changes
                </button>
                <button class="ml-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        {:else if activeTab === 'bookings'}
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-4">Bookings</h3>
            <p class="text-gray-500">No bookings found for this property.</p>
          </div>
        {:else if activeTab === 'calendar'}
          <div class="bg-white p-5 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium mb-4">Calendar</h3>
            <p class="text-gray-500">Calendar functionality will be implemented here.</p>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Properties List View -->
      <div>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Properties</h1>
            <p class="text-gray-600">Manage your properties and vacation rentals</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>Export</span>
            </button>
            <button class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Property</span>
            </button>
          </div>
        </div>
        
        <!-- Filter Bar -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div class="flex-1 min-w-64">
            <div class="relative">
              <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search properties..."
                class="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                on:input={(e: any) => handleFilterChange({ search: e.target.value })}
              />
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="relative">
              <select 
                class="appearance-none bg-white pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                on:change={(e: any) => handleFilterChange({ propertyType: e.target.value })}
              >
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
              </select>
              <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div class="relative">
              <select 
                class="appearance-none bg-white pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                on:change={(e: any) => handleFilterChange({ location: e.target.value })}
              >
                <option value="">Location</option>
                <option value="Miami">Miami</option>
                <option value="Fort Lauderdale">Fort Lauderdale</option>
                <option value="Key Biscayne">Key Biscayne</option>
              </select>
              <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div class="relative">
              <select 
                class="appearance-none bg-white pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                on:change={(e: any) => handleFilterChange({ status: e.target.value })}
              >
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <svg class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <button class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>More Filters</span>
            </button>
          </div>
        </div>
        
        <!-- Property Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each properties as property}
            <button
              class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              on:click={() => selectProperty(property._id)}
            >
              <div class="relative h-48">
                <img 
                  src={property.picture.thumbnail} 
                  alt={property.title} 
                  class="w-full h-full object-cover"
                />
                <div class="absolute top-3 right-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {
                    property.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }">
                    {property.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div class="absolute bottom-3 left-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {
                    property.cleaningStatus.value === 'clean' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }">
                    {property.cleaningStatus.value === 'clean' ? 'Clean' : 'Needs Cleaning'}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-lg mb-1 truncate text-start">{property.nickname}</h3>
                <p class="text-sm text-gray-500 mb-2 truncate">{property.title}</p>
                
                <div class="flex items-center text-gray-600 text-sm mb-2">
                  <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.address.city}, {property.address.state}</span>
                </div>
                
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center text-gray-600 text-sm">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{property.propertyType}</span>
                  </div>
                  <div class="flex items-center text-gray-600 text-sm">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{property.prices.basePrice}</span>
                    <span class="text-xs ml-1">/ night</span>
                  </div>
                </div>
                
                <div class="flex justify-between items-center text-sm">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <span>{property.bedrooms}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <span>{property.bathrooms}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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