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
  reservationManager: {
    reservations: [
      {
        "guestName": "Alice Johnson",
        "checkIn": "2025-05-10T15:00:00Z",
        "checkout": "2025-05-14T11:00:00Z",
        "listing": "Beachside Bungalow",
        "source": "Airbnb",
        "paid": true,
        "autohostStatus": "approved",
        "salto": true
      },
      {
        "guestName": "Brian Smith",
        "checkIn": "2025-06-01T15:00:00Z",
        "checkout": "2025-06-05T11:00:00Z",
        "listing": "Downtown Loft",
        "source": "Direct",
        "paid": false,
        "autohostStatus": "pending",
        "salto": false
      },
      {
        "guestName": "Carla Mendes",
        "checkIn": "2025-07-15T15:00:00Z",
        "checkout": "2025-07-20T11:00:00Z",
        "listing": "Lakeside Retreat",
        "source": "Booking.com",
        "paid": true,
        "autohostStatus": "flagged",
        "salto": true
      },
      {
        "guestName": "David Lee",
        "checkIn": "2025-08-10T15:00:00Z",
        "checkout": "2025-08-13T11:00:00Z",
        "listing": "Mountain Cabin",
        "source": "VRBO",
        "paid": true,
        "autohostStatus": "approved",
        "salto": false
      }
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
  tentantTurnover: {
    percentage: 36
  },
  stocks: {
    stocksValue: 16073.49,
    growthPercentage: 9.3,
    ratingQuestion: "How is your business management going?"
  },
  occupancyRate: {
    averageOccupancyTerm: 50.5,
    averageLongTermRate: 70.1,
    averageShortTermRate: 62.5
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
  $dashboardStore => $dashboardStore.reservationManager
);

export const timeStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.timeTracker
);

export const growthStore = derived(
  dashboardStore,
  $dashboardStore => $dashboardStore.tentantTurnover
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
      ReservationManager: {
        ...data.reservationManager,
        selectedTags: tags
      }
    }));
  },

  // toggleActivityItem: (id: number) => {
  //   dashboardStore.update(data => {
  //     const updatedItems = data.ReservationManager.activityItems.map(item =>
  //       item.id === id ? { ...item, isOpen: !item.isOpen } : item
  //     );

  //     return {
  //       ...data,
  //       ReservationManager: {
  //         ...data.ReservationManager,
  //         activityItems: updatedItems
  //       }
  //     };
  //   });
  // },

  updateStockRating: (rating: string) => {
    dashboardStore.update(data => ({
      ...data,
      stocks: { ...data.stocks, selectedRating: rating }
    }));
  }
};
