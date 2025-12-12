<script lang="ts">
  import { Calendar, TrendingUp, TrendingDown } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { fetchDashboardData, dashboardData, dashboardLoading } from '../../stores/simpleDashboardStore';
  import { globalPropertyFilter, type PropertyOption } from '../../stores/globalPropertyFilter';
  import type { DashboardData } from '../../types/dashboard';
  import { get } from 'svelte/store';

  // Date ranges for both periods
  let dateRange1 = { start: '', end: '' };
  let dateRange2 = { start: '', end: '' };
  
  // Properties for both periods
  let property1: PropertyOption | null = null;
  let property2: PropertyOption | null = null;
  
  // KPI data for both periods
  let kpis1: DashboardData | null = null;
  let kpis2: DashboardData | null = null;
  
  // Loading states
  let loading1 = false;
  let loading2 = false;
  
  $: loading = $dashboardLoading || loading1 || loading2;

  onMount(async () => {
    // Load properties
    await globalPropertyFilter.loadProperties(fetch);
    
    // Initialize with current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    dateRange1.start = startOfMonth.toISOString().split('T')[0];
    dateRange1.end = endOfMonth.toISOString().split('T')[0];
    
    // Set period 2 to previous month
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    dateRange2.start = prevMonthStart.toISOString().split('T')[0];
    dateRange2.end = prevMonthEnd.toISOString().split('T')[0];
  });

  async function fetchPeriod1() {
    if (!dateRange1.start || !dateRange1.end) return;
    
    loading1 = true;
    try {
      // Temporarily set property filter
      const originalProperty = $globalPropertyFilter.selectedProperty;
      if (property1) {
        globalPropertyFilter.setSelectedProperty(property1);
      } else {
        globalPropertyFilter.clearSelectedProperty();
      }
      
      await fetchDashboardData({
        startDate: dateRange1.start,
        endDate: dateRange1.end
      });
      
      // Get the data from store
      const data = get(dashboardData);
      if (data) {
        kpis1 = { ...data };
      }
      
      // Restore original property
      if (originalProperty) {
        globalPropertyFilter.setSelectedProperty(originalProperty);
      } else {
        globalPropertyFilter.clearSelectedProperty();
      }
    } catch (error) {
      console.error('Error fetching period 1:', error);
    } finally {
      loading1 = false;
    }
  }

  async function fetchPeriod2() {
    if (!dateRange2.start || !dateRange2.end) return;
    
    loading2 = true;
    try {
      // Temporarily set property filter
      const originalProperty = $globalPropertyFilter.selectedProperty;
      if (property2) {
        globalPropertyFilter.setSelectedProperty(property2);
      } else {
        globalPropertyFilter.clearSelectedProperty();
      }
      
      await fetchDashboardData({
        startDate: dateRange2.start,
        endDate: dateRange2.end
      });
      
      // Get the data from store
      const data = get(dashboardData);
      if (data) {
        kpis2 = { ...data };
      }
      
      // Restore original property
      if (originalProperty) {
        globalPropertyFilter.setSelectedProperty(originalProperty);
      } else {
        globalPropertyFilter.clearSelectedProperty();
      }
    } catch (error) {
      console.error('Error fetching period 2:', error);
    } finally {
      loading2 = false;
    }
  }

  function calculateChange(val1: number, val2: number, inverse = false) {
    if (val1 === 0) return { change: val2 === 0 ? 0 : 100, isPositive: !inverse };
    const change = ((val2 - val1) / val1) * 100;
    const isPositive = inverse ? change < 0 : change > 0;
    return { change: parseFloat(change.toFixed(1)), isPositive };
  }

  function formatValue(value: number, type: string): string {
    switch(type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'number':
        return value.toLocaleString();
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'days':
        return `${value} days`;
      default:
        return value.toString();
    }
  }

  const kpiDefinitions = [
    { key: 'totalRevenue', label: 'Total Revenue', type: 'currency', inverse: false },
    { key: 'longTermRevenue', label: 'Long Term Revenue', type: 'currency', inverse: false },
    { key: 'shortTermRevenue', label: 'Short Term Revenue', type: 'currency', inverse: false },
    { key: 'averageOccupancyRate', label: 'Average Occupancy', type: 'percentage', inverse: false },
    { key: 'longTermOccupancyRate', label: 'Long-term Occupancy', type: 'percentage', inverse: false },
    { key: 'shortTermOccupancyRate', label: 'Short-term Occupancy', type: 'percentage', inverse: false },
    { key: 'averageLeaseTenancy', label: 'Avg Lease Tenancy', type: 'days', inverse: false },
    { key: 'timeToLease', label: 'Time to Lease', type: 'days', inverse: true },
    { key: 'tenantTurnover', label: 'Tenant Turnover', type: 'percentage', inverse: true },
    { key: 'shortTermAverageDailyRate', label: 'Avg Daily Rate', type: 'currency', inverse: false },
    { key: 'revenuePerAvailableRoom', label: 'Revenue per Available Room', type: 'currency', inverse: false },
    { key: 'leaseBalanceOverdue', label: 'Balance Overdue', type: 'currency', inverse: true }
  ];

</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">KPI Comparison Dashboard</h1>
      <p class="text-gray-600">Compare performance metrics across two different time periods and properties</p>
    </div>

    <!-- Date Range and Property Inputs -->
    <div class="flex gap-4 mb-8">
      <!-- Period 1 -->
      <div class="flex-1 bg-white rounded-lg p-4 shadow-sm border-l-4" style="border-left-color: #3b82f6">
        <div class="flex items-center gap-2 mb-3">
          <Calendar class="w-4 h-4" style="color: #3b82f6" />
          <h3 class="font-semibold text-gray-700">Period 1</h3>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-gray-600 block mb-1">Start Date</label>
            <input
              type="date"
              bind:value={dateRange1.start}
              on:change={fetchPeriod1}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 block mb-1">End Date</label>
            <input
              type="date"
              bind:value={dateRange1.end}
              on:change={fetchPeriod1}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 block mb-1">Property (Optional)</label>
            <div class="relative">
              <select
                on:change={(e) => {
                  const selectedId = e.target.value;
                  if (selectedId) {
                    const prop = $globalPropertyFilter.availableProperties.find(p => p.id === selectedId);
                    property1 = prop || null;
                  } else {
                    property1 = null;
                  }
                  fetchPeriod1();
                }}
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Properties</option>
                {#each $globalPropertyFilter.availableProperties as prop}
                  <option value={prop.id} selected={property1?.id === prop.id}>
                    {prop.name}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          {#if loading1}
            <div class="text-xs text-blue-600">Loading...</div>
          {/if}
        </div>
      </div>

      <!-- Period 2 -->
      <div class="flex-1 bg-white rounded-lg p-4 shadow-sm border-l-4" style="border-left-color: #9333ea">
        <div class="flex items-center gap-2 mb-3">
          <Calendar class="w-4 h-4" style="color: #9333ea" />
          <h3 class="font-semibold text-gray-700">Period 2</h3>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-xs text-gray-600 block mb-1">Start Date</label>
            <input
              type="date"
              bind:value={dateRange2.start}
              on:change={fetchPeriod2}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 block mb-1">End Date</label>
            <input
              type="date"
              bind:value={dateRange2.end}
              on:change={fetchPeriod2}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="text-xs text-gray-600 block mb-1">Property (Optional)</label>
            <div class="relative">
              <select
                on:change={(e) => {
                  const selectedId = e.target.value;
                  if (selectedId) {
                    const prop = $globalPropertyFilter.availableProperties.find(p => p.id === selectedId);
                    property2 = prop || null;
                  } else {
                    property2 = null;
                  }
                  fetchPeriod2();
                }}
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Properties</option>
                {#each $globalPropertyFilter.availableProperties as prop}
                  <option value={prop.id} selected={property2?.id === prop.id}>
                    {prop.name}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          {#if loading2}
            <div class="text-xs text-purple-600">Loading...</div>
          {/if}
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    {#if kpis1 && kpis2}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each kpiDefinitions as definition}
          {@const val1 = kpis1[definition.key]}
          {@const val2 = kpis2[definition.key]}
          {@const { change, isPositive } = calculateChange(val1, val2, definition.inverse)}
          
          <div class="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-sm text-gray-600 mb-2">{definition.label}</div>
            
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div class="text-xs text-gray-500 mb-1">Period 1</div>
                <div class="text-2xl font-bold text-blue-600">
                  {formatValue(val1, definition.type)}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Period 2</div>
                <div class="text-2xl font-bold text-purple-600">
                  {formatValue(val2, definition.type)}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 text-sm font-semibold {isPositive ? 'text-green-600' : 'text-red-600'}">
              {#if isPositive}
                <TrendingUp class="w-4 h-4" />
              {:else}
                <TrendingDown class="w-4 h-4" />
              {/if}
              <span>{Math.abs(change)}%</span>
              <span class="text-xs text-gray-500 font-normal ml-1">
                {isPositive ? 'increase' : 'decrease'}
              </span>
            </div>
          </div>
        {/each}
      </div>

      <!-- Legend -->
      <div class="mt-8 bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Legend</h3>
        <div class="flex gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-600 rounded"></div>
            <span class="text-gray-600">Period 1</span>
            {#if property1}
              <span class="text-gray-500">({property1.name})</span>
            {/if}
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-purple-600 rounded"></div>
            <span class="text-gray-600">Period 2</span>
            {#if property2}
              <span class="text-gray-500">({property2.name})</span>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="bg-white rounded-lg p-8 text-center">
        <p class="text-gray-600">Select date ranges and click to load data for both periods</p>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.lucide) {
    display: inline-block;
  }
</style>

