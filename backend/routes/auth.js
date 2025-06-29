const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

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

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Add/update user name
router.post('/user/update-name', requireAuth, authController.updateName);

// Change user password
router.post('/user/change-password', requireAuth, authController.changePassword);

module.exports = router;
