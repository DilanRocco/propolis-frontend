<script lang="ts">
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import type { ComponentType } from 'svelte';
  
  // Props with proper TypeScript types
  export let to: string = "";
  export let icon: ComponentType | null = null;
  export let active: boolean = false;
  export let text: string = "";
  export let badge: string | number | null = null;
  export let external: boolean = false;
  
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
            ? 'text-gray-700' 
            : 'text-gray-700 hover:bg-gray-100'}"
    style={active 
        ? 'background-color: rgba(0, 150, 136, 0.1); color: var(--color-propolis-teal);'
        : ''}
    on:click={() => dispatch('click')}
  >
    {#if icon}
      <svelte:component 
        this={icon} 
        class="w-5 h-5"
        style="color: {active ? 'var(--color-propolis-teal)' : '#6b7280'}"
      />
    {/if}
    
    <span>{text}</span>
    
    {#if badge !== null}
      <div class="ml-auto text-xs font-medium px-2 py-0.5 rounded" style="background-color: rgba(0, 150, 136, 0.1); color: var(--color-propolis-teal);">
        {badge}
      </div>
    {/if}
  </a>
{:else}
  <a 
    href={to} 
    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          {active 
            ? 'text-gray-700' 
            : 'text-gray-700 hover:bg-gray-100'}"
    style={active 
        ? 'background-color: rgba(0, 150, 136, 0.1); color: var(--color-propolis-teal);'
        : ''}
    on:click|preventDefault={handleClick}
  >
    {#if icon}
      <svelte:component 
        this={icon} 
        class="w-5 h-5"
        style="color: {active ? 'var(--color-propolis-teal)' : '#6b7280'}"
      />
    {/if}
    
    <span>{text}</span>
    
    {#if badge !== null}
      <div class="ml-auto text-xs font-medium px-2 py-0.5 rounded" style="background-color: rgba(0, 150, 136, 0.1); color: var(--color-propolis-teal);">
        {badge}
      </div>
    {/if}
  </a>
{/if}