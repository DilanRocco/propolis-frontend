<!-- OccupancyRate.svelte -->
<script lang="ts">
    import { RefreshCw, Eye } from 'lucide-svelte';
    import ProgressCircle from '../ui/ProgressCircle.svelte';
    import CardWidget from './CardWidget.svelte';
    // Props with defaults
    export let averageOccupancyTerm: number;
    export let averageShortTermRate: number;
    export let averageLongTermRate: number;
    // Functions
    function changeTimeFrame() {
      //TODO: Implement time frame change
    }
    function viewChartMode() {
      //TODO: Implement chart view
    }
    // Responsive handling
    let containerWidth: number;
    $: isLargeScreen = containerWidth > 500;
    $: isMediumScreen = containerWidth > 380 && containerWidth <= 500;
    $: radius = isLargeScreen ? 70 : isMediumScreen ? 60 : 50;
</script>

<div bind:clientWidth={containerWidth}>
  <CardWidget info="Formula: coming soon">
    <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Occupancy Rate</span>
    <div class="content">
      {#if isLargeScreen}
        <div class="circles-container large">
          <div class="top-row">
            <ProgressCircle 
              {radius} 
              percentage={averageOccupancyTerm} 
              color="var(--color-propolis-teal)" 
              label="Average"
            />
            <ProgressCircle 
              {radius} 
              percentage={averageLongTermRate} 
              color="var(--color-propolis-yellow)" 
              label="Long term rentals"
            />
          </div>
          <div class="bottom-row">
            <ProgressCircle 
              {radius} 
              percentage={averageShortTermRate} 
              color="var(--color-propolis-yellow)" 
              label="Short term rentals"
            />
          </div>
        </div>
      {:else}
        <div class="circles-container small">
          <ProgressCircle 
            {radius} 
            percentage={averageOccupancyTerm} 
            color="var(--color-propolis-teal)" 
            label="Average"
          />
          <ProgressCircle 
            {radius} 
            percentage={averageLongTermRate} 
            color="var(--color-propolis-yellow)" 
            label="Long term rentals"
          />
          <ProgressCircle 
            {radius} 
            percentage={averageShortTermRate} 
            color="var(--color-propolis-yellow)" 
            label="Short term rentals"
          />
        </div>
      {/if}
    </div>
  </CardWidget>
</div>

<style>
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
</style>