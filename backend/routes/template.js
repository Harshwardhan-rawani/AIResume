// Template routes
const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token after "Bearer"

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user data to request if needed
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};
router.post('/templates',authenticateToken,upload.single('image'), templateController.createTemplate);
router.get('/templates',authenticateToken ,templateController.getTemplates);
router.get('/templates/:id',authenticateToken, templateController.getTemplateById);
router.put('/templates/:id',authenticateToken ,upload.single('image'), templateController.updateTemplate);
router.delete('/templates/:id',authenticateToken ,templateController.deleteTemplate);

module.exports = router;