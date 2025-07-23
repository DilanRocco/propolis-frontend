<script lang="ts">
  import type { DashboardData } from '../types/dashboard';
  import { dashboardLoading } from '../stores/simpleDashboardStore';
	import WelcomeCard from './dashboard/WelcomeCard.svelte';
  import CardWidget from './dashboard/CardWidget.svelte';
  
  export let dashboardData: DashboardData;
  
  $: loading = $dashboardLoading;
  
  // Format currency values
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
  
  // Format percentage values
  function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
  
  // Format large numbers with commas
  function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
  
</script>

<div class="dashboard-summary">
  
  <WelcomeCard />
  <p class="subtitle">Real-time data from Doorloop (Long-term) and Guesty (Short-term)</p>
  
  <!-- Revenue Section -->
  <div class="section">
    <h2>📊 Revenue Overview</h2>
    <div class="cards-grid">
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Total Revenue</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">${dashboardData.totalRevenue}</div>
       
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Long Term Revenue</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">${dashboardData.longTermRevenue}</div>
       
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Short Term Revenue</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">${dashboardData.shortTermRevenue}</div>
       
      </CardWidget>
     
    </div>
  </div>
  
  <!-- Occupancy Section -->
  <div class="section">
    <h2>🏠 Occupancy Rates</h2>
    <div class="cards-grid">
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Average Occupancy</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">{formatPercentage(dashboardData.averageOccupancyRate)}</div>
       
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Long-term Occupancy</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">{formatPercentage(dashboardData.longTermOccupancyRate)}</div>
        
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Short-term Occupancy</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-yellow)]">{formatPercentage(dashboardData.shortTermOccupancyRate)}</div>
        
      </CardWidget>
    </div>
  </div>
  
  <!-- Additional Metrics -->
  <div class="section">
    <h2>📈 Additional Metrics</h2>
    <div class="cards-grid four-column">
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Avg Lease Tenancy</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">{dashboardData.averageLeaseTenancy} days</div>
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Time to Lease</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">{dashboardData.timeToLease} days</div>
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Tenant Turnover</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-yellow)]">{formatPercentage(dashboardData.tenantTurnover)}</div>
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Avg Daily Rate</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-yellow)]">{formatCurrency(dashboardData.shortTermAverageDailyRate)}</div>
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Revenue per Available Room</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-teal)]">{formatCurrency(dashboardData.revenuePerAvailableRoom)}</div>
      </CardWidget>
      <CardWidget info="Formula: coming soon">
        <span slot="title" class="mb-1 text-xs text-gray-500 font-semibold">Balance Overdue</span>
        <div class="card-value text-2xl font-bold text-[color:var(--color-propolis-yellow)]">{formatCurrency(dashboardData.leaseBalanceOverdue)}</div>
      </CardWidget>
    </div>
  </div>
</div>

<style>
  .dashboard-summary {
    padding: 0rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .subtitle {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }
  
  .section {
    margin-bottom: 3rem;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  .cards-grid.four-column {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    .cards-grid, .cards-grid.four-column {
      grid-template-columns: 1fr;
    }
  }
 
  
  .card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
 
  
  @media (max-width: 768px) {
    .dashboard-summary {
      padding: 1rem;
    }
    

    
    .cards-grid {
      grid-template-columns: 1fr;
    }
    
    .cards-grid.four-column {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 