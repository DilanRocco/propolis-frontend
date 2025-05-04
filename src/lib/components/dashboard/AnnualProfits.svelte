
<script>
    import CardWidget from './CardWidget.svelte';
    
    export let year = "2023";
    export let profits = [
      { value: "4K", color: "coral-500", size: 24, position: { top: 36, right: 28 } },
      { value: "6.8K", color: "coral-300", size: 36, position: { top: 28, right: 28 } },
      { value: "9.3K", color: "coral-200", size: 48, position: { top: 20, right: 28 } },
      { value: "14K", color: "coral-100", size: 64, position: { top: 10, right: 24 } },
    ];
  </script>
  
  <CardWidget marginBottom={false}>
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-bold">Annual profits</h3>
      <div class="flex items-center gap-2 text-sm">
        <span>{year}</span>
        <span class="text-xs">▼</span>
      </div>
    </div>
    
    <div class="relative h-64 flex items-center justify-center">
      {#each profits as profit, i}
        <div class="absolute inset-0 flex items-center justify-center">
          <div 
            class="bg-{profit.color} rounded-full w-{profit.size} h-{profit.size} {i < profits.length - 1 ? 'opacity-' + (20 + i * 20) : ''}"
          ></div>
        </div>
        
        <div 
          class="absolute text-coral-500 font-medium" 
          style="top: {profit.position.top}px; right: {profit.position.right}px; z-index: {i + 1};"
        >
          $ {profit.value}
        </div>
      {/each}
    </div>
  </CardWidget>