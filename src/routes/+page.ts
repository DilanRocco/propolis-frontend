// This function loads data for the dashboard page
import type { DashboardData } from "../lib/types/dashboard"
import { getDoorloopOccupancyRate } from "../lib/api/doorloop"
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
    
    // Fetch all data in parallel for better performance
    const [
      doorloopOccupancy,
      doorloopProfitLoss,
      guestyRevenue,
      shortTermOccupancy
    ] = await Promise.all([
      getDoorloopOccupancyRate(startDate, endDate),
      getDoorloopProfitLoss('cash', startDate, endDate),
      getGuestyRevenue(startDate, endDate),
      getShortTermOccupancyRate(startDate, endDate)
    ]);
    
    // Extract revenue values
    const longTermRevenue = extractLongTermRevenue(doorloopProfitLoss);
    const shortTermRevenue = extractShortTermRevenue(guestyRevenue);
    const totalRevenue = longTermRevenue + shortTermRevenue;
    
    // Calculate average occupancy rate
    const averageOccupancyRate = (doorloopOccupancy.occupancy_rate + shortTermOccupancy.occupancy_rate) / 2;
    
    const dashboardData: DashboardData = {
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