import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-800/8 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-gray-800/50 px-6 py-4 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-white font-bold text-lg">PrepAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm transition px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2.5 rounded-lg transition font-medium"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
        <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          Powered by Google Gemini AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Land your dream job with{" "}
          <span className="text-blue-400">
            AI-powered
          </span>{" "}
          interview prep
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your resume, get an instant ATS score, practice with
          AI-generated interview questions, and get feedback on your answers
          — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition text-sm"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-8 py-3.5 rounded-lg font-semibold transition text-sm"
          >
            Sign in
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 pt-10 border-t border-gray-800/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">ATS</p>
            <p className="text-gray-500 text-xs mt-1">Score Analysis</p>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">10+</p>
            <p className="text-gray-500 text-xs mt-1">Interview Questions</p>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">AI</p>
            <p className="text-gray-500 text-xs mt-1">Answer Review</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-gray-800/50">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            Everything you need to ace your interview
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            PrepAI combines resume analysis, interview practice, and AI feedback
            into one simple tool.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors duration-300">
            <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5">
              <span className="text-blue-400 text-xs font-bold">ATS</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Resume ATS Analyzer
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get an instant ATS compatibility score with detailed strengths,
              weaknesses, keywords, and actionable suggestions to improve
              your resume.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors duration-300">
            <div className="w-11 h-11 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-5">
              <span className="text-green-400 text-xs font-bold">MIC</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              AI Mock Interview
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Practice with personalized interview questions based on your
              resume. Answer by typing or voice and get instant AI feedback
              with a score out of 10.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors duration-300">
            <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-5">
              <span className="text-purple-400 text-xs font-bold">JD</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Job Description Matcher
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Paste any job description and instantly see how well your
              resume matches it, what skills are missing, and how to
              improve your chances.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors duration-300">
            <div className="w-11 h-11 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mb-5">
              <span className="text-yellow-400 text-xs font-bold">AI</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Bullet Point Rewriter
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Paste a weak resume bullet point and get an AI rewritten
              version with strong action verbs, metrics, and ATS friendly
              language.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors duration-300">
            <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-5">
              <span className="text-red-400 text-xs font-bold">VC</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Voice Answers
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Answer interview questions using your voice. Our speech
              recognition converts your spoken answer to text and sends
              it for AI review instantly.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors duration-300">
            <div className="w-11 h-11 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-5">
              <span className="text-cyan-400 text-xs font-bold">DB</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Progress Dashboard
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track all your resumes, ATS scores, and interview sessions
              in one clean dashboard with your average and best scores.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-gray-800/50">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
          <p className="text-gray-400 text-sm">Get started in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Upload Resume</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Upload your resume as a PDF. Our system extracts
              the text automatically in seconds.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Get AI Analysis</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Gemini AI analyzes your resume and gives you a
              detailed ATS score with feedback.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Practice & Improve</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Answer AI interview questions by voice or text
              and get instant detailed feedback.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-gray-800/50">
        <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to land your dream job?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Start analyzing your resume and practicing interviews with
            AI today. It's completely free.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-lg font-semibold transition text-sm inline-block"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-gray-500 text-sm font-medium">PrepAI</span>
          </div>
          <span className="text-gray-600 text-xs">
            Built with React, Node.js and Gemini AI
          </span>
        </div>
      </footer>

    </div>
  )
}