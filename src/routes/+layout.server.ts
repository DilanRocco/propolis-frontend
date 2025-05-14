import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {
	const token = cookies.get("access_token");

    const currentPath = url.pathname;

	// Allow access to the login page without a token
	if (currentPath === '/login') {
		return {};
	}
	if (!token) {
		throw redirect(303, '/login');
	}

	// Optionally verify the token with your backend
	const res = await fetch("http://localhost:8000/auth/me", {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!res.ok) {
		throw redirect(303, '/login');
	}

	const user = await res.json();
	return { user };
}