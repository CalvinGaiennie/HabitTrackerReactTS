import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="nav py-3">
      <ul className="navbar d-flex justify-content-center w-100 list-unstyled gap-0 gap-md-2 gap-lg-4 gap-xl-5 mb-0">
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/notes">
            Notes
          </NavLink>
        </li>
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/Diet">
            Diet
          </NavLink>
        </li>
        {/* <li className="nav-item mb-md-0">
                    <NavLink className="nav-link fs-5 text-dark px-3" to="/FinancePage">
                    Finance</NavLink>
                </li> */}
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/Workout">
            Workout
          </NavLink>
        </li>
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/Analytics">
          Analytics</NavLink>
        </li>
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/Account">
            Account
          </NavLink>
        </li>
        {/* conditionally render these if user is not logged in */}
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/CreateAccount">
            Create Account
          </NavLink>
        </li>
        <li className="nav-item mb-md-0">
          <NavLink className="nav-link fs-5 text-dark px-3" to="/Login">
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
