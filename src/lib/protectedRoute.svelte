<script lang="ts">
    import { onMount } from 'svelte';
    import { auth, isAuthenticated } from '$lib/api/auth';
    import { goto } from '$app/navigation';
  
    // Redirect path when not authenticated
    export let redirectTo = '/login';
    
    // Whether auth check is complete
    let checkComplete = false;
  
    onMount(async () => {
      // Try to refresh auth state from API
      await auth.checkAuth();
      checkComplete = true;
      
      // Redirect if not authenticated after check
      if (!$isAuthenticated) {
        goto(redirectTo);
      }
    });
  </script>
  
  {#if $isAuthenticated && checkComplete}
    <slot />
  {:else}
    <div class="flex h-screen items-center justify-center">
      <div class="text-center">
        <div class="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600 mx-auto"></div>
        <p>Checking authentication...</p>
      </div>
    </div>
  {/if}