import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DietPage from "./pages/DietPage";
import WorkoutPage from "./pages/WorkoutPage";
import FinancePage from "./pages/FinancePage";
import AccountPage from "./pages/AccountPage";
import NavBar from "./components/NavBar.tsx"
import './App.css'
function App() {

  return (
    <BrowserRouter>
    <NavBar/>
     <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/Diet" element={<DietPage/>} />
      <Route path="/Finance" element={<FinancePage/>} />
      <Route path="/Workout" element={<WorkoutPage/>} />
      <Route path="/Account" element={<AccountPage/>} />
     </Routes>
    </BrowserRouter>
  )
}

export default App
