// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import type { DoorloopProperty, DoorloopResponse } from '../types/doorloop';
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
        // Fetch both Guesty and Doorloop listings in parallel
        const [guestyListings, doorloopResponse] = await Promise.all([
          // Fetch Guesty listings
         
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/properties/listings`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
           
            return await res.json();
          })(),
          // Fetch Doorloop listings
          (async () => {
            const res = await fetchFn(`${PUBLIC_API_URL}/api/doorloop/properties`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
          
            return await res.json();
          })()
        ]);

        // Convert Doorloop properties to Listing format
        const doorloopListings: Listing[] = doorloopResponse.data.map((property: DoorloopProperty) => ({
          _id: property.id,
          adddress_building_name: property.name,
          description_summary: property.description || '',
          address: {
            formattedAddress: `${property.address.street1}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
            location: {
              lat: property.address.lat,
              lng: property.address.lng
            }
          },
          address_building_name: property.name,
          address_city: property.address.city,
          address_state: property.address.state,
          address_zip: property.address.zip,
          address_street1: property.address.street1,
          address_street2: property.address.street2,
          pictures: property.pictures?.map(pic => pic.url) || [],
          amenities: property.amenities || [],
          type: property.type,
          source: 'doorloop',
          room_type: property.type,
          active: property.active,
        }));

        // Combine listings from both sources
        const allListings = [...guestyListings, ...doorloopListings];
        console.log(allListings)
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

    /** Reset everything back to initial empty state */
    reset() {
      loadedListings = false;
      loadedNames = false;
      set(initialState);
    }
  };
}

export const propertyStore = createPropertyStore();