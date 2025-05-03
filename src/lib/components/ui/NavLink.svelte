<script lang="ts">
  import { goto } from '$app/navigation';
  
  // Props with proper TypeScript types
  export let to: string = "";
  export let icon: any = null; // Using any for icon type to avoid TypeScript errors
  export let active: boolean = false;
  export let text: string = "";
  export let badge: string | number | null = null;
  export let external: boolean = false;
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{
    click: void;
  }>();
  
  // Fixed event handler with proper TypeScript typing
  function handleClick(event: MouseEvent) {
    if (!external) {
      event.preventDefault();
      goto(to);
    }
    dispatch('click');
  }
</script>

{#if external}
  <a 
    href={to}
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          {active 
            ? 'bg-coral-50 text-coral-500' 
            : 'text-gray-700 hover:bg-gray-100'}"
    on:click={() => dispatch('click')}
  >
    {#if icon}
      <svelte:component 
        this={icon} 
        class="w-5 h-5 {active ? 'text-coral-500' : 'text-gray-500'}" 
      />
    {/if}
    
    <span>{text}</span>
    
    {#if badge !== null}
      <div class="ml-auto bg-coral-100 text-coral-500 text-xs font-medium px-2 py-0.5 rounded">
        {badge}
      </div>
    {/if}
  </a>
{:else}
  <a 
    href={to} 
    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          {active 
            ? 'bg-coral-50 text-coral-500' 
            : 'text-gray-700 hover:bg-gray-100'}"
    on:click|preventDefault={handleClick}
  >
    {#if icon}
      <svelte:component 
        this={icon} 
        class="w-5 h-5 {active ? 'text-coral-500' : 'text-gray-500'}" 
      />
    {/if}
    
    <span>{text}</span>
    
    {#if badge !== null}
      <div class="ml-auto bg-coral-100 text-coral-500 text-xs font-medium px-2 py-0.5 rounded">
        {badge}
      </div>
    {/if}
  </a>
{/if}