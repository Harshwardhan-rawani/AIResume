const express = require('express');
const router = express.Router();

const resumeController = require('../controllers/resumeController');

router.post('/create', resumeController.createResume);
router.post('/submit', resumeController.submitResume);
router.get('/get/:name', resumeController.getResumeByName);

// List all resumes for the logged-in user
router.get('/list', resumeController.listResumes);

// Delete a resume by name for the logged-in user
router.delete('/delete/:name', resumeController.deleteResume);

module.exports = router;
