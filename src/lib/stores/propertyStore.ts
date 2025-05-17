// src/lib/stores/propertyStore.ts
import { writable } from 'svelte/store';
import type { Listing } from '../types/properties';
import { PUBLIC_API_URL } from '$env/static/public';

interface PropertyState {
  listings: Listing[];
  loading: boolean;
  error: string | null;
}

function createPropertyStore() {
  const { subscribe, update, set } = writable<PropertyState>({
    listings: [],
    loading: false,
    error: null,
  });
  let loaded = false;

  return {
    subscribe,

    async load(fetchFn: typeof fetch) {
      // if we already succeeded once, bail
      if (loaded) return;

      // kick off loading
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const res = await fetchFn(`${PUBLIC_API_URL}/api/guesty/listings`);
        if (!res.ok) {
          // non-200, e.g. 502
          throw new Error(`Server returned ${res.status} ${res.statusText}`);
        }
        const listings: Listing[] = await res.json();
        set({ listings, loading: false, error: null });
        loaded = true;
      } catch (err: any) {
        // record the error but leave loaded = false so user can retry
        set({
          listings:   [],                // or keep previous if you prefer
          loading:    false,
          error:      err.message || "Unknown error",
        });
        console.error("fetchProperties failed:", err);
      }
    },

    // if you ever want to force a reload:
    reset() {
      loaded = false;
      set({ listings: [], loading: false, error: null });
    }
  };
}

export const propertyStore = createPropertyStore();
