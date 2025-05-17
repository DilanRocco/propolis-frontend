<script lang="ts">
    import type { Revenue }  from "../../types/dashboard"
    import { RefreshCw, Eye } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
    
    // Props with defaults
    export let income: Revenue
    export let timeframe = "Weekly";


    function changeTimeFrame() {
      //TODO
    }
    function viewChartMode() {
      //TODO
      // Handle view chart mode
      console.log('View chart mode clicked');
    }
  </script>
  
  <CardWidget>
    <div class="flex justify-between mb-4">
    <div>
      <div class="text-xs text-gray-500 mb-1">Total Revenue</div>
      <div class="text-2xl font-bold"><span class="text-coral-500">$</span>  {income.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
      <button on:click={changeTimeFrame} class="flex gap-2 cursor-pointer">
        <span class="text-sm">{timeframe}</span>
        <span class="text-sm">▼</span>
      </button>
    </div>
    
    
    <div class="pt-6 border-t border-gray-200 mb-4">
      
      <div>
        <div class="text-xs text-gray-500 mb-1">Total long term</div>
        <div class="text-2xl font-bold"><span class="text-coral-500">$</span>  {income.totalLongTerm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
    </div>
    <div class="pt-6 border-t border-gray-200 mb-4">
      
      <div>
        <div class="text-xs text-gray-500 mb-1">Total short term</div>
        <div class="text-2xl font-bold"> <span class="text-coral-500">$</span> {income.totalShortTerm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
    </div>
    
    <button on:click={viewChartMode} class="flex items-center gap-2 mt-6 cursor-pointer">
      <div 
        class="bg-coral-100 p-1 rounded-full"
        
      >
        <Eye class="w-4 h-4 text-coral-500" />
      </div>
      <div class="text-xs">
        <span class="font-medium">View</span>
        <span class="text-gray-500"> on chart mode</span>
      </div>
    </button>
  </CardWidget>