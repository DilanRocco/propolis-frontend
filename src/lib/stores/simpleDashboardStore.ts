import { writable, get } from 'svelte/store';
import type { DashboardData } from '../types/dashboard';
import { getDoorloopOccupancyRate, getDoorloopAverageLeaseTenancy, getDoorloopTenantTurnoverRate, getDoorloopBalanceDue, getDoorloopTimeToLease } from '../api/doorloop';
import { 
  getDoorloopProfitLoss, 
  getGuestyRevenue, 
  getShortTermOccupancyRate,
  getJurnyShortTermKPIs,
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

// Map property names from dropdown to the format expected by Jurny API
function mapPropertyNameForJurny(propertyName: string | undefined): string | undefined {
  if (!propertyName) return undefined;
  
  // Map exact property names from dropdown to Jurny API format
  // The keys should match exactly what appears in the dropdown (case-sensitive)
  const propertyNameMap: Record<string, string> = {
    // Add exact property names from dropdown as keys
    'Aerie Apartments': 'Aerie Apartments',
    'Plum Apartments': 'Plum Apartments',
    'Saffron': 'Saffron Apartments',
    'Olive Apartments': 'Olive Apartments',
    'Pastel Apartments': 'Pastel Apartments'
  };
  
  // First try exact match (case-sensitive)
  if (propertyNameMap[propertyName]) {
    console.log('🔍 Property name mapped:', propertyName, '→', propertyNameMap[propertyName]);
    return propertyNameMap[propertyName];
  }
  
  // Fallback to case-insensitive match
  const normalizedName = propertyName.toLowerCase().trim();
  const normalizedMap: Record<string, string> = {
    'aerie apartments': 'Aerie Apartments',
    'plum apartments': 'Plum Apartments',
    'saffron': 'Saffron Apartments',
    'olive apartments': 'Olive Apartments',
    'pastel apartments': 'Pastel Apartments'
  };
  
  if (normalizedMap[normalizedName]) {
    console.log('🔍 Property name mapped (normalized):', propertyName, '→', normalizedMap[normalizedName]);
    return normalizedMap[normalizedName];
  }
  
  console.log('🔍 Property name not mapped, using original:', propertyName);
  return propertyName;
}

// Simple action functions
export async function fetchDashboardData(dateRange?: DateRange) {
  const range = dateRange || get(dashboardDateRange);
  const propertyFilter = get(globalPropertyFilter);
  const selectedPropertyId = propertyFilter.selectedProperty?.id;
  const selectedPropertyName = propertyFilter.selectedProperty?.name;
  const mappedPropertyName = mapPropertyNameForJurny(selectedPropertyName);
  
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
      doorloopTenantTurnover,
      doorloopBalanceDue,
      doorloopTimeToLease,
      jurnyShortTermKPIs,
      // guestyRevenue,
      // shortTermOccupancy
    ] = await Promise.allSettled([
      getDoorloopOccupancyRate(range.startDate, range.endDate, selectedPropertyId),
      getDoorloopProfitLoss('cash', range.startDate, range.endDate, selectedPropertyId),
      getDoorloopAverageLeaseTenancy(range.startDate, range.endDate, selectedPropertyId),
      getDoorloopTenantTurnoverRate(range.startDate, range.endDate, selectedPropertyId),
      getDoorloopBalanceDue(range.startDate, range.endDate, selectedPropertyId),
      getDoorloopTimeToLease(range.startDate, range.endDate, selectedPropertyId),
      getJurnyShortTermKPIs(range.startDate, range.endDate, mappedPropertyName),
      // getGuestyRevenue(range.startDate, range.endDate, guestyPropertyId),
      // getShortTermOccupancyRate(range.startDate, range.endDate, guestyPropertyId)
    ]);
    
    // Extract data from Promise.allSettled results, with fallbacks for failed requests
    const doorloopOccupancyData = doorloopOccupancy.status === 'fulfilled' ? doorloopOccupancy.value : null;
    const doorloopProfitLossData = doorloopProfitLoss.status === 'fulfilled' ? doorloopProfitLoss.value : null;
    const doorloopLeaseTenancyData = doorloopLeaseTenancy.status === 'fulfilled' ? doorloopLeaseTenancy.value : null;
    const doorloopTenantTurnoverData = doorloopTenantTurnover.status === 'fulfilled' ? doorloopTenantTurnover.value : null;
    const doorloopBalanceDueData = doorloopBalanceDue.status === 'fulfilled' ? doorloopBalanceDue.value : null;
    const doorloopTimeToLeaseData = doorloopTimeToLease.status === 'fulfilled' ? doorloopTimeToLease.value : null;
    const jurnyShortTermKPIsData = jurnyShortTermKPIs.status === 'fulfilled' ? jurnyShortTermKPIs.value : null;
    // const guestyRevenueData = guestyRevenue.status === 'fulfilled' ? guestyRevenue.value : null;
    // const shortTermOccupancyData = shortTermOccupancy.status === 'fulfilled' ? shortTermOccupancy.value : null;
    
    // Log any failed requests
    if (doorloopOccupancy.status === 'rejected') console.error('Doorloop occupancy failed:', doorloopOccupancy.reason);
    if (doorloopProfitLoss.status === 'rejected') console.error('Doorloop profit/loss failed:', doorloopProfitLoss.reason);
    if (doorloopLeaseTenancy.status === 'rejected') console.error('Doorloop lease tenancy failed:', doorloopLeaseTenancy.reason);
    if (doorloopTenantTurnover.status === 'rejected') console.error('Doorloop tenant turnover failed:', doorloopTenantTurnover.reason);
    if (doorloopBalanceDue.status === 'rejected') console.error('Doorloop balance due failed:', doorloopBalanceDue.reason);
    if (doorloopTimeToLease.status === 'rejected') console.error('Doorloop time to lease failed:', doorloopTimeToLease.reason);
    if (jurnyShortTermKPIs.status === 'rejected') {
      console.error('❌ Jurny short-term KPIs failed:', jurnyShortTermKPIs.reason);
      console.error('❌ Jurny error details:', {
        reason: jurnyShortTermKPIs.reason,
        message: jurnyShortTermKPIs.reason?.message,
        stack: jurnyShortTermKPIs.reason?.stack
      });
    } else {
      console.log('✅ Jurny short-term KPIs succeeded:', jurnyShortTermKPIs.value);
    }
    // if (guestyRevenue.status === 'rejected') console.error('Guesty revenue failed:', guestyRevenue.reason);
    // if (shortTermOccupancy.status === 'rejected') console.error('Short-term occupancy failed:', shortTermOccupancy.reason);
    
    console.log('API responses received:', {
      doorloopOccupancy: doorloopOccupancyData,
      doorloopProfitLoss: !!doorloopProfitLossData,
      doorloopLeaseTenancy: doorloopLeaseTenancyData,
      doorloopTenantTurnover: doorloopTenantTurnoverData,
      doorloopBalanceDue: !!doorloopBalanceDueData,
      doorloopTimeToLease: doorloopTimeToLeaseData,
      jurnyShortTermKPIs: jurnyShortTermKPIsData,
      // guestyRevenue: !!guestyRevenueData,
      // shortTermOccupancy: shortTermOccupancyData
    });
    
    // Extract revenue values with fallbacks
    const longTermRevenue = doorloopProfitLossData ? extractLongTermRevenue(doorloopProfitLossData) : 0;
    // Extract short-term revenue from Jurny KPIs (revenue is a string, parse to number)
    const shortTermRevenue = jurnyShortTermKPIsData?.revenue ? parseFloat(jurnyShortTermKPIsData.revenue) : 0;
    
    const totalRevenue = longTermRevenue + shortTermRevenue;
    
    console.log('Revenue extraction details:', {
      longTermRevenue,
      shortTermRevenue,
      totalRevenue,
      jurnyKPIs: jurnyShortTermKPIsData,
      // guestyRevenueRaw: guestyRevenueData,
      // guestyRevenueSummary: guestyRevenueData?.summary
    });
    
    // Calculate average occupancy rate with fallbacks
    const doorloopRate = doorloopOccupancyData?.occupancy_rate || 0;
    // Extract short-term occupancy from Jurny KPIs
    const shortTermRate = jurnyShortTermKPIsData?.occupancy || 0;
    const averageOccupancyRate = doorloopRate; // Only use Doorloop data for average (or calculate combined if needed)
    
    // Extract lease tenancy data with fallback
    const averageLeaseTenancy = doorloopLeaseTenancyData?.average_lease_duration || 0;
    
    // Extract tenant turnover data with fallback
    const tenantTurnoverRate = doorloopTenantTurnoverData?.['tenant turnover rate'] || 0;

    const leaseBalanceOverdue = doorloopBalanceDueData?.totalBalance || 0;
    
    console.log('🔍 Balance Due Debug:', {
      rawData: doorloopBalanceDueData,
      totalBalance: doorloopBalanceDueData?.totalBalance,
      finalValue: leaseBalanceOverdue,
      fallbackUsed: !doorloopBalanceDueData?.totalBalance
    });
    
    // Extract time to lease data with fallback
    const timeToLease = doorloopTimeToLeaseData?.time_to_lease_days || 0;
    
    // Extract short-term metrics from Jurny KPIs
    const shortTermAverageDailyRate = jurnyShortTermKPIsData?.adr ? parseFloat(jurnyShortTermKPIsData.adr) : 0;
    const revenuePerAvailableRoom = jurnyShortTermKPIsData?.revpar ? parseFloat(jurnyShortTermKPIsData.revpar) : 0;
    
    console.log('🔍 Lease Tenancy Debug:', {
      rawData: doorloopLeaseTenancyData,
      averageLeaseDuration: doorloopLeaseTenancyData?.average_lease_duration,
      finalValue: averageLeaseTenancy,
      fallbackUsed: !doorloopLeaseTenancyData?.average_lease_duration
    });
    
    console.log('🔍 Tenant Turnover Debug:', {
      rawData: doorloopTenantTurnoverData,
      tenantTurnoverRate: doorloopTenantTurnoverData?.['tenant turnover rate'],
      finalValue: tenantTurnoverRate,
      fallbackUsed: !doorloopTenantTurnoverData?.['tenant turnover rate']
    });
    
    console.log('🔍 Time to Lease Debug:', {
      rawData: doorloopTimeToLeaseData,
      timeToLeaseDays: doorloopTimeToLeaseData?.time_to_lease_days,
      finalValue: timeToLease,
      fallbackUsed: !doorloopTimeToLeaseData?.time_to_lease_days
    });
    
    console.log('🔍 Jurny Short-Term KPIs Debug:', {
      rawData: jurnyShortTermKPIsData,
      revenue: jurnyShortTermKPIsData?.revenue,
      occupancy: jurnyShortTermKPIsData?.occupancy,
      adr: jurnyShortTermKPIsData?.adr,
      revpar: jurnyShortTermKPIsData?.revpar,
      finalValues: {
        shortTermRevenue,
        shortTermRate,
        shortTermAverageDailyRate,
        revenuePerAvailableRoom
      }
    });
    
    const newDashboardData: DashboardData = {
      longTermRevenue: longTermRevenue,
      shortTermRevenue: shortTermRevenue,
      totalRevenue: totalRevenue,
      longTermOccupancyRate: doorloopRate,
      shortTermOccupancyRate: shortTermRate,
      averageOccupancyRate: averageOccupancyRate,
      averageLeaseTenancy: averageLeaseTenancy,
      timeToLease: timeToLease,
      tenantTurnover: tenantTurnoverRate,
      shortTermAverageDailyRate: shortTermAverageDailyRate,
      revenuePerAvailableRoom: revenuePerAvailableRoom,
      leaseBalanceOverdue: leaseBalanceOverdue
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
      timeToLease: 0,
      tenantTurnover: 0,
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