<script lang="ts">
  import type { DashboardData } from '../types/dashboard';
  import { dashboardLoading } from '../stores/simpleDashboardStore';
  
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
  
  // Get status color based on percentage
  function getStatusColor(percentage: number): string {
    if (percentage >= 80) return '#22c55e'; // green
    if (percentage >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  }
</script>

<div class="dashboard-summary">
  <h1>Property Management Dashboard</h1>
  <p class="subtitle">Real-time data from Doorloop (Long-term) and Guesty (Short-term)</p>
  
  <!-- Revenue Section -->
  <div class="section">
    <h2>📊 Revenue Overview</h2>
    <div class="cards-grid">
      <div class="metric-card revenue-card">
        <div class="card-header">
          <h3>Total Revenue</h3>
          <span class="badge total">Combined</span>
        </div>
        <div class="card-value">{formatCurrency(dashboardData.totalRevenue)}</div>
        <div class="card-breakdown">
          <div class="breakdown-item">
            <span class="label">Long-term</span>
            <span class="value">{formatCurrency(dashboardData.longTermRevenue)}</span>
          </div>
          <div class="breakdown-item">
            <span class="label">Short-term</span>
            <span class="value">{formatCurrency(dashboardData.shortTermRevenue)}</span>
          </div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="card-header">
          <h3>Long-term Revenue</h3>
          <span class="badge doorloop">Doorloop</span>
        </div>
        <div class="card-value">{formatCurrency(dashboardData.longTermRevenue)}</div>
        <div class="card-subtitle">Traditional rentals</div>
      </div>
      
      <div class="metric-card">
        <div class="card-header">
          <h3>Short-term Revenue</h3>
          <span class="badge guesty">Guesty</span>
        </div>
        <div class="card-value">{formatCurrency(dashboardData.shortTermRevenue)}</div>
        <div class="card-subtitle">Airbnb & short stays</div>
      </div>
    </div>
  </div>
  
  <!-- Occupancy Section -->
  <div class="section">
    <h2>🏠 Occupancy Rates</h2>
    <div class="cards-grid">
      <div class="metric-card occupancy-card">
        <div class="card-header">
          <h3>Average Occupancy</h3>
          <span class="badge average">Combined</span>
        </div>
        <div class="card-value" style="color: {getStatusColor(dashboardData.averageOccupancyRate)}">
          {formatPercentage(dashboardData.averageOccupancyRate)}
        </div>
        <div class="occupancy-bar">
          <div class="occupancy-fill" style="width: {dashboardData.averageOccupancyRate}%; background: {getStatusColor(dashboardData.averageOccupancyRate)}"></div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="card-header">
          <h3>Long-term Occupancy</h3>
          <span class="badge doorloop">Doorloop</span>
        </div>
        <div class="card-value" style="color: {getStatusColor(dashboardData.longTermOccupancyRate)}">
          {formatPercentage(dashboardData.longTermOccupancyRate)}
        </div>
        <div class="occupancy-bar">
          <div class="occupancy-fill" style="width: {dashboardData.longTermOccupancyRate}%; background: {getStatusColor(dashboardData.longTermOccupancyRate)}"></div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="card-header">
          <h3>Short-term Occupancy</h3>
          <span class="badge guesty">Guesty</span>
        </div>
        <div class="card-value" style="color: {getStatusColor(dashboardData.shortTermOccupancyRate)}">
          {formatPercentage(dashboardData.shortTermOccupancyRate)}
        </div>
        <div class="occupancy-bar">
          <div class="occupancy-fill" style="width: {dashboardData.shortTermOccupancyRate}%; background: {getStatusColor(dashboardData.shortTermOccupancyRate)}"></div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Additional Metrics -->
  <div class="section">
    <h2>📈 Additional Metrics</h2>
    <div class="cards-grid four-column">
      <div class="metric-card small">
        <h3>Avg Lease Tenancy</h3>
        <div class="card-value">{formatNumber(dashboardData.averageLeaseTenancy)} days</div>
      </div>
      
      <div class="metric-card small">
        <h3>Time to Lease</h3>
        <div class="card-value">{formatNumber(dashboardData.timeToLease)} days</div>
      </div>
      
      <div class="metric-card small">
        <h3>Tenant Turnover</h3>
        <div class="card-value">{formatPercentage(dashboardData.tenantTurnover)}</div>
      </div>
      
      <div class="metric-card small">
        <h3>Avg Daily Rate</h3>
        <div class="card-value">{formatCurrency(dashboardData.shortTermAverageDailyRate)}</div>
      </div>
      
      <div class="metric-card small">
        <h3>RevPAR</h3>
        <div class="card-value">{formatCurrency(dashboardData.revenuePerAvailableRoom)}</div>
      </div>
      
      <div class="metric-card small">
        <h3>Balance Overdue</h3>
        <div class="card-value">{formatCurrency(dashboardData.leaseBalanceOverdue)}</div>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard-summary {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .cards-grid.four-column {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .metric-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    border: 1px solid #f3f4f6;
    transition: all 0.2s ease;
  }
  
  .metric-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
  
  .metric-card.small {
    padding: 1rem;
  }
  
  .metric-card.revenue-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .metric-card.occupancy-card {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .card-header h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: inherit;
  }
  
  .metric-card.small h3 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .badge.doorloop {
    background: #fef3c7;
    color: #d97706;
  }
  
  .badge.guesty {
    background: #dbeafe;
    color: #2563eb;
  }
  
  .badge.total {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .badge.average {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  .metric-card.small .card-value {
    font-size: 1.5rem;
  }
  
  .revenue-card .card-value,
  .occupancy-card .card-value {
    color: white;
  }
  
  .card-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .revenue-card .card-subtitle,
  .occupancy-card .card-subtitle {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .card-breakdown {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .breakdown-item:last-child {
    margin-bottom: 0;
  }
  
  .breakdown-item .label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .breakdown-item .value {
    font-weight: 600;
    color: white;
  }
  
  .occupancy-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.5rem;
  }
  
  .occupancy-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .dashboard-summary {
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .cards-grid {
      grid-template-columns: 1fr;
    }
    
    .cards-grid.four-column {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 