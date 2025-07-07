import { writable } from 'svelte/store';
import type { DoorloopProperty } from '../types/doorloop';
import { PUBLIC_API_URL } from '$env/static/public';

export interface PropertyOption {
  id: string;
  name: string;
}

export interface GlobalPropertyFilterState {
  selectedProperty: PropertyOption | null;
  availableProperties: PropertyOption[];
  loading: boolean;
  error: string | null;
}

function createGlobalPropertyFilter() {
  const initialState: GlobalPropertyFilterState = {
    selectedProperty: null,
    availableProperties: [],
    loading: false,
    error: null
  };

  const { subscribe, update, set } = writable<GlobalPropertyFilterState>(initialState);

  return {
    subscribe,
    
    // Load Doorloop properties only
    async loadProperties(fetchFn: typeof fetch) {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetchFn(`${PUBLIC_API_URL}/api/doorloop/properties`);

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Convert to PropertyOption format
        const properties: PropertyOption[] = data.data.map((property: DoorloopProperty) => ({
          id: property.id,
          name: property.name
        }));

        // Sort properties alphabetically
        properties.sort((a, b) => a.name.localeCompare(b.name));

        update(state => ({
          ...state,
          availableProperties: properties,
          loading: false,
          error: null
        }));

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
        update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
          availableProperties: []
        }));
      }
    },

    // Set the selected property
    setSelectedProperty(property: PropertyOption | null) {
      update(state => ({
        ...state,
        selectedProperty: property
      }));
    },

    // Clear the selected property
    clearSelectedProperty() {
      update(state => ({
        ...state,
        selectedProperty: null
      }));
    },

    // Reset the entire store
    reset() {
      set(initialState);
    }
  };
}

export const globalPropertyFilter = createGlobalPropertyFilter(); 