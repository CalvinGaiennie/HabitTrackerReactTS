import { useEffect, useState, useContext } from "react";
import { getCurrentUser } from "../services/users";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

function UserNameHeader() {
  const authContext = useContext(AuthContext);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        if (
          authContext?.authState.isAuthenticated &&
          authContext?.authState.token
        ) {
          const me = await getCurrentUser();
          const first = me.first_name?.trim() || "";
          const last = me.last_name?.trim() || "";
          const name = `${first} ${last}`.trim();
          if (isMounted) setFullName(name || me.username);
        } else {
          if (isMounted) setFullName(null);
        }
      } catch {
        // Ignore failure; header will simply not render a name
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [authContext?.authState.isAuthenticated, authContext?.authState.token]);

  if (!authContext?.authState.isAuthenticated || !fullName) {
    return null;
  }
  const now = new Date();
const formatted = now.toLocaleDateString('en-US', {
    month: 'long',    // "December"
    day:   '2-digit', // "02"
    year:  'numeric'  // "2025"
  });

  return (
    <>
      <div className="position-fixed top-0 start-0 end-0 text-center py-4 bg-white border-bottom" style={{ zIndex: 1000 }}>
        <h1 className="mb-0 fs-3 fw-bold">CG HabitTracker</h1>
      </div>
      <NavLink
        to="/Account"
        className="position-fixed top-0 end-0 mt-3 me-3 text-dark"
        style={{ zIndex: 1001 }}
      >
        <i className="bi bi-gear-fill fs-3"></i>
      </NavLink>
    </>
  )
}

export default UserNameHeader;
