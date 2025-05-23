<script>
	import { routes, isActiveRoute } from '../../data/routes';
	import { Menu } from 'lucide-svelte';

	// Props
	export let currentPath = '/';
	export let isSidebarOpen = true;
	export let toggleSidebar = () => {}; // Default empty function
</script>

<div class="flex h-full flex-col">
	<!-- Logo and Brand with Close Button -->
	<div class="mb-8 p-6 flex  justify-between items-center gap-2">
		<!-- Close button when sidebar is open -->

		<a href="/" class="">
			{#if isSidebarOpen}
				<div class='font-bold text-3xl'>
					Propolis
				</div>
			{/if}
      
		</a>
    {#if isSidebarOpen}
		<button
			class="right-4 top-6 text-gray-500 hover:text-gray-700 focus:outline-none"
			on:click={toggleSidebar}
			aria-label="Close Sidebar"
		>
			<Menu class="h-5 w-5" />
		</button>
	{/if}
	</div>

	<!-- Navigation Links -->
	<nav class="flex-1 px-4">
		<ul class="space-y-1">
			{#each routes as route (route.path)}
				<li>
					<a
						href={route.path}
						class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-100
                  {isActiveRoute(currentPath, route.path)
							? 'bg-coral-50 text-coral-500'
							: 'text-gray-700'}"
					>
						<svelte:component
							this={route.icon}
							class="h-5 w-5 {isActiveRoute(currentPath, route.path)
								? 'text-coral-500'
								: 'text-gray-500'}"
						/>
						{#if isSidebarOpen}
							<span>{route.name}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>



	<!-- User Profile Section -->
	<div class="mt-auto border-t border-gray-200 p-4">
		<div class="flex items-center gap-3 p-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
				<span class="text-xs font-medium text-gray-600">U</span>
			</div>
			{#if isSidebarOpen}
				<div>
					<div class="font-medium">Misha Gurevich</div>
					<div class="text-xs text-gray-500">ADMIN</div>
				</div>
			{/if}
		</div>
	</div>
</div>
