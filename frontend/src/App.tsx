import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import DonorDashboard from './pages/donor/DonorDashboard'
import ReceiverDashboard from './pages/receiver/ReceiverDashboard'
import Layout from './components/Layout'

function AuthedRoutes() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!user.role) return <Navigate to="/select-role" replace />
  if (user.role === 'DONOR') return <Navigate to="/donor" replace />
  return <Navigate to="/receiver" replace />
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireRole({ role, children }: { role: 'DONOR' | 'RECEIVER'; children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!user.role) return <Navigate to="/select-role" replace />
  if (user.role !== role) return <Navigate to={user.role === 'DONOR' ? '/donor' : '/receiver'} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AuthedRoutes />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/select-role"
          element={
            <RequireAuth>
              <RoleSelectionPage />
            </RequireAuth>
          }
        />

        <Route
          path="/donor/*"
          element={
            <RequireRole role="DONOR">
              <Layout />
            </RequireRole>
          }
        >
          <Route index element={<DonorDashboard />} />
        </Route>

        <Route
          path="/receiver/*"
          element={
            <RequireRole role="RECEIVER">
              <Layout />
            </RequireRole>
          }
        >
          <Route index element={<ReceiverDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

