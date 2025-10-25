import { useState, useEffect } from "react";
import type { UserSettings } from "./types/users";
import { AuthContext } from "./context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem("authState");
    return savedAuth
      ? JSON.parse(savedAuth)
      : {
          isAuthenticated: false,
          userId: null,
          username: null,
          settings: null,
          token: null,
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
    setAuthState({
      isAuthenticated: true,
      userId,
      username,
      settings,
      token,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      userId: null,
      username: null,
      settings: null,
      token: null,
    });
    localStorage.removeItem("authState");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
