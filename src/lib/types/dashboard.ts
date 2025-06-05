// types/dashboard.ts




export interface DashboardData {
  longTermRevenue: number;
  shortTermRevenue: number;
  totalRevenue: number;
  longTermOccupancyRate: number;
  shortTermOccupancyRate: number;
  averageOccupancyRate: number;
  averageLeaseTenancy: number;
  timeToLease: number;
  tenantTurnover: number;
  shortTermAverageDailyRate: number;
  revenuePerAvailableRoom: number;
  leaseBalanceOverdue: number
}
