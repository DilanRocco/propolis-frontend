<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Menu, Plus, Bell } from 'lucide-svelte';
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

<header class="bg-white border-b border-gray-200 px-6 py-4">
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-4">
      {#if !isDesktop}
        <button class="p-2" on:click={toggleSidebar}>
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
      
      <div class="relative">
        <IconButton 
          icon={Bell} 
          color="gray" 
          bgColor="white" 
          shadow={true}
        />
        {#if notificationCount > 0}
          <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {notificationCount}
          </div>
        {/if}
      </div>
      
      <IconButton 
        icon={Plus} 
        color="gray" 
        bgColor="white" 
        shadow={true}
      />
      
      <ProfileInfo />
    </div>
  </div>
</header>