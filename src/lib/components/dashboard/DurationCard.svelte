<script lang="ts">
    import { Clock } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
	  import type { TimeTracker } from '$lib/types/dashboard';
    
    // Props with defaults
    export let time: TimeTracker
    export let title: string
  </script>
  
  <CardWidget>
    <div class="flex items-center gap-2 font-bold text-xl mb-2">
      
    {title} 
    </div>
    
    <div class="mb-4">
      <div class="text-2xl">{time.days} Days</div>
    </div>
    
  </CardWidget>