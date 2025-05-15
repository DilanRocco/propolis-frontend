import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Get token from cookies if available
  const token = event.cookies.get('token');
  
  // Add token to the locals object for access in server-side code
  if (token) {
    event.locals.token = token;
    
    // You could verify the token here if needed
    // For simplicity, we're just setting it in locals
  }
  
  // Continue resolving the request
  return resolve(event);
};