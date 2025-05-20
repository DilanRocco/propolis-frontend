<script lang="ts">
	import ProtectedRoute from '$lib/protectedRoute.svelte';
	import PropertyList from '$lib/components/properties/PropertyList.svelte';
	import PropertyDetail from '$lib/components/properties/PropertyDetail.svelte';
	import { onMount } from 'svelte';
	import { propertyStore } from '$lib/stores/propertyStore';
	import type { Listing } from '$lib/types/properties';

	let store = $propertyStore;
	let selectedProperty: Listing | undefined = undefined;

	onMount(() => {
		// Initialize the store if needed
	});

	function selectProperty(property: Listing) {
		selectedProperty = property;
	}

	function goBack() {
		selectedProperty = undefined;
	}
</script>

<ProtectedRoute>
	<div class="min-h-screen bg-gray-50 p-6">
		{#if selectedProperty}
			<PropertyDetail 
				property={selectedProperty} 
				{goBack} 
			/>
		{:else}
			<PropertyList 
				properties={store.listings} 
				{selectProperty} 
			/>
		{/if}
	</div>
</ProtectedRoute>