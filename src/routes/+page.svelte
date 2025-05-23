<script>
	import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
	import IncomeCard from '../lib/components/dashboard/IncomeCard.svelte';
	import DurationCard from '../lib/components/dashboard/DurationCard.svelte';
	import OccupancyRate from '../lib/components/dashboard/OccupancyRate.svelte';
	import PercentageCard from '$lib/components/dashboard/PercentageCard.svelte';
	import ProtectedRoute from '$lib/protectedRoute.svelte';
	import MoneyMetricCard from '$lib/components/dashboard/MoneyMetricCard.svelte';

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

		<!-- Main Content -->
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-12 lg:col-span-5">
				<OccupancyRate occupancyRate={dashboardData.occupancyRate} />
			</div>

			<div class="col-span-12 lg:col-span-4">
				<IncomeCard income={dashboardData.revenue} />	
			</div>

			<div class="col-span-12 lg:col-span-3">
				<DurationCard title="Time to Lease" time={dashboardData.timeToLease} />
				<DurationCard title="Average Lease Tenancy" time={dashboardData.timeTracker} />
				<PercentageCard percentage={dashboardData.tentantTurnover.percentage} />
				<MoneyMetricCard title="Lease Balance Over Due" moneyMetric={dashboardData.moneyMetric} />
			</div>
		</div>
	</div>
</ProtectedRoute>
