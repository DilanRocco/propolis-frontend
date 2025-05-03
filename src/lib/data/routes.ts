import { Home, CreditCard, BarChart2, Settings, Users, Bell, Shield, HelpCircle } from 'lucide-svelte';

// Main navigation routes
export const routes = [
  {
    id: 'dashboard',
    path: '/',
    name: 'Dashboard',
    icon: Home,
    description: 'Main dashboard overview'
  },

];

// Settings sub-routes
export const settingsRoutes = [
  {
    id: 'profile',
    path: '/settings/profile',
    name: 'Profile',
    icon: Users,
    description: 'User profile settings'
  },
  {
    id: 'notifications',
    path: '/settings/notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Notification preferences'
  },
  {
    id: 'security',
    path: '/settings/security',
    name: 'Security',
    icon: Shield,
    description: 'Security settings'
  },
  {
    id: 'help',
    path: '/settings/help',
    name: 'Help & Support',
    icon: HelpCircle,
    description: 'Get help and support'
  }
];

// Utility function to get route by path
export function getRouteByPath(path: any) {
  // Handle the root path
  if (path === '/') {
    return routes.find(route => route.path === '/');
  }
  
  // For other paths, find the matching route or sub-route
  const allRoutes = [...routes, ...settingsRoutes];
  
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
export function isActiveRoute(currentPath:any, routePath:any) {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
}