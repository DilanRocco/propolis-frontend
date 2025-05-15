// src/hooks.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Get the user's session from cookies
  const session = event.cookies.get('session');
  
  // If the user is trying to access a protected route
  if (event.route.id?.startsWith('/(protected)')) {
    // And they don't have a valid session
    if (!session) {
      // Redirect them to the login page
      throw redirect(303, '/login');
    }
    
    // Optionally verify the session token with your auth service
    // const user = await validateSession(session);
    // if (!user) throw redirect(303, '/login');
    
    // Add the user info to the locals object so it's available in load functions
    event.locals.user = { isAuthenticated: true }; // Replace with actual user data
  }
  
  // Continue with the request
  return resolve(event);
}
