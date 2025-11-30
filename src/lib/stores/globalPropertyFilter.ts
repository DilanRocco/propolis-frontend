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
          // Log error but don't throw - allow app to continue
          console.error(`Failed to fetch Doorloop properties: ${response.status} ${response.statusText}`);
          update(state => ({
            ...state,
            loading: false,
            error: `Failed to load properties: ${response.status} ${response.statusText}`,
            availableProperties: []
          }));
          return;
        }

        const data = await response.json();

        // Convert to PropertyOption format
        const properties: PropertyOption[] = data.data.map((property: DoorloopProperty) => ({
          id: property.id,
          name: property.name
        }));

        // Filter out excluded properties
        const excludedPropertyNames = ['3320 NW 5th Ave', '3320 nw 5th ave', '3320 NW 5th Avenue'];
        const filteredProperties = properties.filter(
          property => !excludedPropertyNames.some(excluded => 
            property.name.toLowerCase().trim() === excluded.toLowerCase().trim()
          )
        );

        // Add Jurny-only properties (short-term properties not in Doorloop)
        const jurnyOnlyProperties: PropertyOption[] = [
          { id: 'jurny-olive-apartments', name: 'Olive Apartments' }
        ];

        // Combine Doorloop and Jurny properties
        const allProperties = [...filteredProperties, ...jurnyOnlyProperties];

        // Debug: Log all property names
        console.log('🔍 All Doorloop property names:', properties.map(p => p.name));
        console.log('🔍 Jurny-only properties:', jurnyOnlyProperties.map(p => p.name));
        console.log('🔍 All available properties:', allProperties.map(p => p.name));

        // Sort properties alphabetically
        allProperties.sort((a, b) => a.name.localeCompare(b.name));

        update(state => ({
          ...state,
          availableProperties: allProperties,
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