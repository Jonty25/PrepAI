import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/resume", label: "Resumes" },
    { to: "/job-match", label: "Job Match" },
    { to: "/bullet-rewriter", label: "Bullet Rewriter" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-white font-bold text-lg">PrepAI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm transition font-medium ${
                  isActive(link.to)
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-gray-400 text-sm">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pt-4 pb-2 flex flex-col gap-1 border-t border-gray-800 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive(link.to)
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-left px-4 py-2.5 text-gray-500 hover:text-white text-sm transition mt-1"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}