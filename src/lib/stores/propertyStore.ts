import { writable } from 'svelte/store';
import type { Property } from '$lib/types/property';
import { getGuestyListings } from '$lib/api/properties';

export const propertiesStore = (() => {
  const { subscribe, set } = writable<Property[]>([]);
  let loaded = false;

  return {
    subscribe,
    load: async (fetchFn: typeof fetch) => {
      if (!loaded) {
        const data = await getGuestyListings(fetchFn);
        set(data);
        loaded = true;
      }
    }
  };
})();