// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import { PUBLIC_API_URL } from '$env/static/public';
import { list } from 'postcss';

export interface ListingData {
  guesty_created_at: Date;
  total_paid: number;
}

export interface PropertyState {
  listings: Listing[];
  listingNames: string[];
  listingData: Record<string, ListingData[]>;
  loading: boolean;
  error: string | null;
}

function createPropertyStore() {
  const initialState: PropertyState = {
    listings: [],
    listingNames: [],
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
    async getDataFor(fetchFn: typeof fetch, property_name: string, date_start?: string, date_end?: string, beds?: number, property_type?: string) {
      update(s => ({ ...s, loading: true, error: null }));
      try {
        const url = new URL(`${PUBLIC_API_URL}/api/reservations`); 
        url.searchParams.set('building_name', property_name);
        if (property_type) url.searchParams.set('property_type', property_type);
        if (beds) url.searchParams.set('number_of_beds', beds.toString());
        if (date_start) url.searchParams.set('date_start', date_start);
        if (date_end) url.searchParams.set('date_end', date_end);

        const res = await fetchFn(url.toString());
        if (!res.ok) throw new Error(res.statusText);

        const reservations: ListingData[] = await res.json();
        console.log(reservations)
        update(s => ({
          ...s,
          listingData: { ...s.listingData, [property_name]: reservations },
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

        const names: string[] = await res.json();
        update(state => ({
          ...state,
          listingNames: names,
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
        console.log(listings[0])
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


