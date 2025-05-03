<script lang="ts">
    import CardWidget from './CardWidget.svelte';
    
    // Props with defaults
    export let stocksValue = 16073.49;
    export let growthPercentage = 9.3;
    export let ratingQuestion = "How is your business management going?";
    
    // State
    let selectedRating = 0;
    
    function setRating(rating: number) {
      selectedRating = rating;
    }
  </script>
  
  <CardWidget marginBottom={false}>
    <div class="flex justify-between items-center mb-2">
      <div class="text-2xl font-bold">$ {stocksValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div class="text-coral-500 font-medium">+ {growthPercentage}%</div>
    </div>
    
    <div class="mb-4">
      <h3 class="font-medium">Main Stocks</h3>
      <div class="text-xs text-gray-500">Extended & Limited</div>
    </div>
    
    <div class="h-32 mb-4 flex items-end">
      <svg viewBox="0 0 300 100" class="w-full h-full">
        <path
          d="M0,50 C20,40 40,60 60,50 C80,40 100,60 120,70 C140,80 160,30 180,40 C200,50 220,60 240,50 C260,40 280,60 300,50"
          fill="none"
          stroke="#F97367"
          stroke-width="2"
        />
      </svg>
    </div>
    
    <div class="flex justify-between items-center mb-6">
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div class="w-2 h-2 bg-gray-800 rounded-full"></div>
      </div>
      <button class="text-xs">×</button>
    </div>
    
    <div class="border-t border-gray-200 pt-4">
      <div class="text-xs text-gray-500 mb-1">Review rating</div>
      <div class="text-xl font-medium mb-2">{ratingQuestion}</div>
      
      <div class="flex items-center justify-between mt-4">
        {#each Array(5) as _, i}
          <button 
            class="w-8 h-8 rounded-full border {selectedRating === i + 1 ? 'border-coral-500 bg-coral-50' : 'border-gray-300'}"
            on:click={() => setRating(i + 1)}
          ></button>
        {/each}
      </div>
    </div>
  </CardWidget>