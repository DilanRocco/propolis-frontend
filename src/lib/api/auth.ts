export async function login(email: string, password: string) {
    const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    return data;
}

export async function getUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    const res = await fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}
