import { useEffect, useState} from "react";
function HomePage() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err));
  }, []);
  return (
    <div>
        <h1>{message}</h1>
    </div>
  )
}

export default HomePage
