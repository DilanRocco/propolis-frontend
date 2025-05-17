// types/dashboard.ts

export interface CreditCard {
  cardNumber: string;
  monthlyFee: number;
  cardType: string;
}

export interface Revenue {
  totalLongTerm: number;
  totalShortTerm: number;
  totalIncome: number;
  timeframe: string;
}



export interface ProfitItem {
  value: string;
  label: string;
}

export interface YearProfit {
  year: string;
  profits: ProfitItem[];
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
  creditCard: CreditCard;
  revenue: Revenue;
  annualProfits: YearProfit[];
  reservationManager: ReservationManager;
  timeTracker: Days;
  tentantTurnover: TenantTurnover;
  stocks: Stocks;
  occupancyRate: OccupancyTerm
  timeToLease: Days
}
