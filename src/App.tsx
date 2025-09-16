import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import './App.css'
function App() {

  return (
    <BrowserRouter>
     <h1>Habit Tracker</h1>
     <Routes>
      <Route path="/" element={<HomePage/>} />
     </Routes>
    </BrowserRouter>
  )
}

export default App
