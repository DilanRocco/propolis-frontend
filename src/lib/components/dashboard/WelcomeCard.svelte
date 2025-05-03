<script>
    import { ArrowRight, Calendar } from 'lucide-svelte';
    import { onMount } from 'svelte';
    
    // Date state
    let day = 19;
    let dayOfWeek = 'Tue';
    let month = 'December';
    
    onMount(() => {
      // You could update the date dynamically on mount
      const now = new Date();
      day = now.getDate();
      dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'short' });
      month = now.toLocaleDateString('en-US', { month: 'long' });
    });
    
    function showTasks() {
      // Handle showing tasks
      console.log('Show tasks clicked');
    }
  </script>
  
  <div class="flex justify-between items-center mb-8">
    <div class="flex items-center gap-6">
      <div class="border border-gray-200 rounded-full p-6 flex flex-col items-center justify-center w-28 h-28">
        <div class="text-3xl font-bold">{day}</div>
        <div>
          <div class="text-sm font-medium">{dayOfWeek},</div>
          <div class="text-sm font-medium">{month}</div>
        </div>
      </div>
      
      <button 
        class="bg-coral-500 text-white px-4 py-3 rounded-full flex items-center gap-2"
        on:click={showTasks}
      >
        <span>Show my Tasks</span>
        <ArrowRight class="w-4 h-4" />
      </button>
      
      <button class="p-2 border border-gray-200 rounded-lg">
        <Calendar class="w-5 h-5 text-gray-600" />
      </button>
    </div>
    
    <div class="flex flex-col items-start">
      <div class="text-4xl font-bold mb-2">Hey, Need help?👋</div>
      <div class="text-gray-400 text-2xl">Just ask me anything!</div>
    </div>
  </div>