<script lang="ts">
    import { Edit } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
    
    // Props with defaults
    export let cardNumber = "**** 2719";
    export let monthlyFee = 25.00;
    
    // State
    let activeTab = "receive"; // "receive" or "send"
    
    function setTab(tab: string) {
      activeTab = tab;
    }
    
    function editCardLimits() {
      // Handle edit card limitations
      console.log('Edit card limitations clicked');
    }
  </script>
  
  <CardWidget>
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="text-sm">Direct Debits</span>
        <span class="text-xs">▼</span>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="text-xs text-gray-500 mb-1">Linked to main account</div>
      <div class="text-lg font-bold">{cardNumber}</div>
    </div>
    
    <div class="flex gap-4 mb-4">
      <button 
        class="{activeTab === 'receive' ? 'bg-black text-white' : ''} px-6 py-2 rounded-full text-sm"
        on:click={() => setTab('receive')}
      >
        Receive
      </button>
      <button 
        class="{activeTab === 'send' ? 'bg-black text-white' : ''} text-sm"
        on:click={() => setTab('send')}
      >
        Send
      </button>
    </div>
    
    <div class="pt-4 border-t border-gray-200">
      <div class="text-xs text-gray-500 mb-1">Monthly regular fee</div>
      <div class="text-lg font-medium text-coral-500">$ {monthlyFee.toFixed(2)}</div>
    </div>
    
    <div class="flex items-center gap-2 mt-4">
      <button 
        class="bg-coral-100 p-1 rounded-full"
        on:click={editCardLimits}
      >
        <Edit class="w-4 h-4 text-coral-500" />
      </button>
      <div class="text-xs">
        <span class="font-medium">Edit</span>
        <span class="text-gray-500"> cards limitation</span>
      </div>
    </div>
  </CardWidget>