import { useEffect, useState, useContext } from "react";
import { getCurrentUser } from "../services/users";
import { AuthContext } from "../context/AuthContext";

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

  return <div className="d-flex justify-content-between">
    <p className="pt-2 pb-0 mb-0 px-2">{fullName}</p>
    <p className="pt-2 pb-0 mb-0 px-2">{formatted}</p>
    </div>
}

export default UserNameHeader;
