import { useState } from "react"
import Navbar from "../components/Navbar"
import api from "../api/axios"

export default function BulletRewriterPage() {
  const [form, setForm] = useState({ bulletPoint: "", jobRole: "" })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const { data } = await api.post("/bullet/rewrite", form)
      setResult(data.result)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to rewrite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">
          Bullet Point Rewriter
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Paste a weak resume bullet point and get an AI improved version
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                Job Role
              </label>
              <input
                type="text"
                name="jobRole"
                value={form.jobRole}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition placeholder-gray-600"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">
                Original Bullet Point
              </label>
              <textarea
                name="bulletPoint"
                value={form.bulletPoint}
                onChange={handleChange}
                placeholder="e.g. worked on website and fixed some bugs"
                required
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition placeholder-gray-600 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-3 rounded-xl transition disabled:opacity-50 font-medium self-start"
            >
              {loading ? "Rewriting..." : "Rewrite with AI"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                  Original
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {result.original}
                </p>
              </div>
              <div className="bg-gray-900 border border-green-500/20 rounded-2xl p-5">
                <p className="text-xs text-green-400 mb-3 font-medium uppercase tracking-wider">
                  Rewritten
                </p>
                <p className="text-white text-sm leading-relaxed font-medium">
                  {result.rewritten}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                What was improved
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {result.explanation}
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                Tips
              </p>
              <ul className="flex flex-col gap-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold text-sm">{i + 1}.</span>
                    <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
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