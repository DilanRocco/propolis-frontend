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
import { globalPropertyFilter } from './globalPropertyFilter';
import { propertyStore } from './propertyStore';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface UnitFilteringData {
  data: any[];
  count: number;
  filters_applied: {
    property: string;
    unit: string;
    type?: 'long-term' | 'short-term';
  };
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  unitFilteringData: UnitFilteringData | null;
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
  dateRange: getCurrentMonthRange(),
  unitFilteringData: null
};

// Create the stores
export const dashboardData = writable<DashboardData | null>(null);
export const dashboardLoading = writable<boolean>(false);
export const dashboardError = writable<string | null>(null);
export const dashboardDateRange = writable<DateRange>(getCurrentMonthRange());
export const unitFilteringData = writable<UnitFilteringData | null>(null);

// Simple action functions
export async function fetchDashboardData(dateRange?: DateRange) {
  const range = dateRange || get(dashboardDateRange);
  const propertyFilter = get(globalPropertyFilter);
  const selectedPropertyId = propertyFilter.selectedProperty?.id;
  
  // Get the corresponding Guesty ID if a Doorloop property is selected
  let guestyPropertyId: string | undefined = undefined;
  if (selectedPropertyId) {
    const mappedGuestyId = propertyStore.getGuestyIdForDoorloopId(selectedPropertyId);
    guestyPropertyId = mappedGuestyId || undefined;
    console.log('Property mapping:', {
      doorloopId: selectedPropertyId,
      guestyId: guestyPropertyId,
      propertyName: propertyFilter.selectedProperty?.name
    });
    
    if (!guestyPropertyId) {
      console.warn('⚠️ NO GUESTY PROPERTY ID FOUND! This means short-term revenue will be unfiltered.');
    }
  } else {
    console.log('No property selected - showing unfiltered data');
  }
  
  dashboardLoading.set(true);
  dashboardError.set(null);

  try {
    console.log('Fetching dashboard data for range:', range);
    console.log('Selected property ID (Doorloop):', selectedPropertyId);
    console.log('Selected property ID (Guesty):', guestyPropertyId);
    console.log('Selected property details:', propertyFilter.selectedProperty);
    
    // Fetch all data in parallel
    const [
      doorloopOccupancy,
      doorloopProfitLoss,
      guestyRevenue,
      shortTermOccupancy
    ] = await Promise.all([
      getDoorloopOccupancyRate(range.startDate, range.endDate, selectedPropertyId),
      getDoorloopProfitLoss('cash', range.startDate, range.endDate, selectedPropertyId),
      getGuestyRevenue(range.startDate, range.endDate, guestyPropertyId),
      getShortTermOccupancyRate(range.startDate, range.endDate, guestyPropertyId)
    ]);
    
    console.log('API responses received:', {
      doorloopOccupancy,
      doorloopProfitLoss: !!doorloopProfitLoss,
      guestyRevenue: !!guestyRevenue,
      shortTermOccupancy
    });
    
    // Extract revenue values
    const longTermRevenue = extractLongTermRevenue(doorloopProfitLoss);
    let shortTermRevenue = extractShortTermRevenue(guestyRevenue);
    
    // If a property is selected, set short-term revenue to 0 since we can't filter it properly
    if (selectedPropertyId) {
      shortTermRevenue = 0;
    }
    
    const totalRevenue = longTermRevenue + shortTermRevenue;
    
    console.log('Revenue extraction details:', {
      longTermRevenue,
      shortTermRevenue,
      totalRevenue,
      guestyRevenueRaw: guestyRevenue,
      guestyRevenueSummary: guestyRevenue?.summary
    });
    
    // Calculate average occupancy rate
    const averageOccupancyRate = (doorloopOccupancy.occupancy_rate + shortTermOccupancy.occupancy_rate) / 2;
    
    const newDashboardData: DashboardData = {
      longTermRevenue: longTermRevenue,
      shortTermRevenue: shortTermRevenue,
      totalRevenue: totalRevenue,
      longTermOccupancyRate: doorloopOccupancy.occupancy_rate,
      shortTermOccupancyRate: shortTermOccupancy.occupancy_rate,
      averageOccupancyRate: averageOccupancyRate,
      averageLeaseTenancy: 360, // TODO: Add API endpoint for this
      timeToLease: 44, // TODO: Add API endpoint for this
      tenantTurnover: 36, // TODO: Add API endpoint for this
      shortTermAverageDailyRate: 84.30, // TODO: Calculate from Guesty data
      revenuePerAvailableRoom: 82.54, // TODO: Calculate from revenue and units
      leaseBalanceOverdue: 45986.24// TODO: Add API endpoint for this
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

export function refetchDashboardData() {
  fetchDashboardData();
}

// Function to update unit filtering data
export function updateUnitFilteringData(data: UnitFilteringData) {
  unitFilteringData.set(data);
}

// Function to clear unit filtering data
export function clearUnitFilteringData() {
  unitFilteringData.set(null);
} 