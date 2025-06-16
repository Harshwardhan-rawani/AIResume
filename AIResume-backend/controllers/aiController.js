const OpenAI = require("openai");
const pdfParse = require("pdf-parse");
const Analysis = require("../models/analysisModel");
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to extract text from PDF buffer
async function extractTextFromPdf(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    return "";
  }
}

// POST /api/ai/analyze
exports.analyzeResume = async (req, res) => {
  try {
    let resumeText = "";
    let jobRole = "";
    let resumeName = "";
    let email = req.user?.email || "";

    if (req.file) {
      jobRole = req.body.jobRole;
      resumeName = req.file.originalname || "";
      resumeName = resumeName.replace(/\.[^/.]+$/, ""); // Remove file extension
      if (req.file.mimetype === "application/pdf") {
        resumeText = await extractTextFromPdf(req.file.buffer);
      } else if (req.file.mimetype === "text/plain") {
        resumeText = req.file.buffer.toString("utf-8");
      }
    }

    if (!resumeText || !jobRole) {
      return res.status(400).json({ error: "Resume text and job role are required." });
    }

    const prompt = `
You are an expert resume reviewer and career coach. Analyze the following resume for the target job role "${jobRole}". 
Give a score out of 100, list strengths, suggest improvements, and point out grammar/language issues. 
Return your response as a JSON object with keys: score (number), strengths (array), improvements (array), grammarFixes (array).

Resume:
${resumeText}
`;

    // Uncomment this for real OpenAI integration
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for resume analysis." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    let analysis;
    try {
      const match = aiResponse.match(/{[\s\S]*}/);
      analysis = match ? JSON.parse(match[0]) : null;
    } catch (err) {
      analysis = null;
    }

    // For demonstration, use a mock analysis object:
 

    if (!analysis) {
      return res.status(500).json({ error: "AI analysis failed. Please try again." });
    }

    // Save analysis to database using the correct model structure
    let userAnalysis = await Analysis.findOne({ email });
    const analysisEntry = {
      resumeName: resumeName,
      jobRole: jobRole,
      score: analysis.score || 0,
      grammarFixes: analysis.grammarFixes || [],
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      date: new Date()
    };

    if (userAnalysis) {
      userAnalysis.data.push(analysisEntry);
      await userAnalysis.save();
    } else {
      await Analysis.create({
        email,
        data: [analysisEntry]
      });
    }

    res.json({ analysis });

  } catch (err) {
    res.status(500).json({ error: "Failed to analyze resume." });
  }
};

// POST /api/ai/enhance
exports.enhanceText = async (req, res) => {
  try {
    // User info available as req.user if needed

    const { text } = req.body;
    console.log(text);
    if (!text) {
      return res.status(400).json({ error: 'No text provided.' });
    }

    const prompt = `
You are a professional resume optimization assistant. Given the following resume content, improve it by making it more professional, concise, and impactful. 
Use action verbs, quantifiable results (if possible), and remove unnecessary filler words. Do not change the original meaning. 
Return only the improved version of the text, with no explanation.

Resume Content:
"${text}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You help users enhance their resumes to improve professionalism and impact." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    const enhanced = completion.choices[0]?.message?.content?.trim() || text;

    res.json({ enhanced});

  } catch (err) {
    console.error("Enhance text error:", err);
    res.status(500).json({ error: 'AI enhancement failed.' });
  }
};



