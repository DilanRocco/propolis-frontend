<script lang="ts">
    import { login } from '$lib/api/auth';
    import { goto } from '$app/navigation';
    let email = '';
    let password = '';
    let errorMessage = '';
  
    async function handleLogin() {
      try {
        await login(email, password);
        goto('/dashboard');
      } catch (err: any) {
        errorMessage = err.message || 'Login failed';
      }
    }
  </script>
  
  <form on:submit|preventDefault={handleLogin}>
    <input bind:value={email} placeholder="Email" required />
    <input bind:value={password} type="password" placeholder="Password" required />
    <button type="submit">Login</button>
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}
  </form>
  