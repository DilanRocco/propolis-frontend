<script>
    // Props
    export let marginBottom = true;
    export let info = '';
</script>
  
  <div class="bg-gray-50 p-6 rounded-xl card-metric {marginBottom ? 'mb-6' : ''} border-2 border-[color:var(--color-propolis-teal)] relative min-h-[180px] flex flex-col justify-between">
    <div class="flex justify-between items-start mb-2">
      <slot name="title"></slot>
      {#if info}
        <div class="group relative flex items-center ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-[color:var(--color-propolis-yellow)] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>
          <div class="absolute left-1/2 top-full z-10 mt-2 w-40 -translate-x-1/2 rounded bg-white p-2 text-xs text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            {info}
          </div>
        </div>
      {/if}
    </div>
    <div class="flex-1 flex flex-col justify-center">
      <slot></slot>
    </div>
  </div>

<style>
  .card-metric {
    min-width: 220px;
    max-width: 100%;
    min-height: 180px;
    box-sizing: border-box;
    /* Subtle shadow and border for propolis accent */
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03);
  }
</style>