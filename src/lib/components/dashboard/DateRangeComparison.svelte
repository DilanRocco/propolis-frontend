<script lang="ts">
  import { Calendar, TrendingUp, TrendingDown, Filter } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { fetchDashboardDataForComparison } from '../../stores/simpleDashboardStore';
  import { globalPropertyFilter } from '../../stores/globalPropertyFilter';
  import type { DashboardData } from '../../types/dashboard';
  import type { PropertyOption } from '../../stores/globalPropertyFilter';
  import { get } from 'svelte/store';

  // Date ranges for both periods
  let dateRange1 = { start: '', end: '' };
  let dateRange2 = { start: '', end: '' };
  
  // Property filters for both periods
  let selectedProperty1: PropertyOption | null = null;
  let selectedProperty2: PropertyOption | null = null;
  
  // Available properties
  let availableProperties: PropertyOption[] = [];
  
  // KPI data for both periods
  let kpis1: DashboardData | null = null;
  let kpis2: DashboardData | null = null;
  
  // Loading states
  let loading1 = false;
  let loading2 = false;
  
  $: loading = loading1 || loading2;
  
  // Subscribe to available properties
  $: {
    const filterState = get(globalPropertyFilter);
    availableProperties = filterState.availableProperties;
  }

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
    
    // Don't auto-fetch - wait for user to click filter button
  });

  // Apply filters when filter button is clicked
  async function applyFilters() {
    if (!dateRange1.start || !dateRange1.end || !dateRange2.start || !dateRange2.end) {
      alert('Please select date ranges for both periods');
      return;
    }
    
    // Fetch data for both periods in parallel
    await Promise.all([fetchPeriod1(), fetchPeriod2()]);
  }

  async function fetchPeriod1() {
    if (!dateRange1.start || !dateRange1.end) return;
    
    loading1 = true;
    try {
      const data = await fetchDashboardDataForComparison(
        {
          startDate: dateRange1.start,
          endDate: dateRange1.end
        },
        selectedProperty1
      );
      kpis1 = data;
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
      const data = await fetchDashboardDataForComparison(
        {
          startDate: dateRange2.start,
          endDate: dateRange2.end
        },
        selectedProperty2
      );
      kpis2 = data;
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

  function formatDateRange(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startFormatted} - ${endFormatted}`;
  }

  function getPeriodLabel(period: number): string {
    const dateRange = period === 1 ? dateRange1 : dateRange2;
    const property = period === 1 ? selectedProperty1 : selectedProperty2;
    
    const dateStr = formatDateRange(dateRange.start, dateRange.end);
    const propertyStr = property ? property.name : 'All Properties';
    
    return `${dateStr}${propertyStr !== 'All Properties' ? ` • ${propertyStr}` : ''}`;
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
      <p class="text-gray-600">Compare performance metrics across two different time periods</p>
    </div>

    <!-- Date Range Inputs -->
    <div class="flex gap-4 mb-8">
      <!-- Period 1 -->
      <div class="flex-1 bg-white rounded-lg p-4 shadow-sm border-l-4" style="border-left-color: #3b82f6">
        <div class="flex items-center gap-2 mb-3">
          <Calendar class="w-4 h-4" style="color: #3b82f6" />
          <h3 class="font-semibold text-gray-700">Period 1</h3>
        </div>
        <div class="space-y-2">
          <div>
            <label for="property1" class="text-xs text-gray-600 block mb-1">Property</label>
            <select
              id="property1"
              value={selectedProperty1?.id || ''}
              on:change={(e) => {
                const selectedId = e.currentTarget.value;
                selectedProperty1 = selectedId ? availableProperties.find(p => p.id === selectedId) || null : null;
                // Don't auto-filter, user must click filter button
              }}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Properties</option>
              {#each availableProperties as property}
                <option value={property.id}>{property.name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="startDate1" class="text-xs text-gray-600 block mb-1">Start Date</label>
            <input
              id="startDate1"
              type="date"
              bind:value={dateRange1.start}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="endDate1" class="text-xs text-gray-600 block mb-1">End Date</label>
            <input
              id="endDate1"
              type="date"
              bind:value={dateRange1.end}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
        <div class="space-y-2">
          <div>
            <label for="property2" class="text-xs text-gray-600 block mb-1">Property</label>
            <select
              id="property2"
              value={selectedProperty2?.id || ''}
              on:change={(e) => {
                const selectedId = e.currentTarget.value;
                selectedProperty2 = selectedId ? availableProperties.find(p => p.id === selectedId) || null : null;
                // Don't auto-filter, user must click filter button
              }}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">All Properties</option>
              {#each availableProperties as property}
                <option value={property.id}>{property.name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="startDate2" class="text-xs text-gray-600 block mb-1">Start Date</label>
            <input
              id="startDate2"
              type="date"
              bind:value={dateRange2.start}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label for="endDate2" class="text-xs text-gray-600 block mb-1">End Date</label>
            <input
              id="endDate2"
              type="date"
              bind:value={dateRange2.end}
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {#if loading2}
            <div class="text-xs text-purple-600">Loading...</div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Filter Button -->
    <div class="flex justify-center mb-8">
      <button
        on:click={applyFilters}
        disabled={loading || !dateRange1.start || !dateRange1.end || !dateRange2.start || !dateRange2.end}
        class="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        style="background-color: var(--color-propolis-teal);"
        on:mouseenter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.opacity = '0.9';
          }
        }}
        on:mouseleave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.opacity = '1';
          }
        }}
      >
        <Filter class="w-4 h-4" />
        Apply Filters
      </button>
    </div>

    <!-- KPI Cards -->
    {#if kpis1 && kpis2}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each kpiDefinitions as definition}
          {@const val1 = kpis1[definition.key as keyof DashboardData] as number}
          {@const val2 = kpis2[definition.key as keyof DashboardData] as number}
          {@const { change, isPositive } = calculateChange(val1, val2, definition.inverse)}
          
          <div class="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-sm text-gray-600 mb-2">{definition.label}</div>
            
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div class="text-xs text-gray-500 mb-1 break-words">{getPeriodLabel(1)}</div>
                <div class="text-2xl font-bold text-blue-600">
                  {formatValue(val1, definition.type)}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1 break-words">{getPeriodLabel(2)}</div>
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
        <div class="flex flex-col gap-3 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-600 rounded flex-shrink-0"></div>
            <span class="text-gray-600 break-words">{getPeriodLabel(1)}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-purple-600 rounded flex-shrink-0"></div>
            <span class="text-gray-600 break-words">{getPeriodLabel(2)}</span>
          </div>
        </div>
      </div>
    {:else if loading}
      <div class="bg-white rounded-lg p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading comparison data...</p>
      </div>
    {:else}
      <div class="bg-white rounded-lg p-8 text-center">
        <p class="text-gray-600">Select date ranges to load comparison data</p>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.lucide) {
    display: inline-block;
  }
</style>

