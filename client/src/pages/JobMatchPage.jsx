import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import api from "../api/axios"

export default function JobMatchPage() {
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get("/resume")
        setResumes(data.resumes)
      } catch (err) {
        setError("Failed to load resumes")
      }
    }
    fetchResumes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedResume) {
      setError("Please select a resume")
      return
    }
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const { data } = await api.post(`/resume/${selectedResume}/match`, {
        jobDescription,
      })
      setResult(data.matchResult)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to match")
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const scoreLabel = (score) => {
    if (score >= 80) return "Strong Match"
    if (score >= 60) return "Good Match"
    if (score >= 40) return "Partial Match"
    return "Weak Match"
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">
          Job Description Matcher
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          See how well your resume matches a job description
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                Select Resume
              </label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                required
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition placeholder-gray-600 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-3 rounded-xl transition disabled:opacity-50 font-medium self-start"
            >
              {loading ? "Analyzing..." : "Match Resume"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                Match Score
              </p>
              <div className="flex items-end gap-2 mb-2">
                <p className={`text-6xl font-bold ${scoreColor(result.matchScore)}`}>
                  {result.matchScore}
                </p>
                <p className="text-gray-600 text-2xl mb-1">/100</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                result.matchScore >= 80
                  ? "bg-green-500/10 text-green-400"
                  : result.matchScore >= 60
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {scoreLabel(result.matchScore)}
              </span>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Matched Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">
                How to improve your match
              </h3>
              <ul className="flex flex-col gap-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold text-sm">{i + 1}.</span>
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