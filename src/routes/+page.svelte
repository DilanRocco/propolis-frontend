<script lang="ts">
	import { onMount } from 'svelte';
	import WelcomeCard from '../lib/components/dashboard/WelcomeCard.svelte';
	import ProtectedRoute from '$lib/protectedRoute.svelte';
	import DashboardSummary from '../lib/components/DashboardSummary.svelte';
	import { 
		dashboardData, 
		dashboardLoading, 
		dashboardError, 
		fetchDashboardData 
	} from '../lib/stores/simpleDashboardStore';

	// Reactive dashboard state
	$: data = $dashboardData;
	$: loading = $dashboardLoading;
	$: error = $dashboardError;

	onMount(() => {
		// Load initial data when component mounts
		fetchDashboardData();
	});
</script>

<svelte:head>
	<title>Dashboard | Financial Dashboard</title>
</svelte:head>
<ProtectedRoute>
	<div class="space-y-0">
		
		
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Loading dashboard data...</span>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<div class="text-red-800 font-medium">Error loading dashboard data</div>
				<div class="text-red-600 text-sm mt-1">{error}</div>
				<button 
					on:click={() => fetchDashboardData()}
					class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
				>
					Retry
				</button>
			</div>
		{:else if data}
			<!-- New Comprehensive Dashboard with Real API Data -->
			<DashboardSummary dashboardData={data} />
		{/if}
	</div>
</ProtectedRoute>
