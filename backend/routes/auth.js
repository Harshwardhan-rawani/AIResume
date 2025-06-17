const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Add/update user name
router.post('/user/update-name', authController.updateName);

// Change user password
router.post('/user/change-password', authController.changePassword);

module.exports = router;
