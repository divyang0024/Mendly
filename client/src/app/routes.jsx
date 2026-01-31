import { Routes as RRRoutes, Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute'
import GuestRoute from '../middleware/GuestRoute'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Chat from '../pages/Chat'
import CopingTools from '../pages/CopingTools'
import Insights from '../pages/Insights'
import MoodDashboard from '../pages/MoodDashboard'
import Journal from '../pages/Journal'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'

export default function Routes() {
  return (
    <RRRoutes>
      {/* Guest Routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/coping-tools" element={<CopingTools />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/mood" element={<MoodDashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </RRRoutes>
  )
}
