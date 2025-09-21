const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`API error ${res.status}: ${errorBody}`);
    }

    const data: T = await res.json();
    return data;
}

export default request;