// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import { PUBLIC_API_URL } from '$env/static/public';

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
    async getDataFor(name: string, fetchFn: typeof fetch) {
      update(s => ({ ...s, loading: true, error: null }));
      try {
        const url = new URL(`${PUBLIC_API_URL}/api/reservations`);
        url.searchParams.set('property_full_name', name);

        const res = await fetchFn(url.toString());
        if (!res.ok) throw new Error(res.statusText);

        const reservations: ListingData[] = await res.json();
        console.log(reservations)
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


