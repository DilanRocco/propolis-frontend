import { writable, derived } from 'svelte/store';
import type { DashboardData } from '../types/dashboard';



// Create the writable store
export const dashboardStore = writable<DashboardData>();

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
