import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard")
        setStats(data)
      } catch (err) {
        setError("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const scoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const statusBadge = (status) => {
    if (status === "interview_ready") return "bg-green-500/10 text-green-400 border border-green-500/20"
    if (status === "analyzed") return "bg-blue-500/10 text-blue-400 border border-blue-500/20"
    return "bg-gray-700/50 text-gray-400 border border-gray-700"
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here is your resume preparation overview
            </p>
          </div>
          <Link
            to="/resume"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2.5 rounded-xl transition font-medium"
          >
            Upload Resume
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wider">
                  Total Resumes
                </p>
                <p className="text-4xl font-bold text-white">
                  {stats.totalResumes}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wider">
                  Analyzed
                </p>
                <p className="text-4xl font-bold text-white">
                  {stats.totalAnalyzed}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wider">
                  Average Score
                </p>
                <p className={`text-4xl font-bold ${scoreColor(stats.avgScore)}`}>
                  {stats.avgScore}
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wider">
                  Best Score
                </p>
                <p className={`text-4xl font-bold ${scoreColor(stats.bestScore)}`}>
                  {stats.bestScore}
                </p>
              </div>
            </div>

            {/* Recent Resumes */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">
                  Recent Resumes
                </h2>
                <Link
                  to="/resume"
                  className="text-blue-400 hover:text-blue-300 text-sm transition"
                >
                  View all
                </Link>
              </div>

              {stats.recentResumes.length === 0 ? (
                <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-12 text-center">
                  <p className="text-gray-500 text-sm mb-5">
                    No resumes uploaded yet
                  </p>
                  <Link
                    to="/resume"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-2.5 rounded-xl transition"
                  >
                    Upload your first resume
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {stats.recentResumes.map((resume) => (
                    <Link
                      key={resume._id}
                      to={`/resume/${resume._id}`}
                      className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl px-5 py-4 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-gray-700 transition">
                          <span className="text-gray-400 text-xs font-bold">
                            PDF
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {resume.fileName}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(resume.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {resume.score !== null && (
                          <div className="text-right">
                            <p className={`text-xl font-bold ${scoreColor(resume.score)}`}>
                              {resume.score}
                            </p>
                            <p className="text-gray-600 text-xs">ATS</p>
                          </div>
                        )}
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(resume.status)}`}>
                          {resume.status.replace("_", " ")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}