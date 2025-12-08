import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext not found");
  }

  const { authState } = authContext;

  // const renderTierChip = () => {
  //   if (!authState.isAuthenticated || !authState.tier) return null;
  //   const isPremium = authState.tier !== "free";
  //   const label = isPremium
  //     ? `Premium (${authState.tier === "annual" ? "Annual" : "Monthly"})`
  //     : "Free";
  //   const cls = isPremium ? "bg-success text-white" : "bg-secondary text-white";
  //   return (
  //     <span className={`badge ${cls}`} style={{ marginLeft: 8 }}>
  //       {label}
  //     </span>
  //   );
  // };

  return (
    <nav className="nav pb-3 fixed-bottom bg-white border-top">
      <ul className="navbar d-flex justify-content-center w-100 list-unstyled gap-4 mb-0">
        {authState.isAuthenticated ? (
          <>
            <li className="nav-item mb-md-0">
              <NavLink className="nav-link fs-5 text-dark px-3" to="/">
               <i className="bi bi-house-door"></i>
              </NavLink>
            </li>
            <li className="nav-item mb-md-0">
              <NavLink className="nav-link fs-5 text-dark px-3" to="/Workout">
              <i className="bi bi-person-walking"></i>
              </NavLink>
            </li>
            <li className="nav-item mb-md-0">
              <NavLink className="nav-link fs-5 text-dark px-3" to="/Diet">
                <i className="bi bi-basket-fill"></i>
              </NavLink>
            </li>
            <li className="nav-item mb-md-0">
             <NavLink
              to="/Account"
              className="nav-link fs-5 text-dark px-3"
              style={{ zIndex: 1001 }}
              >
              <i className="bi bi-gear-fill fs-3"></i>
             </NavLink>
            </li>
            {/* <li className="nav-item mb-md-0">
              <NavLink
                className="nav-link fs-5 text-dark px-3"
                to="/HabitsAndGoals"
              >
                HabitsAndGoals
              </NavLink>
            </li> */}
            {authState.tier && authState.tier !== "free" && (
              <li className="nav-item mb-md-0">
                <NavLink
                  className="nav-link fs-5 text-dark px-3"
                  to="/Analytics"
                >
                  A
                </NavLink>
              </li>
            )}
            {/* <li className="nav-item mb-md-0 d-flex align-items-center">
              <NavLink className="nav-link fs-5 text-dark px-3" to="/Account">
                Account
              </NavLink>
              {renderTierChip()}
            </li> */}
          </>
        ) : (
          <>
            <li className="nav-item mb-md-0">
              <NavLink
                className="nav-link fs-5 text-dark px-3"
                to="/CreateAccount"
              >
                Create Account
              </NavLink>
            </li>
            <li className="nav-item mb-md-0">
              <NavLink className="nav-link fs-5 text-dark px-3" to="/Login">
                Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
