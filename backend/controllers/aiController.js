const pdfParse = require("pdf-parse");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RunnableSequence } = require("@langchain/core/runnables");
const { ChatOpenAI } = require("@langchain/openai");
const Analysis = require("../models/analysisModel");
const dotenv = require("dotenv");
dotenv.config();

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
   apiKey: process.env.OPENAI_API_KEY,
});

// Extract text from PDF
async function extractTextFromPdf(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch {
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
      resumeName = req.file.originalname.replace(/\.[^/.]+$/, "") || "";
      resumeText = req.file.mimetype === "application/pdf"
        ? await extractTextFromPdf(req.file.buffer)
        : req.file.buffer.toString("utf-8");
    }

    if (!resumeText || !jobRole) {
      return res.status(400).json({ error: "Resume text and job role are required." });
    }

    const prompt = PromptTemplate.fromTemplate(`
You are an expert resume reviewer and career coach. Analyze the following resume for the job role "${jobRole}".
Give a score out of 100, list strengths, suggest improvements, and point out grammar/language issues.

Return your response as a JSON object with the following keys:
- score (number)
- strengths (array of strings)
- improvements (array of strings)
- grammarFixes (array of strings)

Resume:
{resumeText}
    `);

    const chain = RunnableSequence.from([prompt, llm]);

    const result = await chain.invoke({ jobRole, resumeText });

    const aiResponse = result?.content || "";
    let analysis;
    try {
      const match = aiResponse.match(/{[\s\S]*}/);
      analysis = match ? JSON.parse(match[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      return res.status(500).json({ error: "AI analysis failed." });
    }

    const analysisEntry = {
      resumeName,
      jobRole,
      score: analysis.score || 0,
      grammarFixes: analysis.grammarFixes || [],
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      date: new Date()
    };

    let userAnalysis = await Analysis.findOne({ email });
    if (userAnalysis) {
      userAnalysis.data.push(analysisEntry);
      await userAnalysis.save();
    } else {
      await Analysis.create({ email, data: [analysisEntry] });
    }

    res.json({ analysis });

  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Failed to analyze resume." });
  }
};

// POST /api/ai/enhance
exports.enhanceText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided." });
    }

    const prompt = PromptTemplate.fromTemplate(`
You are a professional resume optimization assistant. Improve the following resume content by making it more professional, concise, and impactful.
Use action verbs, quantifiable results (if possible), and remove filler words. Keep the meaning intact.
Return only the improved version of the text, with no explanation.

Resume Content: "${text}"
    `);

    const chain = RunnableSequence.from([prompt, llm]);
    const result = await chain.invoke({ text });

    const enhanced = result?.content?.trim() || text;
    res.json({ enhanced });

  } catch (err) {
    console.error("Enhance error:", err);
    res.status(500).json({ error: "AI enhancement failed." });
  }
};
