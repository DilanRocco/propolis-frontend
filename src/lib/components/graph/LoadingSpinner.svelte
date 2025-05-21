<script>
  // Simple loading spinner component
</script>

<div class="loading-container">
  <div class="loading-spinner"></div>
  <p>Loading data...</p>
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-coral-100);
    border-top: 3px solid var(--color-coral-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
