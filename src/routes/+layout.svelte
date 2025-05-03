<script>
  import "../app.css"
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  // Import layout components
  import Header from '../lib/components/layout/Header.svelte';
  import Sidebar from '../lib/components/layout/Sidebar.svelte';
  
  // State for sidebar visibility on mobile
  let isSidebarOpen = false;
  
  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
  

  // Handle responsive layout
  let isDesktop = true;
  
  onMount(() => {
    const handleResize = () => {
      isDesktop = window.innerWidth >= 768;
      if (isDesktop) isSidebarOpen = true;
    };
    
    // Initial check
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="flex h-screen bg-gray-50">
  <!-- Sidebar - Visible on desktop or when toggled on mobile -->
  {#if isDesktop || isSidebarOpen}
    <div class="w-64 h-full bg-white shadow-md z-10 {isDesktop ? 'relative' : 'fixed'} transition-all duration-300">
      <Sidebar currentPath={$page.url.pathname} />
    </div>
  {/if}
  
  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header with toggle sidebar button for mobile -->
    <Header on:toggleSidebar={toggleSidebar} {isDesktop} currentPath={$page.url.pathname} />
    
    <!-- Page Content -->
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