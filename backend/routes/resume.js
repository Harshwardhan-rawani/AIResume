const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const resumeController = require('../controllers/resumeController');

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

router.post('/create', requireAuth, resumeController.createResume);
router.post('/submit', requireAuth, resumeController.submitResume);
router.get('/get/:name', requireAuth, resumeController.getResumeByName);

// List all resumes for the logged-in user
router.get('/list', requireAuth, resumeController.listResumes);

// Delete a resume by name for the logged-in user
router.delete('/delete/:name', requireAuth, resumeController.deleteResume);

module.exports = router;
