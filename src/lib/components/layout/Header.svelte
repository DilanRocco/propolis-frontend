<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Menu } from 'lucide-svelte';
	import { getRouteByPath } from '../../data/routes';

	import ProfileInfo from './ProfileInfo.svelte';
	import SearchBar from './SearchBar.svelte';
	import IconButton from '../ui/IconButton.svelte';

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

	let notificationCount: number = 3;
</script>

<header class="bg-gray-50s px-6 py-4">
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
				<h1 class="text-2xl font-bold text-gray-800">{currentRoute.name}</h1>
				<p class="text-sm text-gray-500">{currentRoute.description}</p>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<SearchBar />

			<ProfileInfo />
		</div>
	</div>
</header>
