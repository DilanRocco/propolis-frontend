// This function loads data for the dashboard page
import type { DashboardData } from "../lib/types/dashboard"
export function load() {
  // In a real app, you might fetch this from an API
  const dashboardData: DashboardData = {
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
    annualProfits: [                     // ← now an array, not wrapped in {}
      {
        year: "2023",
        profits: [
          { value: "4K",   label: "Short Term" },
          { value: "6.8K", label: "Long Term" },
        ],
      },
    ],
    reservationManager: {
      reservations: [
        {
          guestName: 'Alice Johnson',
          checkIn: '2025-05-10T15:00:00Z',
          checkout: '2025-05-14T11:00:00Z',
          listing: 'Beachside Bungalow',
          source: 'Airbnb',
          paid: true,
          autohostStatus: 'approved',
          salto: true
        },
        {
          guestName: 'Brian Smith',
          checkIn: '2025-06-01T15:00:00Z',
          checkout: '2025-06-05T11:00:00Z',
          listing: 'Downtown Loft',
          source: 'Direct',
          paid: false,
          autohostStatus: 'pending',
          salto: false
        },
        {
          guestName: 'Carla Mendes',
          checkIn: '2025-07-15T15:00:00Z',
          checkout: '2025-07-20T11:00:00Z',
          listing: 'Lakeside Retreat',
          source: 'Booking.com',
          paid: true,
          autohostStatus: 'flagged',
          salto: true
        },
        {
          guestName: 'David Lee',
          checkIn: '2025-08-10T15:00:00Z',
          checkout: '2025-08-13T11:00:00Z',
          listing: 'Mountain Cabin',
          source: 'VRBO',
          paid: true,
          autohostStatus: 'approved',
          salto: false
        }
      ]
    },
    timeTracker: {
      days: 13
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
      averageOccupancyTerm: 51.23,
      averageLongTermRate: 71.59,
      averageShortTermRate: 31.41
    },
    timeToLease: {
      days: 44
    }
  };

  return {
    dashboardData
  };
}