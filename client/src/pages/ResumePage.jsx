import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../api/axios"

export default function ResumePage() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => { fetchResumes() }, [])

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resume")
      setResumes(data.resumes)
    } catch (err) {
      setError("Failed to load resumes")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }
    const formData = new FormData()
    formData.append("resume", file)
    setUploading(true)
    setError("")
    setSuccess("")
    try {
      await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setSuccess("Resume uploaded successfully!")
      fetchResumes()
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return
    try {
      await api.delete(`/resume/${id}`)
      setResumes(resumes.filter((r) => r._id !== id))
    } catch (err) {
      setError("Failed to delete resume")
    }
  }

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

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">My Resumes</h1>
        <p className="text-gray-400 text-sm mb-8">
          Upload and manage your resumes
        </p>

        {/* Upload Area */}
        <label className="block cursor-pointer mb-8">
          <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors duration-200 ${
            uploading
              ? "border-blue-500/50 bg-blue-500/5"
              : "border-gray-800 hover:border-gray-700 bg-gray-900/50"
          }`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Uploading and extracting text...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-lg">+</span>
                </div>
                <p className="text-white text-sm font-medium mb-1">
                  Click to upload resume
                </p>
                <p className="text-gray-500 text-xs">
                  PDF only — max 10MB
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
            {success}
          </div>
        )}

        {/* Resume List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-sm">No resumes uploaded yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
              {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
            </p>
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl px-5 py-4 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400 text-xs font-bold">PDF</span>
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

                <div className="flex items-center gap-3">
                  {resume.atsAnalysis?.score !== null && resume.atsAnalysis?.score !== undefined && (
                    <div className="text-right hidden sm:block">
                      <p className={`text-lg font-bold ${scoreColor(resume.atsAnalysis.score)}`}>
                        {resume.atsAnalysis.score}
                      </p>
                      <p className="text-gray-600 text-xs">ATS</p>
                    </div>
                  )}

                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(resume.status)}`}>
                    {resume.status.replace("_", " ")}
                  </span>

                  <Link
                    to={`/resume/${resume._id}`}
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="text-gray-600 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}