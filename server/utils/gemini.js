const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to clean and parse JSON from Gemini response
const parseJSON = (text) => {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned);
};

// Analyze resume for ATS score
const analyzeResumeATS = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert ATS (Applicant Tracking System) and HR professional.
Analyze the following resume and return a JSON object ONLY with no extra text.

Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Return this exact JSON structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJSON(text);
};

// Generate interview questions
const generateInterviewQuestions = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert technical recruiter and interview coach.
Based on the resume below, generate 10 targeted interview questions.
Return a JSON array ONLY with no extra text.

Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Return this exact JSON structure:
[
  {
    "category": "<Technical | Behavioral | Situational | HR>",
    "question": "<the interview question>",
    "difficulty": "<Easy | Medium | Hard>",
    "tip": "<1-2 sentence tip on how to answer>"
  }
]

Mix: 4 Technical, 3 Behavioral, 2 Situational, 1 HR.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJSON(text);
};

// Match resume against a job description
const matchJobDescription = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert ATS and recruitment specialist.
Compare the resume against the job description and return a JSON object ONLY with no extra text.

Resume:
"""
${resumeText.slice(0, 4000)}
"""

Job Description:
"""
${jobDescription.slice(0, 4000)}
"""

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence summary of how well the resume matches>",
  "matchedSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "missingSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJSON(text);
};

// Rewrite Resume Bullet Point
const rewriteBulletPoint = async (bulletPoint, jobRole) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert resume writer and career coach.
Rewrite the following resume bullet point to make it stronger, more impactful, and ATS friendly.
Return a JSON object ONLY with no extra text.

Original Bullet Point:
"${bulletPoint}"

Job Role (for context):
"${jobRole}"

Return this exact JSON structure:
{
  "original": "${bulletPoint}",
  "rewritten": "<improved bullet point>",
  "explanation": "<1-2 sentences explaining what was improved>",
  "tips": ["<tip 1>", "<tip 2>"]
}

Rules for rewriting:
- Start with a strong action verb
- Add metrics or numbers if possible
- Make it specific and results oriented
- Keep it under 2 lines
- Make it ATS friendly
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJSON(text);
};

// Review interview answer
const reviewAnswer = async (question, answer) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert interview coach.
Review the following interview answer and return a JSON object ONLY with no extra text.

Question: "${question}"
Candidate's Answer: "${answer}"

Return this exact JSON structure:
{
  "score": <number 1-10>,
  "good": ["<what was good 1>", "<what was good 2>"],
  "missing": ["<what was missing 1>", "<what was missing 2>"],
  "idealAnswer": "<a sample ideal answer for this question>",
  "overallFeedback": "<2-3 sentence overall feedback>"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseJSON(text);
};

module.exports = { analyzeResumeATS, generateInterviewQuestions, matchJobDescription, rewriteBulletPoint, reviewAnswer };