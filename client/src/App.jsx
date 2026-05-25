import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

// Pages
import JobMatchPage from "./pages/JobMatchPage"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ResumePage from "./pages/ResumePage"
import ResumeDetailPage from "./pages/ResumeDetailPage"
import InterviewPage from "./pages/InterviewPage"
import BulletRewriterPage from "./pages/BulletRewriterPage"

// Protected route component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/resume" element={<PrivateRoute><ResumePage /></PrivateRoute>} />
      <Route path="/resume/:id" element={<PrivateRoute><ResumeDetailPage /></PrivateRoute>} />
      <Route path="/interview/:resumeId" element={<PrivateRoute><InterviewPage /></PrivateRoute>} />
      <Route path="/bullet-rewriter" element={<PrivateRoute><BulletRewriterPage /></PrivateRoute>} />
      <Route path="/job-match" element={<PrivateRoute><JobMatchPage /></PrivateRoute>} />
      
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App