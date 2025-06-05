import { writable, derived } from 'svelte/store';
import type { DashboardData } from '../types/dashboard';



// Create the writable store
export const dashboardStore = writable<DashboardData>();

// Create derived stores for specific sections




// Actions to update the dashboard data


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
