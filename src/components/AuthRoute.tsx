import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface AuthRouteProps {
  children: React.ReactNode;
}

export const AuthRoute = ({ children }: AuthRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext not found");
  }

  const { authState } = authContext;

  // If user is already authenticated, redirect to home page
  if (authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
