<script>
    import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
    import CreditCard from '../lib/components/dashboard/CreditCard.svelte';
    import AnnualProfits from '../lib/components/dashboard/AnnualProfits.svelte';
    import IncomeCard from '../lib/components/dashboard/IncomeCard.svelte';
    import ActivityManager from '../lib/components/dashboard/ActivityManager.svelte';
    import TimeTracker from '../lib/components/dashboard/TimeTracker.svelte';
    import GrowthRate from '../lib/components/dashboard/GrowthRate.svelte';
    import StocksWidget from '../lib/components/dashboard/StocksWidget.svelte';
    
    // Import stores
    import { dashboardStore } from '../lib/stores/dashboard';
  </script>
  
  <div class="space-y-8">
    <WelcomeCard />
  
    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-5">
        <CreditCard {...$dashboardStore.creditCard} />
        <AnnualProfits {...$dashboardStore.annualProfits} />
      </div>
      
      <div class="col-span-12 lg:col-span-4">
        <IncomeCard {...$dashboardStore.income} />
        <ActivityManager {...$dashboardStore.activityManager} />
      </div>
      
      <div class="col-span-12 lg:col-span-3">
        <TimeTracker {...$dashboardStore.timeTracker} />
        <GrowthRate percentage={$dashboardStore.growthRate.percentage} />
        <StocksWidget {...$dashboardStore.stocks} />
      </div>
    </div>
  </div>