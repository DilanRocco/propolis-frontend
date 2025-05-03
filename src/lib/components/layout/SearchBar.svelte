<script>
    import { Search } from 'lucide-svelte';
    export let placeholder = "Start searching here...";
    
    let searchQuery = "";
    
    function handleSearch() {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
    }
  </script>
  
  <div class="relative">
    <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
    <input
      type="text"
      bind:value={searchQuery}
      on:keyup={(e) => e.key === 'Enter' && handleSearch()}
      {placeholder}
      class="pl-10 pr-4 py-2 bg-gray-100 rounded-full w-48 text-sm"
    />
  </div>