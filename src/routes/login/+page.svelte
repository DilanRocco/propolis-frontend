<script lang="ts">
  import { auth, authError, isLoading } from '$lib/api/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let email = '';
  let password = '';
  let remember = false;
  
  onMount(() => {
    // Redirect to dashboard if already logged in
    if ($auth.user) {
      goto('/');
    }
  });
  
  async function handleSubmit() {
    if (!email || !password) return;
    
    const success = await auth.login(email, password);
    if (success) {
      goto('/');
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center">
  <div class="w-full max-w-md">
    <div class="rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-2xl font-bold text-gray-900">Login to your account</h1>
      
      {#if $authError}
        <div class="mb-4 rounded bg-red-100 p-3 text-red-700">
          {$authError}
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={$isLoading}
            class="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {$isLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </div>
        
      </form>
    </div>
  </div>
</div>