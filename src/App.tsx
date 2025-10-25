import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DietPage from "./pages/DietPage/DietPage.tsx";
import WorkoutPage from "./pages/WorkoutPage/WorkoutPage.tsx";
// import FinancePage from "./pages/FinancePage";
import AccountPage from "./pages/AccountPage";
import NavBar from "./components/NavBar.tsx";
import "./App.css";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import { AuthProvider } from "./context";
import CreateAccountPage from "./pages/CreateAccountPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthRoute } from "./components/AuthRoute.tsx";

function App() {
  return (
    <div
      className="App"
      style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "4rem" }}
    >
      <AuthProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Diet"
              element={
                <ProtectedRoute>
                  <DietPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/Finance" element={<FinancePage/>} /> */}
            <Route
              path="/Workout"
              element={
                <ProtectedRoute>
                  <WorkoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CreateAccount"
              element={
                <AuthRoute>
                  <CreateAccountPage />
                </AuthRoute>
              }
            />
            <Route
              path="/Login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
