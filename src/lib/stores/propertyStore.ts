// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import { PUBLIC_API_URL } from '$env/static/public';

export interface ListingData {
  id: number;
  guesty_created_at: Date;
  total_paid: number;
  property_full_name?: string; // Add this to help with grouping
}

export interface ListingNames {
  property_names: string[];
  building_names: string[];
}

export interface PropertyState {
  listings: Listing[];
  listingNames: ListingNames;
  // A dictionary with property name as key and array of ListingData as value
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
    listingData: {},  // Object/dictionary
    loading: false,
    error: null,
  };

  const { subscribe, update, set } = writable<PropertyState>(initialState);
  let loadedListings = false;
  let loadedNames = false;

  // Helper function to fetch data for a single property - defined OUTSIDE the getDataFor method
 

  return {
    subscribe,

    /** 
     * Fetch reservations for one or multiple properties and store under listingData
     * If name is undefined, it will fetch data for all properties based on other filters
     */
    /**
 * Fetch reservations for properties and store under listingData
 */
    async getDataFor(fetchFn: typeof fetch,
      names?: string | string[],
      date_start?: string,
      date_end?: string,
      beds?: number,
      property_type?: string) {

      update(s => ({ ...s, loading: true, error: null }));

      try {
        const url = new URL(`${PUBLIC_API_URL}/api/reservations`);

        // Add filters to URL
        if (property_type) url.searchParams.set('property_type', property_type);
        if (beds) url.searchParams.set('number_of_beds', beds.toString());
        if (date_start) url.searchParams.set('date_start', date_start);
        if (date_end) url.searchParams.set('date_end', date_end);

        // Handle property names - always send as array
        if (names) {
          const nameArray = Array.isArray(names) ? names : [names];
          nameArray.forEach(name => {
            url.searchParams.append('property_full_names', name);
          });
        }

        const res = await fetchFn(url.toString());
        if (!res.ok) throw new Error(res.statusText);

        const reservations: ListingData[] = await res.json();

        // Group reservations by property name
        const groupedData: Record<string, ListingData[]> = {};

        reservations.forEach(reservation => {
          const propertyName = reservation.property_full_name || "Unknown";
          if (!groupedData[propertyName]) {
            groupedData[propertyName] = [];
          }
          groupedData[propertyName].push(reservation);
        });

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
        const res = await fetchFn(`${PUBLIC_API_URL}/api/reservations/names`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const data: { property_names: string[]; building_names: string[] } = await res.json();

        update(state => ({
          ...state,
          listingNames: {
            property_names: data.property_names,
            building_names: data.building_names,
          },
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

    /** Once‐only fetch of all Guesty listings */
    async loadListings(fetchFn: typeof fetch) {
      if (loadedListings) return;
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const res = await fetchFn(`${PUBLIC_API_URL}/api/properties/listings`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const listings: Listing[] = await res.json();
        update(state => ({
          ...state,
          listings,
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