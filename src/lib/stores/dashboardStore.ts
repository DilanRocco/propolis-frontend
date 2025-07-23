import { writable } from 'svelte/store';
import type { DashboardData } from '../types/dashboard';
import { getDoorloopOccupancyRate } from '../api/doorloop';
import { 
  getDoorloopProfitLoss, 
  getGuestyRevenue, 
  getShortTermOccupancyRate,
  extractLongTermRevenue,
  extractShortTermRevenue
} from '../api/revenue';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
}

// Get current month as default date range
function getCurrentMonthRange(): DateRange {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: startOfMonth.toISOString().split('T')[0],
    endDate: endOfMonth.toISOString().split('T')[0]
  };
}

// Initial state
const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  dateRange: getCurrentMonthRange()
};

// Create the writable store
export const dashboardStore = writable<DashboardState>(initialState);

// Helper functions for the store
const setLoading = (loading: boolean) => {
  dashboardStore.update(state => ({ ...state, loading }));
};

const setError = (error: string | null) => {
  dashboardStore.update(state => ({ ...state, error }));
};

const setData = (data: DashboardData) => {
  dashboardStore.update(state => ({ ...state, data }));
};

// Main fetch function
const fetchData = async (dateRange?: DateRange) => {
    // Use provided date range or get current range from store synchronously
    let range: DateRange;
    if (dateRange) {
      range = dateRange;
    } else {
      // Get current state synchronously
      let currentState: DashboardState;
      const unsubscribe = dashboardStore.subscribe(state => {
        currentState = state;
      });
      unsubscribe();
      range = currentState!.dateRange;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        doorloopOccupancy,
        doorloopProfitLoss,
        guestyRevenue,
        shortTermOccupancy
      ] = await Promise.all([
        getDoorloopOccupancyRate(range.startDate, range.endDate),
        getDoorloopProfitLoss('cash', range.startDate, range.endDate),
        getGuestyRevenue(range.startDate, range.endDate),
        getShortTermOccupancyRate(range.startDate, range.endDate)
      ]);
      
      // Extract revenue values
      const longTermRevenue = extractLongTermRevenue(doorloopProfitLoss);
      const shortTermRevenue = extractShortTermRevenue(guestyRevenue);
      const totalRevenue = longTermRevenue + shortTermRevenue;
      
      // Calculate average occupancy rate
      const averageOccupancyRate = (doorloopOccupancy.occupancy_rate + shortTermOccupancy.occupancy_rate) / 2;
      
      const dashboardData: DashboardData = {
        longTermRevenue: Number(longTermRevenue.toFixed(2)),
        shortTermRevenue: Number(shortTermRevenue.toFixed(2)),
        totalRevenue: Number(totalRevenue.toFixed(2)),
        longTermOccupancyRate: Number(doorloopOccupancy.occupancy_rate.toFixed(1)),
        shortTermOccupancyRate: Number(shortTermOccupancy.occupancy_rate.toFixed(1)),
        averageOccupancyRate: Number(averageOccupancyRate.toFixed(1)),
        averageLeaseTenancy: 100, // TODO: Add API endpoint for this
        timeToLease: 44, // TODO: Add API endpoint for this
        tenantTurnover: 36, // TODO: Add API endpoint for this
        shortTermAverageDailyRate: 100, // TODO: Calculate from Guesty data
        revenuePerAvailableRoom: 100, // TODO: Calculate from revenue and units
        leaseBalanceOverdue: 100 // TODO: Add API endpoint for this
      };

      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      
      // Fallback to static data
      const fallbackData: DashboardData = {
        longTermRevenue: 24314.53,
        shortTermRevenue: 22312.23,
        totalRevenue: 46626.76,
        longTermOccupancyRate: 71.59,
        shortTermOccupancyRate: 31.41,
        averageOccupancyRate: 51.23,
        averageLeaseTenancy: 100,
        timeToLease: 44,
        tenantTurnover: 36,
        shortTermAverageDailyRate: 100,
        revenuePerAvailableRoom: 100,
        leaseBalanceOverdue: 100
      };
      
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

// Actions to update the store
export const dashboardActions = {
  setLoading,
  setError,
  setData,
  fetchData,
  
  setDateRange: (dateRange: DateRange) => {
    dashboardStore.update(state => ({ ...state, dateRange }));
  },
  
  setDateRangeAndFetch: (dateRange: DateRange) => {
    dashboardStore.update(state => ({ ...state, dateRange }));
    // Fetch new data with the updated date range
    fetchData(dateRange);
  }
}; 