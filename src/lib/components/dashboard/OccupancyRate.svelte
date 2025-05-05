<!-- OccupancyRate.svelte -->
<script lang="ts">
    import { RefreshCw, Eye } from 'lucide-svelte';
    import ProgressCircle from '../ui/ProgressCircle.svelte';
    import CardWidget from './CardWidget.svelte';
    import type { OccupancyTerm } from '../../types/dashboard';
    
    // Props with defaults
    export let occupancyRate: OccupancyTerm = {
        averageOccupancyTerm: 10,
        averageShortTermRate: 11,
        averageLongTermRate: 12,
    }
  
    // Functions
    function changeTimeFrame() {
      //TODO: Implement time frame change
      console.log('Time frame changed');
    }
    
    function viewChartMode() {
      //TODO: Implement chart view
      console.log('View chart mode clicked');
    }
  
    // Responsive handling
    let containerWidth: number;
    $: isLargeScreen = containerWidth > 500;
    $: isMediumScreen = containerWidth > 380 && containerWidth <= 500;
    $: radius = isLargeScreen ? 70 : isMediumScreen ? 60 : 50;
  </script>
  
  <div bind:clientWidth={containerWidth}>
  <CardWidget>
    <div class="card-header">
      <h2 class="title">Occupancy Rate</h2>
      <div class="actions">
        <button class="action-button" on:click={changeTimeFrame} title="Refresh data">
          <RefreshCw size={18} />
        </button>
        <button class="action-button" on:click={viewChartMode} title="View chart">
          <Eye size={18} />
        </button>
      </div>
    </div>
  
    <div class="content">
      <!-- Responsive layout that adapts based on container width -->
      {#if isLargeScreen}
        <!-- Larger screen layout: 2-1 arrangement -->
        <div class="circles-container large">
          <div class="top-row">
            <ProgressCircle 
              {radius} 
              percentage={occupancyRate.averageOccupancyTerm} 
              color="#f97367" 
              label="Average"
            />
            <ProgressCircle 
              {radius} 
              percentage={occupancyRate.averageLongTermRate} 
              color="#f97367" 
              label="Long term rentals"
            />
          </div>
          <div class="bottom-row">
            <ProgressCircle 
              {radius} 
              percentage={occupancyRate.averageShortTermRate} 
              color="#f97367" 
              label="Short term rentals"
            />
          </div>
        </div>
      {:else}
        <!-- Smaller screen layout: stack vertically -->
        <div class="circles-container small">
          <ProgressCircle 
            {radius} 
            percentage={occupancyRate.averageOccupancyTerm} 
            color="#f97367" 
            label="Average"
          />
          <ProgressCircle 
            {radius} 
            percentage={occupancyRate.averageLongTermRate} 
            color="#f97367" 
            label="Long term rentals"
          />
          <ProgressCircle 
            {radius} 
            percentage={occupancyRate.averageShortTermRate} 
            color="#f97367" 
            label="Short term rentals"
          />
        </div>
      {/if}
    </div>
  </CardWidget>
  </div>
  
  <style>
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8fafc;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .action-button:hover {
      background-color: #f1f5f9;
      color: #334155;
    }
    
    /* Content layout */
    .content {
      width: 100%;
    }
    
    .circles-container {
      display: flex;
      width: 100%;
    }
    
    .circles-container.large {
      flex-direction: column;
      gap: 2rem;
    }
    
    .circles-container.small {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    
    .top-row, .bottom-row {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }
    
    /* Media queries for responsive design */
    @media (max-width: 640px) {
      .title {
        font-size: 1.25rem;
      }
    }
  </style>