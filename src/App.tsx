import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FinancePage from "./pages/FinancePage";
import NavBar from "./components/NavBar.tsx"
import './App.css'
function App() {

  return (
    <BrowserRouter>
    <NavBar/>
     <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/FinancePage" element={<FinancePage/>} />
     </Routes>
    </BrowserRouter>
  )
}

export default App
