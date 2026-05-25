import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../api/axios"

function ShowTip({ tip }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="text-xs text-blue-400 hover:text-blue-300 transition"
      >
        {show ? "Hide tip" : "Show tip"}
      </button>
      {show && (
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">{tip}</p>
      )}
    </div>
  )
}

export default function InterviewPage() {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [openIndex, setOpenIndex] = useState(null)
  const [answers, setAnswers] = useState({})
  const [reviews, setReviews] = useState({})
  const [reviewing, setReviewing] = useState({})
  const [listening, setListening] = useState({})
  const recognitionRef = useRef(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get(`/interview/${resumeId}`)
        setQuestions(data.questions)
        setFileName(data.fileName)
      } catch (err) {
        setError("Failed to load questions")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [resumeId])

  const handleGenerate = async () => {
    setGenerating(true)
    setError("")
    setAnswers({})
    setReviews({})
    try {
      const { data } = await api.post(`/interview/${resumeId}/generate`)
      setQuestions(data.questions)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate questions")
    } finally {
      setGenerating(false)
    }
  }

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }))
  }

  const handleReview = async (index, question) => {
    const answer = answers[index]
    if (!answer || answer.trim() === "") {
      alert("Please provide an answer first")
      return
    }
    setReviewing((prev) => ({ ...prev, [index]: true }))
    try {
      const { data } = await api.post("/interview/review/answer", {
        question,
        answer,
      })
      setReviews((prev) => ({ ...prev, [index]: data.review }))
    } catch (err) {
      setError("Failed to review answer")
    } finally {
      setReviewing((prev) => ({ ...prev, [index]: false }))
    }
  }

  const handleVoice = (index) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please use Chrome.")
      return
    }

    if (listening[index]) {
      recognitionRef.current?.stop()
      setListening((prev) => ({ ...prev, [index]: false }))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      let transcript = ""
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      handleAnswerChange(index, transcript)
    }

    recognition.onend = () => {
      setListening((prev) => ({ ...prev, [index]: false }))
    }

    recognition.start()
    recognitionRef.current = recognition
    setListening((prev) => ({ ...prev, [index]: true }))
  }

  const categoryColor = (category) => {
    if (category === "Technical") return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    if (category === "Behavioral") return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    if (category === "Situational") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    if (category === "HR") return "bg-green-500/10 text-green-400 border-green-500/20"
    return "bg-gray-700/50 text-gray-400 border-gray-700"
  }

  const difficultyColor = (difficulty) => {
    if (difficulty === "Easy") return "bg-green-500/10 text-green-400 border-green-500/20"
    if (difficulty === "Medium") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    if (difficulty === "Hard") return "bg-red-500/10 text-red-400 border-red-500/20"
    return "bg-gray-700/50 text-gray-400 border-gray-700"
  }

  const scoreColor = (score) => {
    if (score >= 8) return "text-green-400"
    if (score >= 5) return "text-yellow-400"
    return "text-red-400"
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
          onClick={() => navigate(`/resume/${resumeId}`)}
          className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition"
        >
          Back to Resume
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Mock Interview</h1>
            <p className="text-gray-500 text-sm mt-1 truncate max-w-sm">
              {fileName}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50 font-medium"
          >
            {generating
              ? "Generating..."
              : questions.length > 0
              ? "Regenerate"
              : "Generate Questions"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {generating && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center mb-6">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              Generating personalized questions...
            </p>
          </div>
        )}

        {questions.length === 0 && !generating && (
          <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-12 text-center">
            <p className="text-white font-semibold mb-2">
              Ready to practice?
            </p>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Click Generate Questions to get 10 personalized interview
              questions based on your resume.
            </p>
          </div>
        )}

        {questions.length > 0 && !generating && (
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
              {questions.length} questions — click to expand
            </p>

            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${categoryColor(q.category)}`}>
                        {q.category}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${difficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      {reviews[index] && (
                        <span className={`text-xs font-bold ${scoreColor(reviews[index].score)}`}>
                          Score: {reviews[index].score}/10
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  <span className="text-gray-600 text-lg shrink-0 mt-0.5">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {/* Expanded Content */}
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-gray-800 pt-5 flex flex-col gap-5">

                    {/* Tip */}
                    <ShowTip tip={q.tip} />

                    {/* Answer Input */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Your Answer
                        </p>
                        <button
                          onClick={() => handleVoice(index)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition border font-medium ${
                            listening[index]
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                          }`}
                        >
                          {listening[index] ? "Stop Recording" : "Speak Answer"}
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={answers[index] || ""}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Type your answer or click Speak Answer..."
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition placeholder-gray-600 resize-none"
                      />
                    </div>

                    <button
                      onClick={() => handleReview(index, q.question)}
                      disabled={reviewing[index]}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50 self-start font-medium"
                    >
                      {reviewing[index] ? "Reviewing..." : "Get AI Review"}
                    </button>

                    {/* Review Results */}
                    {reviews[index] && (
                      <div className="flex flex-col gap-3 pt-2 border-t border-gray-800">

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            AI Review
                          </p>
                          <p className={`text-2xl font-bold ${scoreColor(reviews[index].score)}`}>
                            {reviews[index].score}
                            <span className="text-gray-600 text-sm font-normal">/10</span>
                          </p>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1.5">Overall Feedback</p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {reviews[index].overallFeedback}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-gray-800/50 rounded-xl p-4">
                            <p className="text-xs text-green-400 mb-2 font-medium">
                              What was good
                            </p>
                            <ul className="flex flex-col gap-1.5">
                              {reviews[index].good.map((g, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-400 text-xs mt-0.5">+</span>
                                  <span className="text-gray-300 text-xs leading-relaxed">{g}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-gray-800/50 rounded-xl p-4">
                            <p className="text-xs text-red-400 mb-2 font-medium">
                              What was missing
                            </p>
                            <ul className="flex flex-col gap-1.5">
                              {reviews[index].missing.map((m, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-red-400 text-xs mt-0.5">-</span>
                                  <span className="text-gray-300 text-xs leading-relaxed">{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <p className="text-xs text-blue-400 mb-1.5 font-medium">
                            Ideal Answer
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {reviews[index].idealAnswer}
                          </p>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}