const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function getAuthToken(): string | null {
  const authState = localStorage.getItem("authState");
  if (authState) {
    try {
      const parsed = JSON.parse(authState);
      return parsed.token || null;
    } catch {
      return null;
    }
  }
  return null;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  // Only set Content-Type when we're actually sending a JSON body
  const method = (options?.method || "GET").toUpperCase();
  if (method !== "GET" && options?.body) {
    headers["Content-Type"] = "application/json";
  }

  // Merge with any headers from options
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }

  const data: T = await res.json();
  return data;
}

export default request;
