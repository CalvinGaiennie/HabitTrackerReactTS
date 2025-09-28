import { createContext, useState, useContext, useEffect } from "react";
import type { UserSettings } from "./types/users";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth
      ? JSON.parse(savedAuth)
      : {
          status: "not logged in",
          userId: null,
          username: null,
          settings: null,
        };
  });

  // Save to localStorage whenever authState changes
  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  const login = (userId: number, username: string, settings: UserSettings) => {
    setAuthState({
      status: "logged in",
      userId,
      username,
      settings,
    });
  };

  const logout = () => {
    setAuthState({
      status: "not logged in",
      userId: null,
      username: null,
      settings: null,
    });
  };
  return (
    <AuthContext.Provider value={{ authState, login, logout } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
