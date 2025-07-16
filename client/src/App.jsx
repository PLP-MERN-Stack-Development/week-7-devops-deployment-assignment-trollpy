import { Routes, Route, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()
  const isAuthRoute = location.pathname.startsWith('/auth')

  return (
    <ThemeProvider>
      <Routes>
        {/* Public auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route path="/" element={
          <SignedIn>
            <SocketProvider>
              <DashboardLayout />
            </SocketProvider>
          </SignedIn>
        }>
          <Route index element={<Dashboard />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Prevent redirect if already on /auth/login or /auth/register */}
      {!isAuthRoute && (
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      )}
    </ThemeProvider>
  )
}

export default App
