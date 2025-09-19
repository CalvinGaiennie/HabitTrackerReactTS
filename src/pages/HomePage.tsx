import { useEffect, useState} from "react";
function HomePage() {
  const [message, setMessage] = useState<string>("Loading...");

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err));
  }, []);
  return (
    <div className="container d-flex flex-column align-items-center">
      <h1>Habit Tracker</h1>
        <h1>{message}</h1>
    </div>
  )
}

export default HomePage
