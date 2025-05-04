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
  
  export interface ActivityItem {
    id: number;
    name: string;
    isOpen: boolean;
  }
  
  export interface ActivityManager {
    businessPlanAmount: number;
    selectedTags: string[];
    activityItems: ActivityItem[];
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
  
  export interface GrowthRate {
    percentage: number;
  }
  
  export interface Stocks {
    stocksValue: number;
    growthPercentage: number;
    ratingQuestion: string;
    selectedRating?: string; 
  }
  
  export interface DashboardData {
    creditCard: CreditCard;
    revenue: Revenue;
    annualProfits: AnnualProfits;
    activityManager: ActivityManager;
    timeTracker: TimeTracker;
    growthRate: GrowthRate;
    stocks: Stocks;
  }
  