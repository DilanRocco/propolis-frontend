<script>
    import { page } from '$app/stores';
    import { ArrowLeft } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    
    function goBack() {
      window.history.back();
    }
    
    function goToDashboard() {
      goto('/');
    }
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
    <div class="text-9xl font-bold text-gray-200 mb-4">{$page.status}</div>
    
    <h1 class="text-3xl font-bold text-gray-800 mb-2">
      {#if $page.status === 404}
        Page Not Found
      {:else}
        Error Occurred
      {/if}
    </h1>
    
    <p class="text-gray-600 max-w-md mb-8">
      {$page.error?.message || 
        ($page.status === 404 
          ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
          : 'An unexpected error occurred. Please try again later.')
      }
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4">
      <button 
        class="flex items-center justify-center gap-2 px-6 py-3 bg-coral-500 text-white rounded-lg"
        on:click={goToDashboard}
      >
        Go to Dashboard
      </button>
      
      <button 
        class="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg"
        on:click={goBack}
      >
        <ArrowLeft class="w-4 h-4" />
        Go Back
      </button>
    </div>
  </div>