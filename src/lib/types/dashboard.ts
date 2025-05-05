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
    color: string;
    size: number;
    position: {
      top: number;
      right: number;
    };
  }
  
  export interface AnnualProfits {
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
    hours: number;
    minutes: number;
    totalDots: number;
    activeDots: number;
    prevYear: string;
    currentYear: string;
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

  export interface OccupanyRate {
    averageOccupanyRate: number
    averageLongTermRate: number
    averageShortTermRate: number
  }
  
  export interface DashboardData {
    creditCard: CreditCard;
    revenue: Revenue;
    annualProfits: AnnualProfits;
    reservationManager: ReservationManager;
    timeTracker: TimeTracker;
    tentantTurnover: TenantTurnover;
    stocks: Stocks;
    occupancyRate: OccupanyRate
  }
  