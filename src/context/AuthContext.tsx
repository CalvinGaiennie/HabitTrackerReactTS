import { createContext } from "react";
import type { UserSettings } from "../types/users";

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  username: string | null;
  settings: UserSettings | null;
}

export const AuthContext = createContext<{
  authState: AuthState;
  login: (userId: number, username: string, settings: UserSettings) => void;
  logout: () => void;
} | null>(null);
