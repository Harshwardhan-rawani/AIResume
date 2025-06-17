// AI Enhance endpoint
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Analysis = require('../models/analysisModel');

// --- Authentication Middleware ---
function requireAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
}

// Use multer upload for analyze endpoint
router.post('/analyze', requireAuth, upload.single('file'), aiController.analyzeResume);
router.post('/enhance', requireAuth, aiController.enhanceText);
//api/ai/analysis/history
router.get('/analysis/history', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const userAnalysis = await Analysis.findOne({ email });
    if (!userAnalysis || !Array.isArray(userAnalysis.data)) {
      return res.json({ history: [] });
    }
    res.json({ history: userAnalysis.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analysis history.' });
  }
});

// DELETE analysis entry by index (or by unique fields)
router.delete('/analysis/history', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const { resumeName, jobRole, date } = req.body;
    if (!resumeName || !jobRole || !date) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const userAnalysis = await Analysis.findOne({ email });
    if (!userAnalysis) return res.status(404).json({ error: 'No analysis found.' });

    const initialLength = userAnalysis.data.length;
    userAnalysis.data = userAnalysis.data.filter(
      (a) =>
        !(a.resumeName === resumeName &&
          a.jobRole === jobRole &&
          new Date(a.date).toISOString() === new Date(date).toISOString())
    );
    if (userAnalysis.data.length === initialLength) {
      return res.status(404).json({ error: 'Analysis entry not found.' });
    }
    await userAnalysis.save();
    res.json({ message: 'Analysis entry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete analysis entry.' });
  }
});

module.exports = router;