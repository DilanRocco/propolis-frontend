import { writable, derived, get as getStoreValue } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';

// Types
interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Auth store
const createAuthStore = () => {
  const initialToken = browser ? localStorage.getItem('token') : null;

  let initialUser: User | null = null;
  if (initialToken) {
    try {
      const decoded = jwtDecode<{ sub: string }>(initialToken);
      initialUser = { email: decoded.sub };
    } catch {
      if (browser) localStorage.removeItem('token');
    }
  }

  const state: AuthState = {
    user: initialUser,
    token: initialToken,
    loading: false,
    error: null
  };

  const { subscribe, set, update } = writable<AuthState>(state);

  return {
    subscribe,

    login: async (email: string, password: string): Promise<boolean> => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        const token = data.access_token;
        const decoded = jwtDecode<{ sub: string }>(token);
        const user = { email: decoded.sub };

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

      update((state) => ({ ...state, loading: true }));

      try {
        const response = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${currentState.token}`
          }
        });

        if (!response.ok) throw new Error('Session expired');

        const user = await response.json();
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

    getState: (): AuthState => getStoreValue(auth)
  };
};

export const auth = createAuthStore();

// Derived stores for convenience
export const user = derived(auth, ($auth) => $auth.user);
export const isAuthenticated = derived(auth, ($auth) => !!$auth.user);
export const isLoading = derived(auth, ($auth) => $auth.loading);
export const authError = derived(auth, ($auth) => $auth.error);
