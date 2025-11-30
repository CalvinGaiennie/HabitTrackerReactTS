import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PaidRouteProps {
  children: React.ReactNode;
}

export const PaidRoute = ({ children }: PaidRouteProps) => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext not found");

  const { authState } = authContext;

  if (!authState.isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  // While tier is loading, don't block navigation abruptly
  if (authState.tier === null) {
    return null;
  }

  if (authState.tier === "free") {
    // Redirect free users to Account to upgrade
    return <Navigate to="/Account" replace />;
  }

  return <>{children}</>;
};

export default PaidRoute;
