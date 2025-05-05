<script>
    import { Clock } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
    
    // Props with defaults
    export let days = 13;
    export let hours = 109;
    export let minutes = 23;
    export let totalDots = 20;
    export let activeDots = 10;
    export let prevYear = "2022";
    export let currentYear = "2023";
  </script>
  
  <CardWidget>
    <div class="flex items-center gap-2 font-bold text-xl mb-2">
      
      Average Lease Duration
    </div>
    
    <div class="mb-4">
      <div class="text-2xl font-bold">{days} Days</div>
      <div class="text-xs text-gray-500">{hours} hours, {minutes} minutes</div>
    </div>
    
    <div class="flex flex-wrap gap-1 mb-6">
      {#each Array(totalDots) as _, i}
        <div 
          class="w-3 h-3 rounded-full {i < activeDots ? 'bg-coral-500' : 'bg-gray-300'}"
        ></div>
      {/each}
    </div>
    
    <div class="relative h-28">
      <div class="absolute inset-0">
        <div class="border-l border-gray-300 h-full absolute left-8"></div>
        <div class="border-l border-gray-300 h-full absolute left-1/2"></div>
        <div class="border-l border-gray-300 h-full absolute right-8"></div>
        
        <div class="absolute bottom-0 left-6 text-xs text-gray-500">{prevYear}</div>
        <div class="absolute -top-2 right-6 flex flex-col items-center">
          <div class="bg-coral-500 text-white text-xs px-2 py-0.5 rounded-sm">{currentYear}</div>
          <div class="bg-coral-500 w-1 h-full"></div>
        </div>
      </div>
    </div>
  </CardWidget>