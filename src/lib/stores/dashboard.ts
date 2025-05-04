import { writable, derived } from 'svelte/store';
import type { DashboardData } from '../types/dashboard';

// Initial dashboard data
const initialDashboardData: DashboardData = {
  creditCard: {
    cardNumber: "**** 2719",
    monthlyFee: 25.00,
    cardType: "visa"
  },
  revenue: {
    totalLongTerm: 24314.53,
    totalShortTerm: 22312.23,
    totalIncome: 46626.76,
    timeframe: "Weekly"
  },
  annualProfits: {
    year: "2023",
    profits: [
      { value: "4K", color: "coral-500", size: 24, position: { top: 36, right: 28 } },
      { value: "6.8K", color: "coral-300", size: 36, position: { top: 28, right: 28 } },
      { value: "9.3K", color: "coral-200", size: 48, position: { top: 20, right: 28 } },
      { value: "14K", color: "coral-100", size: 64, position: { top: 10, right: 24 } },
    ]
  },
  activityManager: {
    businessPlanAmount: 43.20,
    selectedTags: ["Team", "Insights", "Today"],
    activityItems: [
      { id: 1, name: "Bank loans", isOpen: true },
      { id: 2, name: "Accounting", isOpen: false },
      { id: 3, name: "HR management", isOpen: false },
    ]
  },
  timeTracker: {
    days: 13,
    hours: 109,
    minutes: 23,
    totalDots: 20,
    activeDots: 10,
    prevYear: "2022",
    currentYear: "2023"
  },
  growthRate: {
    percentage: 36
  },
  stocks: {
    stocksValue: 16073.49,
    growthPercentage: 9.3,
    ratingQuestion: "How is your business management going?"
  }
};

// Create the writable store
export const dashboardStore = writable(initialDashboardData);

// Create derived stores for specific sections
export const creditCardStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.creditCard
);

export const incomeStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.revenue
);

export const profitsStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.annualProfits
);

export const activityStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.activityManager
);

export const timeStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.timeTracker
);

export const growthStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.growthRate
);

export const stocksStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.stocks
);

// Actions to update the dashboard data
export const dashboardActions = {
  updateCreditCard: (updatedData: Partial<DashboardData["creditCard"]>) => {
    dashboardStore.update(data => ({
      ...data,
      creditCard: { ...data.creditCard, ...updatedData }
    }));
  },

  updateIncome: (updatedData: Partial<DashboardData["revenue"]>) => {
    dashboardStore.update(data => ({
      ...data,
      income: { ...data.revenue, ...updatedData }
    }));
  },

  updateActivityTags: (tags: string[]) => {
    dashboardStore.update(data => ({
      ...data,
      activityManager: {
        ...data.activityManager,
        selectedTags: tags
      }
    }));
  },

  toggleActivityItem: (id: number) => {
    dashboardStore.update(data => {
      const updatedItems = data.activityManager.activityItems.map(item =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      );

      return {
        ...data,
        activityManager: {
          ...data.activityManager,
          activityItems: updatedItems
        }
      };
    });
  },

  updateStockRating: (rating: string) => {
    dashboardStore.update(data => ({
      ...data,
      stocks: { ...data.stocks, selectedRating: rating }
    }));
  }
};
