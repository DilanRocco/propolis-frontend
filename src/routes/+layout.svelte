<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Header from '../lib/components/layout/Header.svelte';
	import Sidebar from '../lib/components/layout/Sidebar.svelte';
	let isSidebarOpen = false;
	let isDesktop = true;
	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
		console.log('Sidebar toggled:', isSidebarOpen);
	}
	onMount(() => {
		const handleResize = () => {
			isDesktop = window.innerWidth >= 768;
			isSidebarOpen = isDesktop; // Set initial state based on screen size
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});
</script>
<div class="relative flex h-screen bg-gray-50">
	<!-- Sidebar Container - Controls visibility -->
	<div
		class="sidebar-container fixed z-20 h-full overflow-hidden transition-all duration-300 ease-in-out"
		class:w-64={isSidebarOpen}
		class:w-0={!isSidebarOpen}
	>
		<div class="h-full w-full bg-white shadow-md">
			<Sidebar currentPath={$page.url.pathname} {isSidebarOpen} {toggleSidebar} />
		</div>
	</div>

	<!-- Overlay for mobile when sidebar is open -->
	{#if !isDesktop && isSidebarOpen}
		<div class="bg-opacity-30 fixed inset-0 z-10 bg-black" on:click={toggleSidebar}></div>
	{/if}
	<!-- Main Content - Adjusts margin based on sidebar state -->
	<div
		class="z-0 flex flex-1 flex-col overflow-hidden transition-all duration-300"
		class:ml-0={!isSidebarOpen}
		class:ml-64={isSidebarOpen && isDesktop}
	>
		<Header on:toggleSidebar={toggleSidebar} {isDesktop} {isSidebarOpen} currentPath={$page.url.pathname} />
		<main class="flex-1 overflow-y-auto bg-white p-6">
			<slot />
		</main>
	</div>
</div>
<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Inter', sans-serif;
	}
</style>