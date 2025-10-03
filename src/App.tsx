import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DietPage from "./pages/DietPage";
import WorkoutPage from "./pages/WorkoutPage";
// import FinancePage from "./pages/FinancePage";
import AccountPage from "./pages/AccountPage";
import NavBar from "./components/NavBar.tsx";
import "./App.css";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import { AuthProvider } from "./context";

function App() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "4rem" }}>
      <AuthProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Diet" element={<DietPage />} />
            {/* <Route path="/Finance" element={<FinancePage/>} /> */}
            <Route path="/Workout" element={<WorkoutPage />} />
            <Route path="/Account" element={<AccountPage />} />
            <Route path="/Analytics" element={<AnalyticsPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
