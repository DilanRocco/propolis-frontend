<script>
  export let message = 'No data available';
</script>

<div class="empty-state">
  <p>{message}</p>
</div>

<style>
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #777;
    background-color: #fafafa;
    border-radius: 8px;
    border: 1px dashed #ddd;
    padding: 1rem;
    text-align: center;
  }
</style>