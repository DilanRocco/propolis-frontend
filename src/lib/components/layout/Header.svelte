<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Menu } from 'lucide-svelte';
	import { getRouteByPath } from '../../data/routes';

	import ProfileInfo from './ProfileInfo.svelte';

	// Event dispatcher for sidebar toggle
	const dispatch = createEventDispatcher<{
		toggleSidebar: void;
	}>();

	// Props
	export let isDesktop: boolean = true;
	export let isSidebarOpen: boolean = true;
	export let currentPath: string = '/';

	// Get current route information with a default value
	$: currentRoute = getRouteByPath(currentPath) ?? {
		name: 'Unknown',
		description: 'Page not found',
		path: '/404'
	};

	// Handle sidebar toggle
	function toggleSidebar(): void {
		dispatch('toggleSidebar');
	}

	
</script>

<header class="bg-gray-50s px-6 py-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			{#if !isDesktop}
				<button class="p-2" on:click={toggleSidebar}>
					<Menu class="text-gray-800" />
				</button>
			{/if}

			<!-- Show open sidebar button in header when sidebar is closed on desktop -->
			{#if isDesktop && !isSidebarOpen}
				<button
					class="rounded p-2 text-gray-700 hover:bg-gray-100"
					on:click={toggleSidebar}
					aria-label="Open Sidebar"
				>
					<Menu class="text-gray-800" />
				</button>
			{/if}

			<div>
				<h1 class="text-4xl font-bold bg-gradient-to-r from-slate-800 via-coral-600 to-coral-700 bg-clip-text text-transparent">{currentRoute.name}</h1>
				<p class="text-1xl text-gray-500">{currentRoute.description}</p>
			</div>
		</div>

		<div class="flex items-center gap-4">


			<ProfileInfo />
		</div>
	</div>
</header>
