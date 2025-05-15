import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize the store with the token from localStorage if available
const storedToken = browser ? localStorage.getItem('access_token') : null;
const storedUser = browser && localStorage.getItem('user') ? 
                  JSON.parse(localStorage.getItem('user')) : null;

export const token = writable(storedToken);
export const user = writable(storedUser);
export const isAuthenticated = writable(!!storedToken);

// Update localStorage when the token changes
if (browser) {
    token.subscribe(value => {
        if (value) {
            localStorage.setItem('access_token', value);
            isAuthenticated.set(true);
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            isAuthenticated.set(false);
        }
    });
    
    user.subscribe(value => {
        if (value) {
            localStorage.setItem('user', JSON.stringify(value));
        }
    });
}

// Auth functions
export async function login(email: string, password: string) {
    const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) throw new Error(await res.text());
    
    const data = await res.json();
    console.log("Login response:", data);
    
    // Update stores
    token.set(data.access_token);
    
    // Fetch user info
    await fetchUser();
    
    return data;
}

export async function logout() {
    token.set(null);
    user.set(null);
}

export async function fetchUser() {
    let currentToken;
    token.subscribe(value => { currentToken = value; })();
    
    if (!currentToken) return null;
    
    try {
        const res = await fetch("http://localhost:8000/auth/me", {
            headers: { 
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        const userData = await res.json();
        user.set(userData);
        return userData;
    } catch (error) {
        console.error("Error fetching user:", error);
        token.set(null);
        user.set(null);
        return null;
    }
}