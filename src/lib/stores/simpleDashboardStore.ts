import { writable, get } from 'svelte/store';
import type { DashboardData } from '../types/dashboard';
import { getDoorloopOccupancyRate, getDoorloopAverageLeaseTenancy } from '../api/doorloop';
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
    
    // Fetch all data in parallel, but handle individual failures gracefully
    const [
      doorloopOccupancy,
      doorloopProfitLoss,
      doorloopLeaseTenancy,
      // guestyRevenue,
      // shortTermOccupancy
    ] = await Promise.allSettled([
      getDoorloopOccupancyRate(range.startDate, range.endDate, selectedPropertyId),
      getDoorloopProfitLoss('cash', range.startDate, range.endDate, selectedPropertyId),
      getDoorloopAverageLeaseTenancy(range.startDate, range.endDate, selectedPropertyId),
      // getGuestyRevenue(range.startDate, range.endDate, guestyPropertyId),
      // getShortTermOccupancyRate(range.startDate, range.endDate, guestyPropertyId)
    ]);
    
    // Extract data from Promise.allSettled results, with fallbacks for failed requests
    const doorloopOccupancyData = doorloopOccupancy.status === 'fulfilled' ? doorloopOccupancy.value : null;
    const doorloopProfitLossData = doorloopProfitLoss.status === 'fulfilled' ? doorloopProfitLoss.value : null;
    const doorloopLeaseTenancyData = doorloopLeaseTenancy.status === 'fulfilled' ? doorloopLeaseTenancy.value : null;
    // const guestyRevenueData = guestyRevenue.status === 'fulfilled' ? guestyRevenue.value : null;
    // const shortTermOccupancyData = shortTermOccupancy.status === 'fulfilled' ? shortTermOccupancy.value : null;
    
    // Log any failed requests
    if (doorloopOccupancy.status === 'rejected') console.error('Doorloop occupancy failed:', doorloopOccupancy.reason);
    if (doorloopProfitLoss.status === 'rejected') console.error('Doorloop profit/loss failed:', doorloopProfitLoss.reason);
    if (doorloopLeaseTenancy.status === 'rejected') console.error('Doorloop lease tenancy failed:', doorloopLeaseTenancy.reason);
    // if (guestyRevenue.status === 'rejected') console.error('Guesty revenue failed:', guestyRevenue.reason);
    // if (shortTermOccupancy.status === 'rejected') console.error('Short-term occupancy failed:', shortTermOccupancy.reason);
    
    console.log('API responses received:', {
      doorloopOccupancy: doorloopOccupancyData,
      doorloopProfitLoss: !!doorloopProfitLossData,
      doorloopLeaseTenancy: doorloopLeaseTenancyData,
      // guestyRevenue: !!guestyRevenueData,
      // shortTermOccupancy: shortTermOccupancyData
    });
    
    // Extract revenue values with fallbacks
    const longTermRevenue = doorloopProfitLossData ? extractLongTermRevenue(doorloopProfitLossData) : 0;
    // let shortTermRevenue = guestyRevenueData ? extractShortTermRevenue(guestyRevenueData) : 0;
    let shortTermRevenue = 0; // Commented out Guesty API
    
    // If a property is selected, set short-term revenue to 0 since we can't filter it properly
    if (selectedPropertyId) {
      shortTermRevenue = 0;
    }
    
    const totalRevenue = longTermRevenue + shortTermRevenue;
    
    console.log('Revenue extraction details:', {
      longTermRevenue,
      shortTermRevenue,
      totalRevenue,
      // guestyRevenueRaw: guestyRevenueData,
      // guestyRevenueSummary: guestyRevenueData?.summary
    });
    
    // Calculate average occupancy rate with fallbacks
    const doorloopRate = doorloopOccupancyData?.occupancy_rate || 0;
    // const shortTermRate = shortTermOccupancyData?.occupancy_rate || 0;
    const shortTermRate = 0; // Commented out Guesty API
    const averageOccupancyRate = doorloopRate; // Only use Doorloop data
    
    // Extract lease tenancy data with fallback
    const averageLeaseTenancy = doorloopLeaseTenancyData?.average_lease_duration || 360;
    
    console.log('🔍 Lease Tenancy Debug:', {
      rawData: doorloopLeaseTenancyData,
      averageLeaseDuration: doorloopLeaseTenancyData?.average_lease_duration,
      finalValue: averageLeaseTenancy,
      fallbackUsed: !doorloopLeaseTenancyData?.average_lease_duration
    });
    
    const newDashboardData: DashboardData = {
      longTermRevenue: longTermRevenue,
      shortTermRevenue: shortTermRevenue,
      totalRevenue: totalRevenue,
      longTermOccupancyRate: doorloopRate,
      shortTermOccupancyRate: shortTermRate,
      averageOccupancyRate: averageOccupancyRate,
      averageLeaseTenancy: averageLeaseTenancy,
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