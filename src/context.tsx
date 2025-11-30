import { useState, useEffect } from "react";
import type { UserSettings, Tier } from "./types/users";
import { AuthContext, type AuthState } from "./context/AuthContext";
import { getCurrentUser } from "./services/users";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem("authState");
    return savedAuth
      ? (JSON.parse(savedAuth) as AuthState)
      : {
          isAuthenticated: false,
          userId: null,
          username: null,
          settings: null,
          token: null,
          tier: null as Tier | null,
        };
  });

  // Save to localStorage whenever authState changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  const login = (
    userId: number,
    username: string,
    settings: UserSettings,
    token: string
  ) => {
    const nextState: AuthState = {
      isAuthenticated: true,
      userId,
      username,
      settings,
      token,
      tier: null,
    };
    // Persist immediately so API calls that read from localStorage have the token
    localStorage.setItem("authState", JSON.stringify(nextState));
    setAuthState(nextState);
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      userId: null,
      username: null,
      settings: null,
      token: null,
      tier: null,
    });
    localStorage.removeItem("authState");
  };

  // After login or refresh, fetch the user's tier
  useEffect(() => {
    const fetchTier = async () => {
      try {
        if (authState.isAuthenticated && authState.token) {
          const me = await getCurrentUser();
          setAuthState((prev: AuthState) => ({ ...prev, tier: me.tier }));
        }
      } catch {
        // Ignore tier load failures; user stays as free
      }
    };
    fetchTier();
  }, [authState.isAuthenticated, authState.token]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
