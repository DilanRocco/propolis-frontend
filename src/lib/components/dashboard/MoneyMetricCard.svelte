<script lang="ts">
    import { Clock } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
	import type { MoneyMetric } from '$lib/types/dashboard';
    
    // Props with defaults
    export let moneyMetric: MoneyMetric
    export let title: string
  </script>
  
  <CardWidget>
    <div class="flex items-center gap-2 font-bold text-xl mb-2">
      
    {title} 
    </div>
    
    <div class="mb-4">
      <div class="text-2xl font-bold"><span class="text-coral-500">$</span> {moneyMetric.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    
  </CardWidget>