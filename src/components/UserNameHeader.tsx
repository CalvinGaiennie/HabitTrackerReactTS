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

  return <p className="pt-2 pb-0 mb-0 px-2">{fullName}</p>;
}

export default UserNameHeader;
