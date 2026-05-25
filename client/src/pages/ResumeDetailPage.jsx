import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../api/axios"

export default function ResumeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await api.get(`/resume/${id}`)
        setResume(data.resume)
      } catch (err) {
        setError("Failed to load resume")
      } finally {
        setLoading(false)
      }
    }
    fetchResume()
  }, [id])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setError("")
    try {
      const { data } = await api.post(`/resume/${id}/analyze`)
      setResume((prev) => ({
        ...prev,
        atsAnalysis: data.atsAnalysis,
        status: "analyzed",
      }))
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  const scoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const scoreBg = (score) => {
    if (score >= 80) return "border-green-500/20"
    if (score >= 60) return "border-yellow-500/20"
    return "border-red-500/20"
  }

  const scoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Average"
    return "Needs Work"
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate("/resume")}
          className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition"
        >
          Back to Resumes
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{resume?.fileName}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Uploaded {new Date(resume?.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        {!resume?.atsAnalysis?.score && (
          <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-12 text-center mb-6">
            <p className="text-white font-semibold mb-2">Analyze your resume</p>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Get your ATS score, strengths, weaknesses, and actionable
              suggestions powered by Gemini AI
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-8 py-3 rounded-xl transition disabled:opacity-50 font-medium"
            >
              {analyzing ? "Analyzing with AI..." : "Analyze Resume"}
            </button>
          </div>
        )}

        {/* ATS Analysis Results */}
        {resume?.atsAnalysis?.score && (
          <div className="flex flex-col gap-5">

            {/* Score Card */}
            <div className={`bg-gray-900 border rounded-2xl p-7 ${scoreBg(resume.atsAnalysis.score)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                    ATS Score
                  </p>
                  <div className="flex items-end gap-2 mb-3">
                    <p className={`text-6xl font-bold ${scoreColor(resume.atsAnalysis.score)}`}>
                      {resume.atsAnalysis.score}
                    </p>
                    <p className="text-gray-600 text-2xl mb-1">/100</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    resume.atsAnalysis.score >= 80
                      ? "bg-green-500/10 text-green-400"
                      : resume.atsAnalysis.score >= 60
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {scoreLabel(resume.atsAnalysis.score)}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                {resume.atsAnalysis.summary}
              </p>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-800">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50"
                >
                  {analyzing ? "Re-analyzing..." : "Re-analyze"}
                </button>
                <Link
                  to={`/interview/${resume._id}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2.5 rounded-xl transition"
                >
                  Generate Interview Questions
                </Link>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Keywords Found</h3>
              <div className="flex flex-wrap gap-2">
                {resume.atsAnalysis.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Strengths</h3>
              <ul className="flex flex-col gap-3">
                {resume.atsAnalysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5 text-sm">+</span>
                    <span className="text-gray-300 text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Weaknesses</h3>
              <ul className="flex flex-col gap-3">
                {resume.atsAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5 text-sm">-</span>
                    <span className="text-gray-300 text-sm leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Suggestions</h3>
              <ul className="flex flex-col gap-3">
                {resume.atsAnalysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold text-sm mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}