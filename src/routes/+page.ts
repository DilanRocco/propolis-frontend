// This function loads data for the dashboard page
import type { DashboardData } from "../lib/types/dashboard"
import { getDoorloopOccupancyRate, getDoorloopAverageLeaseTenancy } from "../lib/api/doorloop"
import { 
  getDoorloopProfitLoss, 
  getGuestyRevenue, 
  getShortTermOccupancyRate,
  extractLongTermRevenue,
  extractShortTermRevenue
} from "../lib/api/revenue"

export async function load() {
  try {
    // Get current month dates for default range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    
    // Fetch all data in parallel, but handle individual failures gracefully
    const [
      doorloopOccupancy,
      doorloopProfitLoss,
      doorloopLeaseTenancy,
      // guestyRevenue,
      // shortTermOccupancy
    ] = await Promise.allSettled([
      getDoorloopOccupancyRate(startDate, endDate),
      getDoorloopProfitLoss('cash', startDate, endDate),
      getDoorloopAverageLeaseTenancy(startDate, endDate),
      // getGuestyRevenue(startDate, endDate),
      // getShortTermOccupancyRate(startDate, endDate)
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
    
    // Extract revenue values with fallbacks
    const longTermRevenue = doorloopProfitLossData ? extractLongTermRevenue(doorloopProfitLossData) : 0;
    // const shortTermRevenue = guestyRevenueData ? extractShortTermRevenue(guestyRevenueData) : 0;
    const shortTermRevenue = 0; // Commented out Guesty API
    const totalRevenue = longTermRevenue + shortTermRevenue;
    
    // Calculate average occupancy rate with fallbacks
    const doorloopRate = doorloopOccupancyData?.occupancy_rate || 0;
    // const shortTermRate = shortTermOccupancyData?.occupancy_rate || 0;
    const shortTermRate = 0; // Commented out Guesty API
    const averageOccupancyRate = doorloopRate; // Only use Doorloop data
    
    // Extract lease tenancy data with fallback
    const averageLeaseTenancy = doorloopLeaseTenancyData?.average_lease_duration || 100;
    
    console.log('🔍 Server-side Lease Tenancy Debug:', {
      rawData: doorloopLeaseTenancyData,
      averageLeaseDuration: doorloopLeaseTenancyData?.average_lease_duration,
      finalValue: averageLeaseTenancy,
      fallbackUsed: !doorloopLeaseTenancyData?.average_lease_duration
    });
    
    const dashboardData: DashboardData = {
      longTermRevenue: longTermRevenue,
      shortTermRevenue: shortTermRevenue,
      totalRevenue: totalRevenue,
      longTermOccupancyRate: doorloopRate,
      shortTermOccupancyRate: shortTermRate,
      averageOccupancyRate: averageOccupancyRate,
      averageLeaseTenancy: averageLeaseTenancy,
      timeToLease: 44, // TODO: Add API endpoint for this
      tenantTurnover: 36, // TODO: Add API endpoint for this
      shortTermAverageDailyRate: 100, // TODO: Calculate from Guesty data
      revenuePerAvailableRoom: 100, // TODO: Calculate from revenue and units
      leaseBalanceOverdue: 100 // TODO: Add API endpoint for this
    }

    return {
      dashboardData
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    
    // Fallback to static data if API fails
  const dashboardData: DashboardData = {
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
  }

  return {
    dashboardData
  };
  }
}