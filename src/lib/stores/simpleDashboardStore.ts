import { writable, get } from 'svelte/store';
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

// Create the stores
export const dashboardData = writable<DashboardData | null>(null);
export const dashboardLoading = writable<boolean>(false);
export const dashboardError = writable<string | null>(null);
export const dashboardDateRange = writable<DateRange>(getCurrentMonthRange());

// Simple action functions
export async function fetchDashboardData(dateRange?: DateRange) {
  const range = dateRange || get(dashboardDateRange);
  
  dashboardLoading.set(true);
  dashboardError.set(null);

  try {
    console.log('Fetching dashboard data for range:', range);
    
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
    
    console.log('API responses received:', {
      doorloopOccupancy,
      doorloopProfitLoss: !!doorloopProfitLoss,
      guestyRevenue: !!guestyRevenue,
      shortTermOccupancy
    });
    
    // Extract revenue values
    const longTermRevenue = extractLongTermRevenue(doorloopProfitLoss);
    const shortTermRevenue = extractShortTermRevenue(guestyRevenue);
    const totalRevenue = longTermRevenue + shortTermRevenue;
    
    // Calculate average occupancy rate
    const averageOccupancyRate = (doorloopOccupancy.occupancy_rate + shortTermOccupancy.occupancy_rate) / 2;
    
    const newDashboardData: DashboardData = {
      longTermRevenue: longTermRevenue,
      shortTermRevenue: shortTermRevenue,
      totalRevenue: totalRevenue,
      longTermOccupancyRate: doorloopOccupancy.occupancy_rate,
      shortTermOccupancyRate: shortTermOccupancy.occupancy_rate,
      averageOccupancyRate: averageOccupancyRate,
      averageLeaseTenancy: 100, // TODO: Add API endpoint for this
      timeToLease: 44, // TODO: Add API endpoint for this
      tenantTurnover: 36, // TODO: Add API endpoint for this
      shortTermAverageDailyRate: 100, // TODO: Calculate from Guesty data
      revenuePerAvailableRoom: 100, // TODO: Calculate from revenue and units
      leaseBalanceOverdue: 100 // TODO: Add API endpoint for this
    };

    console.log('Setting dashboard data:', newDashboardData);
    dashboardData.set(newDashboardData);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    dashboardError.set(error instanceof Error ? error.message : 'Failed to load dashboard data');
    
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
    
    dashboardData.set(fallbackData);
  } finally {
    dashboardLoading.set(false);
  }
}

export function updateDateRange(newDateRange: DateRange) {
  dashboardDateRange.set(newDateRange);
  fetchDashboardData(newDateRange);
} 