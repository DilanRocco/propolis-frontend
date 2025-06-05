// This function loads data for the dashboard page
import type { DashboardData } from "../lib/types/dashboard"
export function load() {
  // In a real app, you might fetch this from an API
  const dashboardData: DashboardData = {
    revenue: {
      totalLongTerm: 24314.53,
      totalShortTerm: 22312.23,
      totalRevenue: 46626.76,
      timeframe: "Weekly"
    },
    timeTracker: {
      days: 13
    },
    tentantTurnover: {
      percentage: 36
    },
    occupancyRate: {
      averageOccupancyTerm: 51.23,
      averageLongTermRate: 71.59,
      averageShortTermRate: 31.41
    },
    timeToLease: {
      days: 44
    },
    moneyMetric: {
      value: 16030.24
    }
  };

  return {
    dashboardData
  };
}