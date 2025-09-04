// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import type { DoorloopProperty, DoorloopResponse, DoorloopUnit, DoorloopUnitsResponse } from '../types/doorloop';
import { PUBLIC_API_URL } from '$env/static/public';

export interface ListingData {
  id: number;
  guesty_created_at: Date;
  total_paid: number;
  property_full_name?: string;
  source: 'guesty' | 'doorloop'; // Add source to distinguish between data sources
}

export interface ListingNames {
  property_names: string[];
  building_names: string[];
}

export interface PropertyState {
  listings: Listing[];
  listingNames: ListingNames;
  listingData: Record<string, ListingData[]>;
  loading: boolean;
  error: string | null;
}

// Property mapping interface
export interface PropertyMapping {
  doorloopId: string;
  guestyId: string;
  propertyName: string;
}

export interface PropertyMappingState {
  mappings: PropertyMapping[];
  loading: boolean;
  error: string | null;
}

function createPropertyStore() {
  const initialState: PropertyState = {
    listings: [],
    listingNames: {
      property_names: [],
      building_names: []
    },
    listingData: {},
    loading: false,
    error: null,
  };

  const { subscribe, update, set } = writable<PropertyState>(initialState);
  let loadedListings = false;
  let loadedNames = false;

  // Utility function to normalize property types
  function normalizePropertyType(propertyType: string | undefined): string {
    if (!propertyType) return 'Unknown';
    const normalized = propertyType.toLowerCase();
    
    // Map common property type variations
    if (normalized === 'dorm') {
      return 'Apartment';
    }
    if (normalized === 'residential_multi_family') {
      return 'Multi-Family';
    }
    
    // Capitalize first letter for consistency
    return propertyType.charAt(0).toUpperCase() + propertyType.slice(1).toLowerCase();
  }

  return {
    subscribe,

    /** 
     * Fetch reservations for one or multiple properties and store under listingData
     */
    async getDataFor(fetchFn: typeof fetch,
      unit_names?: string | string[],
      building_names?: string[],
      date_start?: string,
      date_end?: string,
      beds?: number,
      property_type?: string) {

      update(s => ({ ...s, loading: true, error: null }));

      try {
        // Fetch both Guesty and Doorloop data in parallel
        const [guestyData, doorloopData] = await Promise.all([
          // Fetch Guesty data
          (async () => {
            const url = new URL(`${PUBLIC_API_URL}/api/reservations`);

            // Add filters to URL
            if (property_type) url.searchParams.set('property_type', property_type);
            if (beds) url.searchParams.set('number_of_beds', beds.toString());
            if (date_start) url.searchParams.set('date_start', date_start);
            if (date_end) url.searchParams.set('date_end', date_end);

            // Handle property names - always send as array
            if (building_names && building_names.length > 0) {
              building_names.forEach(name => {
                url.searchParams.append('building_names', name);
              });
            }
            if (unit_names) {
              const nameArray = Array.isArray(unit_names) ? unit_names : [unit_names];
              nameArray.forEach(name => {
                url.searchParams.append('property_full_names', name);
              });
            }

            const res = await fetchFn(url.toString());
            if (!res.ok) throw new Error(res.statusText);
            return await res.json();
          })(),
          // Fetch Doorloop data
          (async () => {
            const url = new URL(`${PUBLIC_API_URL}/api/doorloop/properties`);
            const res = await fetchFn(url.toString());
            if (!res.ok) throw new Error(res.statusText);
            
            const data: DoorloopResponse = await res.json();
            console.log(data)
            return data;
          })()
        ]);

        // Group Guesty reservations by property name
        const groupedData: Record<string, ListingData[]> = {};

        // Process Guesty data
        guestyData.forEach((reservation: ListingData) => {
          const propertyName = reservation.property_full_name || "Unknown";
          if (!groupedData[propertyName]) {
            groupedData[propertyName] = [];
          }
          groupedData[propertyName].push({
            ...reservation,
            source: 'guesty'
          });
        });

        // Process Doorloop data
        if (doorloopData && doorloopData.data) {
          doorloopData.data.forEach((property: DoorloopProperty) => {
            const propertyName = property.name;
            if (!groupedData[propertyName]) {
              groupedData[propertyName] = [];
            }
            // Add Doorloop property data in the same format as Guesty data
            groupedData[propertyName].push({
              id: parseInt(property.id),
              guesty_created_at: new Date(property.createdAt),
              total_paid: 0, // Doorloop doesn't provide this directly
              property_full_name: propertyName,
              source: 'doorloop'
            });
          });
        }

        // Update store
        update(s => ({
          ...s,
          listingData: groupedData,
          loading: false,
          error: null,
        }));

        return groupedData;

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        update(s => ({ ...s, loading: false, error: errorMessage }));
        throw err;
      }
    },

    /** Once‐only fetch of all property names */
    async loadListingNames(fetchFn: typeof fetch) {
      if (loadedNames) return;
      update(state => ({ ...state, loading: true, error: null }));
      try {
        // Fetch both Guesty and Doorloop property names in parallel
        const [guestyNames, doorloopNames] = await Promise.all([
          // Fetch Guesty names
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/reservations/names`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            return await res.json();
          })(),
          // Fetch Doorloop names
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/doorloop/properties`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            const data: DoorloopResponse = await res.json();
            return {
              property_names: data.data.map(p => p.name),
              building_names: data.data.map(p => p.name)
            };
          })()
        ]);

        // Combine the property names from both sources
        const combinedNames = {
          property_names: [...new Set([...guestyNames.property_names, ...doorloopNames.property_names])],
          building_names: [...new Set([...guestyNames.building_names, ...doorloopNames.building_names])]
        };

        update(state => ({
          ...state,
          listingNames: combinedNames,
          loading: false,
          error: null,
        }));

        loadedNames = true;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching names';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
        }));
      }
    },

    /** Once‐only fetch of all listings from both Guesty and Doorloop */
    async loadListings(fetchFn: typeof fetch) {

      if (loadedListings) return;
      update(state => ({ ...state, loading: true, error: null }));
      try {
        // Fetch Guesty listings, Doorloop properties, and Doorloop units in parallel
        const [guestyListings, doorloopResponse, doorloopUnitsResponse] = await Promise.all([
          // Fetch Guesty listings
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/properties/listings`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            return await res.json();
          })(),
          // Fetch Doorloop properties
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/doorloop/properties`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            return await res.json();
          })(),
          // Fetch Doorloop units
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/doorloop/units`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            return await res.json();
          })()
        ]);

        // Process Guesty listings - ensure pictures field is present and properly typed
        const processedGuestyListings: Listing[] = guestyListings.map((listing: any) => {
          const normalizedPropertyType = normalizePropertyType(listing.property_type);
          const normalizedRoomType = normalizePropertyType(listing.room_type);
          
          return {
            _id: listing.id,
            id: listing.id,
            title: listing.title || listing.nickname || 'Untitled Property',
            description: listing.description_summary || '',
            address: {
              formattedAddress: listing.address_full || `${listing.address_city || ''}, ${listing.address_state || ''}`.trim(),
              location: {
                lat: parseFloat(listing.address_latitude) || 0,
                lng: parseFloat(listing.address_longitude) || 0
              }
            },
            pictures: listing.pictures || [], // Pictures are already processed by backend
            amenities: listing.amenities || [],
            type: normalizedPropertyType || normalizedRoomType || 'Unknown',
            source: 'guesty' as const,
            active: listing.active === true || listing.active === 'true',
            base_price: listing.base_price,
            currency: listing.currency,
            accommodates: listing.accommodates,
            bedrooms: listing.bedrooms,
            property_type: normalizedPropertyType,
            nickname: listing.nickname,
            address_full: listing.address_full,
            address_building_name: listing.address_building_name,
            address_city: listing.address_city,
            address_state: listing.address_state,
            address_neighborhood: listing.address_neighborhood,
            room_type: normalizedRoomType,
            description_summary: listing.description_summary,
            security_deposit_fee: listing.security_deposit_fee,
            extra_person_fee: listing.extra_person_fee,
            guests_included: listing.guests_included,
            weekly_price_factor: listing.weekly_price_factor,
            monthly_price_factor: listing.monthly_price_factor,
            minimum_age: listing.minimum_age,
            min_nights: listing.min_nights,
            max_nights: listing.max_nights,
            area_square_feet: listing.area_square_feet,
            bathrooms: listing.bathrooms,
            thumbnail_url: listing.thumbnail_url,
            cleaning_status: listing.cleaning_status,
            tags: listing.tags || []
          };
        });

        // Group units by property ID
        const unitsByProperty: Record<string, DoorloopUnit[]> = {};
        if (doorloopUnitsResponse.success && doorloopUnitsResponse.data) {
          doorloopUnitsResponse.data.forEach((unit: DoorloopUnit) => {
            if (!unitsByProperty[unit.property]) {
              unitsByProperty[unit.property] = [];
            }
            unitsByProperty[unit.property].push(unit);
          });
        }

        // Convert Doorloop properties to Listing format and include units
        const doorloopListings: Listing[] = [];
        
        doorloopResponse.data.forEach((property: DoorloopProperty) => {
          const propertyUnits = unitsByProperty[property.id] || [];
          
          if (propertyUnits.length > 0) {
            // If property has units, create a listing for each unit
            propertyUnits.forEach((unit: DoorloopUnit) => {
              const normalizedPropertyType = normalizePropertyType(property.type);
              
              doorloopListings.push({
                _id: unit.id,
                id: unit.id,
                title: `${property.name} - ${unit.name}`,
                description: unit.description || property.description || '',
                address: {
                  formattedAddress: unit.addressSameAsProperty 
                    ? `${property.address.street1}, ${property.address.city}, ${property.address.state} ${property.address.zip}`
                    : `${unit.address.street1}, ${unit.address.city}, ${unit.address.state} ${unit.address.zip}`,
                  location: {
                    lat: unit.addressSameAsProperty ? (property.address.lat || 0) : (unit.address.lat || 0),
                    lng: unit.addressSameAsProperty ? (property.address.lng || 0) : (unit.address.lng || 0)
                  }
                },
                pictures: unit.pictures?.map(pic => pic.url) || property.pictures?.map(pic => pic.url) || [],
                amenities: unit.amenities || property.amenities || [],
                type: normalizedPropertyType,
                source: 'doorloop' as const,
                active: unit.active,
                address_building_name: property.name,
                address_city: unit.addressSameAsProperty ? property.address.city : unit.address.city,
                address_state: unit.addressSameAsProperty ? property.address.state : unit.address.state,
                address_zip: unit.addressSameAsProperty ? property.address.zip : unit.address.zip,
                address_street1: unit.addressSameAsProperty ? property.address.street1 : unit.address.street1,
                address_street2: unit.addressSameAsProperty ? property.address.street2 : unit.address.street2,
                property_type: normalizedPropertyType,
                room_type: normalizedPropertyType,
                name: property.name,
                unit_name: unit.name,
                bedrooms: unit.beds,
                bathrooms: unit.baths,
                unit_size: unit.size,
                base_price: unit.marketRent,
                numActiveUnits: property.numActiveUnits,
                class: property.class,
                settings: property.settings,
                property_id: property.id,
                unit_id: unit.id
              });
            });
          } else {
            // If property has no units, create a listing for the property itself
            const normalizedPropertyType = normalizePropertyType(property.type);
            
            doorloopListings.push({
              _id: property.id,
              id: property.id,
              title: property.name,
              description: property.description || '',
              address: {
                formattedAddress: `${property.address.street1}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
                location: {
                  lat: property.address.lat || 0,
                  lng: property.address.lng || 0
                }
              },
              pictures: property.pictures?.map(pic => pic.url) || [],
              amenities: property.amenities || [],
              type: normalizedPropertyType,
              source: 'doorloop' as const,
              active: property.active,
              address_building_name: property.name,
              address_city: property.address.city,
              address_state: property.address.state,
              address_zip: property.address.zip,
              address_street1: property.address.street1,
              address_street2: property.address.street2,
              property_type: normalizedPropertyType,
              room_type: normalizedPropertyType,
              name: property.name,
              numActiveUnits: property.numActiveUnits,
              class: property.class,
              settings: property.settings,
              property_id: property.id
            });
          }
        });

        // Combine listings from both sources
        const allListings = [...processedGuestyListings, ...doorloopListings];
        console.log('All listings with pictures:', allListings);
        
        update(state => ({
          ...state,
          listings: allListings,
          loading: false,
          error: null,
        }));
        loadedListings = true;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching listings';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
        }));
      }
    },

    // Clear data for specific properties
    clearProperties(propertyNames: string[]) {
      update(s => {
        const newListingData = { ...s.listingData };

        for (const name of propertyNames) {
          delete newListingData[name];
        }

        return {
          ...s,
          listingData: newListingData
        };
      });
    },

    /** Create property mappings between Doorloop and Guesty IDs */
    createPropertyMappings(): PropertyMapping[] {
      const mappings: PropertyMapping[] = [];
      
      // Get current listings
      let currentListings: Listing[] = [];
      const unsubscribe = this.subscribe(state => {
        currentListings = state.listings;
      });
      unsubscribe();

      console.log('Creating property mappings from listings:', currentListings);

      // Function to normalize building names (same as properties tab)
      function normalizeBuildingName(name: string): string {
        return name
          .toLowerCase()
          .replace(/\s+(apartments?|complex|building|tower|plaza|court|place)s?$/i, '')
          .trim();
      }

      // Group listings by normalized building name
      const listingsByNormalizedName: Record<string, { doorloop?: Listing; guesty?: Listing }> = {};
      
      currentListings.forEach(listing => {
        const name = listing.title || listing.name || '';
        const normalizedName = normalizeBuildingName(name);
        
        if (!listingsByNormalizedName[normalizedName]) {
          listingsByNormalizedName[normalizedName] = {};
        }
        
        if (listing.source === 'doorloop') {
          listingsByNormalizedName[normalizedName].doorloop = listing;
        } else if (listing.source === 'guesty') {
          listingsByNormalizedName[normalizedName].guesty = listing;
        }
      });

      console.log('Listings grouped by normalized name:', listingsByNormalizedName);
      
      // Debug: Show all Guesty property names
      const guestyPropertyNames = currentListings
        .filter(listing => listing.source === 'guesty')
        .map(listing => listing.title || listing.name)
        .sort();
      console.log('All Guesty property names:', guestyPropertyNames);
      
      // Debug: Show all Doorloop property names
      const doorloopPropertyNames = currentListings
        .filter(listing => listing.source === 'doorloop')
        .map(listing => listing.title || listing.name)
        .sort();
      console.log('All Doorloop property names:', doorloopPropertyNames);

      // Create mappings for properties that exist in both systems
      Object.entries(listingsByNormalizedName).forEach(([normalizedName, listings]) => {
        if (listings.doorloop && listings.guesty) {
          mappings.push({
            doorloopId: listings.doorloop.id,
            guestyId: listings.guesty.id,
            propertyName: listings.doorloop.title || listings.doorloop.name || ''
          });
        }
      });

      console.log('Created property mappings:', mappings);
      return mappings;
    },

    /** Get Guesty ID for a Doorloop property ID */
    getGuestyIdForDoorloopId(doorloopId: string): string | null {
      const mappings = this.createPropertyMappings();
      console.log('Looking up Guesty ID for Doorloop ID:', doorloopId);
      console.log('Available mappings:', mappings);
      
      // First try exact match
      let mapping = mappings.find(m => m.doorloopId === doorloopId);
      
      // If no exact match, try to find by property name
      if (!mapping) {
        // Get the Doorloop property name
        let currentListings: Listing[] = [];
        const unsubscribe = this.subscribe(state => {
          currentListings = state.listings;
        });
        unsubscribe();
        
        const doorloopProperty = currentListings.find(l => l.id === doorloopId && l.source === 'doorloop');
        if (doorloopProperty) {
          const propertyName = doorloopProperty.title || doorloopProperty.name || '';
          console.log('Doorloop property name:', propertyName);
          
          // Normalize the name and find matching Guesty property
          const normalizedName = propertyName
            .toLowerCase()
            .replace(/\s+(apartments?|complex|building|tower|plaza|court|place)s?$/i, '')
            .trim();
          
          console.log('Normalized property name:', normalizedName);
          
          const guestyProperty = currentListings.find(l => 
            l.source === 'guesty' && 
            (l.title || l.name || '').toLowerCase().replace(/\s+(apartments?|complex|building|tower|plaza|court|place)s?$/i, '').trim() === normalizedName
          );
          
          if (guestyProperty) {
            console.log('Found matching Guesty property:', guestyProperty.title || guestyProperty.name);
            return guestyProperty.id;
          }
        }
      }
      
      console.log('Found mapping:', mapping);
      return mapping?.guestyId || null;
    },

    /** Get Doorloop ID for a Guesty property ID */
    getDoorloopIdForGuestyId(guestyId: string): string | null {
      const mappings = this.createPropertyMappings();
      const mapping = mappings.find(m => m.guestyId === guestyId);
      return mapping?.doorloopId || null;
    },

    /** Reset everything back to initial empty state */
    reset() {
      loadedListings = false;
      loadedNames = false;
      set(initialState);
    }
  };
}

export const propertyStore = createPropertyStore();