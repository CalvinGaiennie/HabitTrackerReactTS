import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const useUserId = (): number => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated || !authState.userId) {
    throw new Error("User is not authenticated");
  }

  return authState.userId;
};
