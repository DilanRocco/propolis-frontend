<script lang="ts">
	import type { ReservationManager } from '../../types/dashboard';
	import { Search, Filter, MoreVertical, ArrowRight } from 'lucide-svelte';
	import CardWidget from './CardWidget.svelte';
	
	// Props
	export let reservations: ReservationManager;
	
	// State
	let searchQuery = '';
	let selectedTags = ['Team', 'Insights', 'Today'];
	
	function removeTag(tag: string) {
	  selectedTags = selectedTags.filter((t) => t !== tag);
	}
	
	// Format date for display
	function formatDate(dateString: string): string {
	  const date = new Date(dateString);
	  return date.toLocaleDateString('en-US', { 
		month: 'short', 
		day: 'numeric' 
	  });
	}
  </script>
  
  <CardWidget marginBottom={false}>
	<div class="p-1">
	  <!-- Header with title and actions -->
	  <div class="mb-5 flex items-center justify-between">
		<h3 class="font-medium">Activity manager</h3>
		<div class="flex items-center gap-3">
		  <button>
			<Filter class="h-5 w-5 text-gray-400" />
		  </button>
		  <button>
			<MoreVertical class="h-5 w-5 text-gray-400" />
		  </button>
		</div>
	  </div>
	  
	  <!-- Search field -->
	  <div class="relative mb-5">
		<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
		<input
		  type="text"
		  bind:value={searchQuery}
		  placeholder="Search in activities..."
		  class="w-full rounded-lg border border-gray-100 bg-white py-2 pl-10 pr-3 text-sm"
		/>
	  </div>
	  
	  <!-- Tags -->
	  <div class="mb-5 flex flex-wrap items-center gap-2">
		{#each selectedTags as tag}
		  <div
			class="{tag === 'Team' ? 'bg-coral-100 text-coral-500' : 'bg-gray-100 text-gray-700'} 
				  flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
		  >
			{tag}
			{#if tag !== 'Team'}
			  <button 
				on:click={() => removeTag(tag)} 
				class="ml-1 text-xs"
			  >
				×
			  </button>
			{/if}
		  </div>
		{/each}
	  </div>
	  
	  <!-- Activity Items -->
	  <div class="space-y-3">
		{#each reservations.reservations.slice(0, 4) as reservation, i}
		  <div class="flex items-center justify-between py-3 border-b border-gray-100">
			<!-- Guest info -->
			<div class="flex items-center">
			  <div class="mr-3">
				<div class="text-sm font-medium">{reservation.guestName}</div>
				<div class="text-xs text-gray-500">{formatDate(reservation.checkIn)}</div>
			  </div>
			</div>
			
			<!-- Status and action -->
			<div class="flex items-center gap-3">
			  <div class="text-sm font-medium {reservation.paid ? 'text-emerald-500' : 'text-coral-500'}">
				{reservation.paid ? 'Paid' : 'Pending'}
			  </div>
			  <button>
				<ArrowRight class="h-4 w-4 text-gray-400" />
			  </button>
			</div>
		  </div>
		{:else}
		  <div class="flex h-32 items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50">
			<p class="text-center text-sm text-gray-500">No activities found</p>
		  </div>
		{/each}
	  </div>
	  
	  <!-- Simple chart indicator -->
	  {#if reservations.reservations.length > 0}
		<div class="mt-5 pt-4">
		  <div class="flex items-center justify-between mb-3">
			<div class="text-sm text-gray-500">Today</div>
			<div class="text-sm font-medium">$ 43.20 <span class="text-gray-400 text-xs">USD</span></div>
		  </div>
		  
		  <!-- Simplified chart -->
		  <div class="h-10 flex items-end gap-0.5">
			{#each Array(12) as _, i}
			  {@const height = Math.random() * 100}
			  {@const isActive = i === 6}
			  <div 
				class="flex-1 rounded-sm {isActive ? 'bg-coral-500' : 'bg-gray-200'}" 
				style="height: {(height > 90 ? 90 : (height < 10 ? 10 : height))}%;"
			  ></div>
			{/each}
		  </div>
		  
		  <!-- Simplified indicators -->
		  <div class="mt-3 flex justify-center gap-1">
			{#each Array(5) as _, i}
			  <div class="h-1.5 w-1.5 rounded-full {i === 2 ? 'bg-coral-500' : 'bg-gray-200'}"></div>
			{/each}
		  </div>
		</div>
	  {/if}
	</div>
  </CardWidget>