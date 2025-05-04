<script>
  import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
  import CreditCard from '../lib/components/dashboard/CreditCard.svelte';
  import AnnualProfits from '../lib/components/dashboard/AnnualProfits.svelte';
  import IncomeCard from '../lib/components/dashboard/IncomeCard.svelte';
  import ActivityManager from '../lib/components/dashboard/ActivityManager.svelte';
  import TimeTracker from '../lib/components/dashboard/TimeTracker.svelte';
  import GrowthRate from '../lib/components/dashboard/GrowthRate.svelte';
  import StocksWidget from '../lib/components/dashboard/StocksWidget.svelte';
  
  // Import data from page data loading (if you use it)
  export let data;
  
  // Destructure data properties or use default values if not provided
  const dashboardData = data?.dashboardData || {
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
</script>

<svelte:head>
  <title>Dashboard | Financial Dashboard</title>
</svelte:head>

<div class="space-y-8">
  <WelcomeCard />

  <!-- Main Content -->
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-5">
      <CreditCard {...dashboardData.creditCard} />
      <AnnualProfits {...dashboardData.annualProfits} />
    </div>
    
    <div class="col-span-12 lg:col-span-4">
      <IncomeCard {...dashboardData.income} />
      <ActivityManager {...dashboardData.activityManager} />
    </div>
    
    <div class="col-span-12 lg:col-span-3">
      <TimeTracker {...dashboardData.timeTracker} />
      <GrowthRate percentage={dashboardData.growthRate.percentage} />
      <StocksWidget {...dashboardData.stocks} />
    </div>
  </div>
</div>