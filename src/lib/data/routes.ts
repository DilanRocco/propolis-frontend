import { Home, MessageCircle, Building, Book, Users, GitGraph } from 'lucide-svelte';

// Main navigation routes
export const routes = [
  {
    id: 'dashboard',
    path: '/',
    name: 'Dashboard',
    icon: Home,
    description: 'Main dashboard overview'
  },
  {
    id: 'properties',
    path: '/properties',
    name: "Properties",
    icon: Building,
    description: "Short and long term properties overview"
  },
  {
    id: 'Message',
    path: '/messages',
    name: "Chat",
    icon: MessageCircle,
    description: "Message the properties"
  },
  {
    id: 'finacials',
    path: '/financials',
    name: "Financials",
    icon: GitGraph,
    description: "Financials of the company"
  },
  {
    id: 'graph',
    path: '/graph',
    name: "Graph",
    icon: Book,
    description: "Graph properties"
  }



]

export const hiddenRoutes = [
  {
    id: 'login',
    path: '/login',
    name: "Login",
    icon: Users,
    description: "Login into the app"
  }
]




//Utility function to get route by path
export function getRouteByPath(path: string) {
  // Handle the root path
  if (path === '/') {
    return routes.find(route => route.path === '/');
  }
  
  // For other paths, find the matching route or sub-route
  const allRoutes = [...routes, ...hiddenRoutes];
  
  // First try exact match
  let route = allRoutes.find(route => route.path === path);
  
  // If no exact match, find the parent route
  if (!route) {
    route = allRoutes.find(route => 
      route.path !== '/' && path.startsWith(route.path)
    );
  }
  
  return route || { 
    name: 'Not Found', 
    description: 'Page not found',
    path: '/404'
  };
}

// Utility function to check if a route is active
export function isActiveRoute(currentPath:string, routePath:string) {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
}