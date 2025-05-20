// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import { PUBLIC_API_URL } from '$env/static/public';

export interface ListingData {
  guesty_created_at: Date;
  total_paid: number;
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
    listingData: {},      // ← our dictionary
    loading: false,
    error: null,
  };

  const { subscribe, update, set } = writable<PropertyState>(initialState);
  let loadedListings = false;
  let loadedNames = false;

  return {
    subscribe,

    /** Fetch reservations for a single property and stash under `listingData[name]` */
    async getDataFor(fetchFn: typeof fetch, name: string, date_start?: string, date_end?: string, beds?: number, property_type?: string) {
      // Create a variable to store the current state
      let currentState: PropertyState | undefined;
      
      // Get the current state first to safely access the listing names
      const unsubscribe = subscribe(state => {
        currentState = state;
      });
      
      // Unsubscribe immediately after getting the current state
      unsubscribe();
      
      // Now update to set loading state
      update(s => ({ ...s, loading: true, error: null }));
      
      try {
        const url = new URL(`${PUBLIC_API_URL}/api/reservations`); 
        
        // Safely check if the name exists in buildings or properties
        const isBuilding = currentState?.listingNames.building_names.includes(name) || false;
        const isProperty = currentState?.listingNames.property_names.includes(name) || false;
        
        if (isBuilding) {
          url.searchParams.set('building_name', name);
        } else if (isProperty) {
          url.searchParams.set('property_name', name);
        } else {
          // If it's neither (shouldn't happen), default to building name
          url.searchParams.set('building_name', name);
        }
        
        if (property_type) url.searchParams.set('property_type', property_type);
        if (beds) url.searchParams.set('number_of_beds', beds.toString());
        if (date_start) url.searchParams.set('date_start', date_start);
        if (date_end) url.searchParams.set('date_end', date_end);
        
        const res = await fetchFn(url.toString());
        if (!res.ok) throw new Error(res.statusText);
        
        const reservations: ListingData[] = await res.json();

       
        
        update(s => ({
          ...s,
          listingData: { ...s.listingData, [name]: reservations },
          loading: false,
          error: null,
        }));

        return reservations;               
      } catch (err: any) {
        update(s => ({ ...s, loading: false, error: err.message }));
        console.error(err);
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
      } catch (err: any) {
        update(state => ({
          ...state,
          loading: false,
          error: err.message || 'Error fetching names',
        }));
        console.error('loadListingNames failed:', err);
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
      } catch (err: any) {
        update(state => ({
          ...state,
          loading: false,
          error: err.message || 'Error fetching listings',
        }));
        console.error('loadListings failed:', err);
      }
    },

    /** Reset everything back to initial empty state */
    reset() {
      loadedListings = false;
      loadedNames = false;
      set(initialState);
    }
  };
}

export const propertyStore = createPropertyStore()