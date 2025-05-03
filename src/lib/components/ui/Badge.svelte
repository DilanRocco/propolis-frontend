<script>
    // Props
    export let text = "";
    export let active = false;
    export let removable = false;
    export let color = active ? "coral" : "gray";
    
    // Event dispatcher
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    function handleRemove() {
      dispatch('remove', { text });
    }
  </script>
  
  <div 
    class="bg-{color}-{active ? '100' : '100'} 
          text-{color}-{active ? '500' : '700'} 
          px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
  >
    {text}
    {#if removable}
      <button on:click={handleRemove} class="text-xs ml-1">×</button>
    {/if}
  </div>