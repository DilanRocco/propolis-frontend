<script>
	import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
	import CreditCard from '../lib/components/dashboard/CreditCard.svelte';
	import AnnualProfits from '../lib/components/dashboard/AnnualProfits.svelte';
	import IncomeCard from '../lib/components/dashboard/IncomeCard.svelte';
	import ReservationManager from '../lib/components/dashboard/ReservationManager.svelte';
	import TimeTracker from '../lib/components/dashboard/TimeTracker.svelte';
	import TenantTurnover from '../lib/components/dashboard/TenantTurnover.svelte';
	import StocksWidget from '../lib/components/dashboard/StocksWidget.svelte';
	import OccupancyRate from '$lib/components/dashboard/OccupancyRate.svelte';

	// Import data from page data loading (if you use it)
	export let data;

	// Destructure data properties or use default values if not provided
	const dashboardData = data?.dashboardData || {
		occupancyTerm: {
			averageOccupancyTerm: 50.5,
			averageLongTerm: 30,
			averageShortTerm: 71
		},
		creditCard: {
			cardNumber: '**** 2719',
			monthlyFee: 25.0,
			cardType: 'visa'
		},
		income: {
			totalLongTerm: 24314.53,
			totalShortTerm: 22312.23,
			totalIncome: 46626.76,
			timeframe: 'Weekly'
		},
		annualProfits: {
			year: '2023',
			profits: [
				{ value: '4K', color: 'coral-500', size: 24, position: { top: 36, right: 28 } },
				{ value: '6.8K', color: 'coral-300', size: 36, position: { top: 28, right: 28 } },
				{ value: '9.3K', color: 'coral-200', size: 48, position: { top: 20, right: 28 } },
				{ value: '14K', color: 'coral-100', size: 64, position: { top: 10, right: 24 } }
			]
		},
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
			days: 13,
			hours: 109,
			minutes: 23,
			totalDots: 20,
			activeDots: 10,
			prevYear: '2022',
			currentYear: '2023'
		},
		TenantTurnover: {
			percentage: 36
		},
		stocks: {
			stocksValue: 16073.49,
			growthPercentage: 9.3,
			ratingQuestion: 'How is your business management going?'
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
			<OccupancyRate occupancyRate={dashboardData.occupancyRate} />
			<CreditCard {...dashboardData.creditCard} />
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
