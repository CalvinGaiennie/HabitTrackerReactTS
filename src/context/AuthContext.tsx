import { createContext } from "react";
import type { UserSettings, Tier } from "../types/users";

export interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  username: string | null;
  settings: UserSettings | null;
  token: string | null;
  tier: Tier | null;
}

export const AuthContext = createContext<{
  authState: AuthState;
  login: (
    userId: number,
    username: string,
    settings: UserSettings,
    token: string
  ) => void;
  logout: () => void;
} | null>(null);
