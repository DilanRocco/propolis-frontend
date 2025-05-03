<script>
  import { routes, isActiveRoute } from '../../data/routes';
  
  // Props
  export let currentPath = '/';
</script>

<div class="h-full flex flex-col">
  <!-- Logo and Brand -->
  <div class="p-6 mb-8">
    <a href="/" class="flex items-center gap-2">
      <div class="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
        №
      </div>
      <div>
        <div class="font-semibold text-lg">Financial</div>
        <div class="text-gray-500">Dashboard</div>
      </div>
    </a>
  </div>
  
  <!-- Navigation Links -->
  <nav class="flex-1 px-4">
    <ul class="space-y-1">
      {#each routes as route}
        <li>
          <a 
            href={route.path} 
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors
                  {isActiveRoute(currentPath, route.path) 
                    ? 'bg-coral-50 text-coral-500' : 'text-gray-700'}"
          >
            <svelte:component 
              this={route.icon} 
              class="w-5 h-5 {isActiveRoute(currentPath, route.path)
                ? 'text-coral-500' : 'text-gray-500'}" 
            />
            <span>{route.name}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
  
  <!-- User Profile Section -->
  <div class="p-4 border-t border-gray-200 mt-auto">
    <div class="flex items-center gap-3 p-2">
      <div>
        <div class="font-medium">Username</div>
        <div class="text-xs text-gray-500">ADMIN</div>
      </div>
    </div>
  </div>
</div>