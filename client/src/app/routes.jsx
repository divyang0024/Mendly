import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Insights from "../pages/Insights";
import Breathing from "../pages/Breathing";
import Grounding from "../pages/Grounding";
import ReframingPage from "../pages/ReframingPage";
import AffirmationPage from "../pages/AffirmationPage";
import ProtectedRoute from "../middleware/ProtectedRoute";
import ActivationPage from "../pages/ActivationPage";
import ProgressPage from "../pages/ProgressPage";
import RiskDashboard from "../pages/RiskDashboard";
import LongTermPage from "../pages/LongTermPage";
import WeeklyReportPage from "../pages/WeeklyReportPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/breathing"
          element={
            <ProtectedRoute>
              <Breathing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grounding"
          element={
            <ProtectedRoute>
              <Grounding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reframing"
          element={
            <ProtectedRoute>
              <ReframingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/affirmation"
          element={
            <ProtectedRoute>
              <AffirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activation"
          element={
            <ProtectedRoute>
              <ActivationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/risk"
          element={
            <ProtectedRoute>
              <RiskDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/longterm"
          element={
            <ProtectedRoute>
              <LongTermPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weekly-report"
          element={
            <ProtectedRoute>
              <WeeklyReportPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
