import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import BootstrapModal from "./BootstrapModal";
import AccountPage from "../pages/AccountPage";

function NavBar() {
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false)

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
      <ul className="navbar d-flex justify-content-center w-100 list-unstyled gap-2 mb-0">
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
                className="nav-link fs-5 text-dark px-3"
                to="/HabitsAndGoals"
              >
                <i className="bi bi-check2-square"></i>
              </NavLink>
            </li>
            <li className="nav-item mb-md-0">
              <NavLink
                className="nav-link fs-5 text-dark px-3"
                to="/Analytics"
              >
                <i className=" bi bi-graph-up-arrow"></i>
              </NavLink>
            </li>
            <li className="nav-item mb-md-0">
              <i className="bi bi-gear-fill fs-3" onClick={()=> setShowModal(true)}></i>
              <BootstrapModal 
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  title={"Account Page"}
                  >
                    <AccountPage/>
                  </BootstrapModal>
            </li>
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
