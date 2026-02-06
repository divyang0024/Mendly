import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Insights from "../pages/Insights";
import Breathing from "../pages/Breathing";
import Grounding from "../pages/Grounding";
import ProtectedRoute from "../middleware/ProtectedRoute";

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
      </Routes>
    </BrowserRouter>
  );
}
