<script>
    import { RefreshCw, Eye } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
    
    // Props with defaults
    export let totalIncome = 23194.80;
    export let totalPaid = 8145.20;
    export let timeframe = "Weekly";
    
    function viewChartMode() {
      // Handle view chart mode
      console.log('View chart mode clicked');
    }
  </script>
  
  <CardWidget>
    <div class="flex items-center justify-between mb-4">
      <RefreshCw class="w-5 h-5 text-gray-400" />
      <div class="flex items-center gap-2">
        <span class="text-sm">{timeframe}</span>
        <span class="text-xs">▼</span>
      </div>
    </div>
    
    <div class="mb-6">
      <div class="text-xs text-gray-500 mb-1">Total income</div>
      <div class="text-2xl font-bold">$ {totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    
    <div class="pt-6 border-t border-gray-200 mb-4">
      <div class="flex items-center justify-between mb-4">
        <RefreshCw class="w-5 h-5 text-gray-400" />
        <div class="flex items-center gap-2">
          <span class="text-sm">{timeframe}</span>
          <span class="text-xs">▼</span>
        </div>
      </div>
      
      <div>
        <div class="text-xs text-gray-500 mb-1">Total paid</div>
        <div class="text-2xl font-bold">$ {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
    </div>
    
    <div class="flex items-center gap-2 mt-6">
      <button 
        class="bg-coral-100 p-1 rounded-full"
        on:click={viewChartMode}
      >
        <Eye class="w-4 h-4 text-coral-500" />
      </button>
      <div class="text-xs">
        <span class="font-medium">View</span>
        <span class="text-gray-500"> on chart mode</span>
      </div>
    </div>
  </CardWidget>