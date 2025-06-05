<script lang="ts">
  import { getDoorloopOccupancyRate, type DoorloopOccupancyResponse } from '../api/doorloop';
  
  let startDate = '';
  let endDate = '';
  let occupancyData: DoorloopOccupancyResponse | null = null;
  let loading = false;
  let error = '';

  // Set default dates to current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  startDate = startOfMonth.toISOString().split('T')[0];
  endDate = endOfMonth.toISOString().split('T')[0];

  async function fetchOccupancy() {
    if (!startDate || !endDate) {
      error = 'Please select both start and end dates';
      return;
    }

    loading = true;
    error = '';
    
    try {
      occupancyData = await getDoorloopOccupancyRate(startDate, endDate);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch occupancy data';
      occupancyData = null;
    } finally {
      loading = false;
    }
  }

  // Auto-fetch on component mount
  import { onMount } from 'svelte';
  onMount(() => {
    fetchOccupancy();
  });
</script>

<div class="doorloop-occupancy">
  <h3>Long-Term Occupancy Rate (Doorloop)</h3>
  
  <div class="date-controls">
    <div class="date-input">
      <label for="start-date">Start Date:</label>
      <input 
        id="start-date"
        type="date" 
        bind:value={startDate}
        on:change={fetchOccupancy}
      />
    </div>
    
    <div class="date-input">
      <label for="end-date">End Date:</label>
      <input 
        id="end-date"
        type="date" 
        bind:value={endDate}
        on:change={fetchOccupancy}
      />
    </div>
    
    <button 
      on:click={fetchOccupancy}
      disabled={loading}
      class="refresh-btn"
    >
      {loading ? 'Loading...' : 'Refresh'}
    </button>
  </div>

  {#if error}
    <div class="error">
      <p>⚠️ {error}</p>
    </div>
  {/if}

  {#if occupancyData}
    <div class="occupancy-display">
      <div class="occupancy-rate">
        <span class="rate">{occupancyData.occupancy_rate}%</span>
        <span class="label">Occupancy Rate</span>
      </div>
      
      <div class="details">
        <div class="detail-item">
          <span class="value">{occupancyData.occupied_units}</span>
          <span class="label">Occupied Units</span>
        </div>
        
        <div class="detail-item">
          <span class="value">{occupancyData.total_units}</span>
          <span class="label">Total Units</span>
        </div>
        
        <div class="detail-item">
          <span class="value">{occupancyData.date_from}</span>
          <span class="label">From</span>
        </div>
        
        <div class="detail-item">
          <span class="value">{occupancyData.date_to}</span>
          <span class="label">To</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .doorloop-occupancy {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.3em;
  }

  .date-controls {
    display: flex;
    gap: 15px;
    align-items: end;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .date-input {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .date-input label {
    font-size: 0.9em;
    color: #666;
    font-weight: 500;
  }

  .date-input input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .refresh-btn {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .refresh-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  .refresh-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .error {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
    padding: 12px;
    margin: 10px 0;
  }

  .error p {
    margin: 0;
    color: #856404;
  }

  .occupancy-display {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .occupancy-rate {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
  }

  .occupancy-rate .rate {
    display: block;
    font-size: 3em;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .occupancy-rate .label {
    font-size: 1.1em;
    opacity: 0.9;
  }

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
    text-align: center;
  }

  .detail-item .value {
    font-size: 1.4em;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  .detail-item .label {
    font-size: 0.9em;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    .date-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .details {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 