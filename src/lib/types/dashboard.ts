// types/dashboard.ts


export interface Revenue {
  totalLongTerm: number;
  totalShortTerm: number;
  totalRevenue: number;
  timeframe: string;
}


export interface MoneyMetric {
  value: number
}




export interface Reservation {
  guestName: string;
  checkIn: string;
  checkout: string;
  listing: string;
  source: string;
  paid: boolean;
  autohostStatus: string;
  salto: boolean;
}

export interface ReservationManager {
  reservations: Reservation[];
}

export interface TimeTracker {
  days: number;
}

export interface TenantTurnover {
  percentage: number;
}

export interface Stocks {
  stocksValue: number;
  growthPercentage: number;
  ratingQuestion: string;
  selectedRating?: string;
}

export interface OccupancyTerm {
  averageOccupancyTerm: number
  averageLongTermRate: number
  averageShortTermRate: number
}

export interface Days {
  days: number
}

export interface DashboardData {
  revenue: Revenue;
  timeTracker: Days;
  tentantTurnover: TenantTurnover;
  occupancyRate: OccupancyTerm
  timeToLease: Days
  moneyMetric: MoneyMetric
}
