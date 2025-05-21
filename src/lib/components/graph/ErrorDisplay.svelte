<script>
  export let error = '';
  export let onRetry = () => {};
</script>

<div class="error-container">
  <p class="error">{error}</p>
  <button class="retry-button" on:click={onRetry}>
    Try Again
  </button>
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    padding: 1rem;
  }
  
  .error {
    color: var(--color-coral-600);
    font-weight: 500;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .retry-button {
    background-color: var(--color-coral-500);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .retry-button:hover {
    background-color: var(--color-coral-600);
  }
</style>