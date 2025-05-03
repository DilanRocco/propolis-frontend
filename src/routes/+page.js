// This function loads data for the dashboard page
export function load() {
    // In a real app, you might fetch this from an API
    const dashboardData = {
      creditCard: {
        cardNumber: "**** 2719",
        monthlyFee: 25.00,
        cardType: "visa"
      },
      income: {
        totalIncome: 23194.80,
        totalPaid: 8145.20,
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
  
    return {
      dashboardData
    };
  }