<script>
	import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
	import IncomeCard from '../lib/components/dashboard/IncomeCard.svelte';
	import DurationCard from '../lib/components/dashboard/DurationCard.svelte';
	import OccupancyRate from '../lib/components/dashboard/OccupancyRate.svelte';
	import PercentageCard from '$lib/components/dashboard/PercentageCard.svelte';
	import ProtectedRoute from '$lib/protectedRoute.svelte';
	import MoneyMetricCard from '$lib/components/dashboard/MoneyMetricCard.svelte';
	import ChatCard from '$lib/components/dashboard/ChatCard.svelte';

	// Import data from page data loading (if you use it)
	export let data;

	// Destructure data properties or use default values if not provided
	const dashboardData = data?.dashboardData;

</script>

<svelte:head>
	<title>Dashboard | Financial Dashboard</title>
</svelte:head>
<ProtectedRoute>
	<div class="space-y-8">
		<WelcomeCard />
		<ChatCard />

		<!-- Main Content -->
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-12 lg:col-span-5">
				<OccupancyRate averageOccupancyTerm={dashboardData.averageOccupancyRate} averageShortTermRate={dashboardData.shortTermOccupancyRate} averageLongTermRate={dashboardData.longTermOccupancyRate} />
			</div>

			<div class="col-span-12 lg:col-span-4">
				<IncomeCard shortTermRevenue={dashboardData.shortTermRevenue} longTermRevenue={dashboardData.longTermRevenue} totalRevenue={dashboardData.totalRevenue} />	
				<MoneyMetricCard title="Revenue Per Available Room" moneyMetric={dashboardData.revenuePerAvailableRoom} />
				<MoneyMetricCard title="Short Term Average Daily Rate" moneyMetric={dashboardData.shortTermAverageDailyRate} />
			</div>

			<div class="col-span-12 lg:col-span-3">
				<DurationCard title="Time to Lease" time={dashboardData.timeToLease} />
				<DurationCard title="Average Lease Tenancy" time={dashboardData.averageLeaseTenancy} />
				<PercentageCard percentage={dashboardData.tenantTurnover} />

				<MoneyMetricCard title="Lease Balance Over Due" moneyMetric={dashboardData.leaseBalanceOverdue} />
			</div>
		</div>
	</div>
</ProtectedRoute>
