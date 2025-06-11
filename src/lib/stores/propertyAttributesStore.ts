import { writable } from 'svelte/store';

// Define the type for our attributes
export interface PropertyAttribute {
    key: string;
    value: string;
    id: string;
}

// Define the store state interface
interface PropertyAttributesState {
    propertyAttributes: Record<string, PropertyAttribute[]>; // propertyId -> attributes
    buildingAttributes: Record<string, PropertyAttribute[]>; // buildingName -> attributes
    loading: boolean;
    error: string | null;
}

// Initialize the store with empty state
const initialState: PropertyAttributesState = {
    propertyAttributes: {},
    buildingAttributes: {},
    loading: false,
    error: null
};

// Create the store
const store = writable<PropertyAttributesState>(initialState);

// Create actions for the store
export const propertyAttributesActions = {
    // Property-level actions
    addPropertyAttribute: (propertyId: string, attribute: Omit<PropertyAttribute, 'id'>) => {
        store.update(state => {
            const newAttribute: PropertyAttribute = {
                ...attribute,
                id: crypto.randomUUID()
            };
            const currentAttributes = state.propertyAttributes[propertyId] || [];
            return {
                ...state,
                propertyAttributes: {
                    ...state.propertyAttributes,
                    [propertyId]: [...currentAttributes, newAttribute]
                }
            };
        });
    },

    removePropertyAttribute: (propertyId: string, attributeId: string) => {
        store.update(state => {
            const currentAttributes = state.propertyAttributes[propertyId] || [];
            return {
                ...state,
                propertyAttributes: {
                    ...state.propertyAttributes,
                    [propertyId]: currentAttributes.filter(attr => attr.id !== attributeId)
                }
            };
        });
    },

    updatePropertyAttribute: (propertyId: string, attributeId: string, updates: Partial<Omit<PropertyAttribute, 'id'>>) => {
        store.update(state => {
            const currentAttributes = state.propertyAttributes[propertyId] || [];
            return {
                ...state,
                propertyAttributes: {
                    ...state.propertyAttributes,
                    [propertyId]: currentAttributes.map(attr => 
                        attr.id === attributeId ? { ...attr, ...updates } : attr
                    )
                }
            };
        });
    },

    // Building-level actions
    addBuildingAttribute: (buildingName: string, attribute: Omit<PropertyAttribute, 'id'>) => {
        store.update(state => {
            const newAttribute: PropertyAttribute = {
                ...attribute,
                id: crypto.randomUUID()
            };
            const currentAttributes = state.buildingAttributes[buildingName] || [];
            return {
                ...state,
                buildingAttributes: {
                    ...state.buildingAttributes,
                    [buildingName]: [...currentAttributes, newAttribute]
                }
            };
        });
    },

    removeBuildingAttribute: (buildingName: string, attributeId: string) => {
        store.update(state => {
            const currentAttributes = state.buildingAttributes[buildingName] || [];
            return {
                ...state,
                buildingAttributes: {
                    ...state.buildingAttributes,
                    [buildingName]: currentAttributes.filter(attr => attr.id !== attributeId)
                }
            };
        });
    },

    updateBuildingAttribute: (buildingName: string, attributeId: string, updates: Partial<Omit<PropertyAttribute, 'id'>>) => {
        store.update(state => {
            const currentAttributes = state.buildingAttributes[buildingName] || [];
            return {
                ...state,
                buildingAttributes: {
                    ...state.buildingAttributes,
                    [buildingName]: currentAttributes.map(attr => 
                        attr.id === attributeId ? { ...attr, ...updates } : attr
                    )
                }
            };
        });
    },

    // Helper functions
    setPropertyAttributes: (propertyId: string, attributes: PropertyAttribute[]) => {
        store.update(state => ({
            ...state,
            propertyAttributes: {
                ...state.propertyAttributes,
                [propertyId]: attributes
            }
        }));
    },

    setBuildingAttributes: (buildingName: string, attributes: PropertyAttribute[]) => {
        store.update(state => ({
            ...state,
            buildingAttributes: {
                ...state.buildingAttributes,
                [buildingName]: attributes
            }
        }));
    },

    clearPropertyAttributes: (propertyId: string) => {
        store.update(state => {
            const { [propertyId]: _, ...rest } = state.propertyAttributes;
            return {
                ...state,
                propertyAttributes: rest
            };
        });
    },

    clearBuildingAttributes: (buildingName: string) => {
        store.update(state => {
            const { [buildingName]: _, ...rest } = state.buildingAttributes;
            return {
                ...state,
                buildingAttributes: rest
            };
        });
    },

    // Conversion helpers
    toMap: (attributes: PropertyAttribute[]) => {
        return attributes.reduce((map, attr) => {
            map[attr.key] = attr.value;
            return map;
        }, {} as Record<string, string>);
    },

    fromMap: (map: Record<string, string>) => {
        return Object.entries(map).map(([key, value]) => ({
            key,
            value,
            id: crypto.randomUUID()
        }));
    }
};

// Export the store
export const propertyAttributesStore = store; 