<script>
	import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
	import AnnualProfits from '../lib/components/dashboard/AnnualProfits.svelte';
	import IncomeCard from '../lib/components/dashboard/IncomeCard.svelte';
	import ReservationManager from '../lib/components/dashboard/ReservationManager.svelte';
	import TimeTracker from '../lib/components/dashboard/TimeTracker.svelte';
	import TenantTurnover from '../lib/components/dashboard/TenantTurnover.svelte';
	import StocksWidget from '../lib/components/dashboard/StocksWidget.svelte';
	import OccupancyRate from '../lib/components/dashboard/OccupancyRate.svelte';

	// Import data from page data loading (if you use it)
	export let data;

	// Destructure data properties or use default values if not provided
	const dashboardData = data?.dashboardData 
</script>

<svelte:head>
	<title>Dashboard | Financial Dashboard</title>
</svelte:head>

<div class="space-y-8">
	<WelcomeCard />

	<!-- Main Content -->
	<div class="grid grid-cols-12 gap-6">
		<div class="col-span-12 lg:col-span-5">
			<OccupancyRate occupancyRate={dashboardData.occupancyRate} />

			<AnnualProfits {...dashboardData.annualProfits} />
		</div>

		<div class="col-span-12 lg:col-span-4">
			<IncomeCard income={dashboardData.revenue} />

			<ReservationManager reservations={dashboardData.reservationManager} />
		</div>

		<div class="col-span-12 lg:col-span-3">
			<TimeTracker {...dashboardData.timeTracker} />
			<TenantTurnover percentage={dashboardData.tentantTurnover.percentage} />
			<StocksWidget {...dashboardData.stocks} />
		</div>
	</div>
</div>
