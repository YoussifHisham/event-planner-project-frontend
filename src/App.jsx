import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import WelcomePage from "./pages/WelcomePage"
import SearchPage from "./pages/SearchPage"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

function MainApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/auth" element={user ? <Navigate to="/welcome" replace /> : <AuthPage />} />
      <Route path="/welcome" element={user ? <WelcomePage /> : <Navigate to="/auth" replace />} />
      <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </BrowserRouter>
  )
}