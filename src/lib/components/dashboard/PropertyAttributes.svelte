<script lang="ts">
    import { Plus, X } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    import { propertyAttributesStore, propertyAttributesActions, type PropertyAttribute } from '../../stores/propertyAttributesStore';

    // Props
    export let isEditable: boolean = true;
    export let propertyId: string;
    export let isBuilding: boolean = false;

    // Get store value
    $: attributes = isBuilding 
        ? $propertyAttributesStore.buildingAttributes[propertyId] || []
        : $propertyAttributesStore.propertyAttributes[propertyId] || [];

    // Create event dispatcher for changes
    const dispatch = createEventDispatcher<{
        change: { attributes: PropertyAttribute[] };
    }>();

    // Add new attribute
    function addAttribute() {
        if (isBuilding) {
            propertyAttributesActions.addBuildingAttribute(propertyId, {
                key: '',
                value: ''
            });
        } else {
            propertyAttributesActions.addPropertyAttribute(propertyId, {
                key: '',
                value: ''
            });
        }
        dispatch('change', { attributes });
    }

    // Remove attribute
    function removeAttribute(id: string) {
        if (isBuilding) {
            propertyAttributesActions.removeBuildingAttribute(propertyId, id);
        } else {
            propertyAttributesActions.removePropertyAttribute(propertyId, id);
        }
        dispatch('change', { attributes });
    }

    // Update attribute
    function updateAttribute(id: string, field: 'key' | 'value', newValue: string) {
        if (isBuilding) {
            propertyAttributesActions.updateBuildingAttribute(propertyId, id, { [field]: newValue });
        } else {
            propertyAttributesActions.updatePropertyAttribute(propertyId, id, { [field]: newValue });
        }
        dispatch('change', { attributes });
    }
</script>

<div class="bg-white rounded-xl border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{isBuilding ? 'Building' : 'Property'} Attributes</h3>
        {#if isEditable}
            <button
                on:click={addAttribute}
                class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-coral-600 hover:text-coral-700 bg-coral-50 hover:bg-coral-100 rounded-lg transition-colors"
            >
                <Plus class="w-4 h-4" />
                Add Attribute
            </button>
        {/if}
    </div>

    <div class="space-y-3">
        {#each attributes as attribute (attribute.id)}
            <div class="flex items-center gap-3 group">
                <div class="flex-1">
                    <input
                        type="text"
                        bind:value={attribute.key}
                        on:input={(e) => updateAttribute(attribute.id, 'key', e.currentTarget.value)}
                        placeholder="Attribute name"
                        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                        disabled={!isEditable}
                    />
                </div>
                <div class="flex-1">
                    <input
                        type="text"
                        bind:value={attribute.value}
                        on:input={(e) => updateAttribute(attribute.id, 'value', e.currentTarget.value)}
                        placeholder="Value"
                        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                        disabled={!isEditable}
                    />
                </div>
                {#if isEditable}
                    <button
                        on:click={() => removeAttribute(attribute.id)}
                        class="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X class="w-4 h-4" />
                    </button>
                {/if}
            </div>
        {/each}
    </div>

    {#if attributes.length === 0}
        <div class="text-center py-8 text-gray-500">
            <p>No attributes added yet</p>
            {#if isEditable}
                <button
                    on:click={addAttribute}
                    class="mt-2 text-coral-600 hover:text-coral-700 font-medium"
                >
                    Add your first attribute
                </button>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* Add smooth transitions for the remove button */
    .group:hover button {
        opacity: 1;
    }
</style> 