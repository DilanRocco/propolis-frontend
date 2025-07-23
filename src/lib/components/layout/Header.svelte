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
		path: '/404',
		icon: null
	};

	// Handle sidebar toggle
	function toggleSidebar(): void {
		dispatch('toggleSidebar');
	}

	
</script>

<header class="bg-gray-50s py-6 px-6">
	<div class="mx-auto w-full" style="max-width: 1400px;">
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
					<div class="flex items-center gap-3 mb-1">
						{#if currentRoute.icon}
							<svelte:component this={currentRoute.icon} class="w-8 h-8" style="color: var(--color-propolis-teal)" />
						{/if}
						<h1 class="text-4xl font-bold   from-slate-800 bg-clip-text text-transparent" style="color: var(--color-propolis-teal)">{currentRoute.name}</h1>
					</div>
					<p class="text-1xl text-gray-500">{currentRoute.description}</p>
				</div>
			</div>

			<div class="flex items-center gap-4">


				<ProfileInfo />
			</div>
		</div>
	</div>
</header>
