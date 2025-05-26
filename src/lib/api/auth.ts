import { writable, derived, get as getStoreValue } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';
import { PUBLIC_API_URL } from '$env/static/public';

// Types
interface User {
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface JWTPayload {
  sub: string;
  full_name?: string;
  role?: string;
  exp?: number;
}

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (!decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

// Helper function to extract user from JWT token
const extractUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return {
      email: decoded.sub,
      full_name: decoded.full_name || '',
      role: decoded.role || 'guest'
    };
  } catch {
    return null;
  }
};

// Auth store
const createAuthStore = () => {
  const initialToken = browser ? localStorage.getItem('token') : null;
  let initialUser: User | null = null;
  
  if (initialToken && !isTokenExpired(initialToken)) {
    initialUser = extractUserFromToken(initialToken);
    if (!initialUser && browser) {
      localStorage.removeItem('token');
    }
  } else if (initialToken && browser) {
    localStorage.removeItem('token');
  }

  const state: AuthState = {
    user: initialUser,
    token: initialToken && !isTokenExpired(initialToken) ? initialToken : null,
    loading: false,
    error: null
  };

  const { subscribe, set, update } = writable<AuthState>(state);

  return {
    subscribe,
    
    login: async (email: string, password: string): Promise<boolean> => {
      update((state) => ({ ...state, loading: true, error: null }));
      
      try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }
        
        const token = data.access_token;
        
        // Check if token is valid and not expired
        if (isTokenExpired(token)) {
          throw new Error('Received expired token');
        }
        
        const user = extractUserFromToken(token);
        if (!user) {
          throw new Error('Invalid token format');
        }
        
        if (browser) localStorage.setItem('token', token);
        
        update((state) => ({
          ...state,
          user,
          token,
          loading: false,
          error: null
        }));
        
        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        update((state) => ({
          ...state,
          loading: false,
          error: message
        }));
        return false;
      }
    },
    
    logout: () => {
      if (browser) localStorage.removeItem('token');
      set({ user: null, token: null, loading: false, error: null });
      goto('/login');
    },
    
    checkAuth: async (): Promise<boolean> => {
      const currentState = getStoreValue(auth);
      
      if (!currentState.token) return false;
      
      // Check if token is expired before making API call
      if (isTokenExpired(currentState.token)) {
        if (browser) localStorage.removeItem('token');
        set({ user: null, token: null, loading: false, error: null });
        return false;
      }
      
      update((state) => ({ ...state, loading: true }));
      
      try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${currentState.token}`
          }
        });
        
        if (!response.ok) throw new Error('Session expired');
        
        const userData = await response.json();
        
        const user: User = {
          email: userData.email || userData.sub || '',
          full_name: userData.full_name || '',
          role: userData.role || 'guest'
        };
        
        update((state) => ({
          ...state,
          user,
          loading: false,
          error: null
        }));
        
        return true;
      } catch {
        if (browser) localStorage.removeItem('token');
        set({ user: null, token: null, loading: false, error: null });
        return false;
      }
    },
    
    refreshToken: async (): Promise<boolean> => {
      const currentState = getStoreValue(auth);
      
      if (!currentState.token) return false;
      
      try {
        const response = await fetch(`${PUBLIC_API_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentState.token}`
          }
        });
        
        if (!response.ok) throw new Error('Token refresh failed');
        
        const data = await response.json();
        const newToken = data.access_token;
        
        if (isTokenExpired(newToken)) {
          throw new Error('Received expired token');
        }
        
        const user = extractUserFromToken(newToken);
        if (!user) {
          throw new Error('Invalid token format');
        }
        
        if (browser) localStorage.setItem('token', newToken);
        
        update((state) => ({
          ...state,
          user,
          token: newToken,
          error: null
        }));
        
        return true;
      } catch {
        if (browser) localStorage.removeItem('token');
        set({ user: null, token: null, loading: false, error: null });
        return false;
      }
    },
    
    clearError: () => {
      update((state) => ({ ...state, error: null }));
    },
    
    getState: (): AuthState => getStoreValue(auth)
  };
};

export const auth = createAuthStore();

// Derived stores for convenience
export const user = derived(auth, ($auth) => $auth.user);
export const isAuthenticated = derived(auth, ($auth) => !!$auth.user);
export const isLoading = derived(auth, ($auth) => $auth.loading);
export const authError = derived(auth, ($auth) => $auth.error);
export const userRole = derived(auth, ($auth) => $auth.user?.role);
export const userName = derived(auth, ($auth) => $auth.user?.full_name || $auth.user?.email);

// Auto-refresh token when it's about to expire (if refresh endpoint exists)
if (browser) {
  setInterval(async () => {
    const currentState = getStoreValue(auth);
    if (currentState.token && currentState.user) {
      try {
        const decoded = jwtDecode<JWTPayload>(currentState.token);
        if (decoded.exp) {
          const timeUntilExpiry = decoded.exp * 1000 - Date.now();
          // Refresh token if it expires in less than 5 minutes
          if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            await auth.refreshToken();
          }
        }
      } catch {
        // Token is invalid, ignore
      }
    }
  }, 60000); // Check every minute
}