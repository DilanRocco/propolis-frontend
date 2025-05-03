<script>
    import { Lock } from 'lucide-svelte';
    import CardWidget from './CardWidget.svelte';
    
    function toggleSystemLock() {
      // Handle system lock toggle
      console.log('System lock toggled');
    }
  </script>
  
  <CardWidget>
    <div class="flex flex-col items-center justify-center">
      <button 
        class="bg-white p-4 rounded-full mb-2"
        on:click={toggleSystemLock}
      >
        <Lock class="w-6 h-6 text-gray-800" />
      </button>
      <div class="font-medium mb-1">System Lock</div>
    </div>
  </CardWidget>