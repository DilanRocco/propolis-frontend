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
  {
    id: 'transactions',
    path: '/transactions',
    name: 'Transactions',
    icon: CreditCard,
    description: 'View and manage transactions'
  },
  {
    id: 'analytics',
    path: '/analytics',
    name: 'Analytics',
    icon: BarChart2,
    description: 'Financial analytics and reports'
  },
  {
    id: 'settings',
    path: '/settings',
    name: 'Settings',
    icon: Settings,
    description: 'User and application settings'
  }
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

// Utility function to get route by ID
export function getRouteById(id: string) {
  return [...routes, ...settingsRoutes].find(route => route.id === id);
}

// Utility function to check if a route is active
export function isActiveRoute(currentPath: string, routePath: string) {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
}