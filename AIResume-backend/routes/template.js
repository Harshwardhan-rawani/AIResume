// Template routes
const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/templates', upload.single('image'), templateController.createTemplate);
router.get('/templates', templateController.getTemplates);
router.get('/templates/:id', templateController.getTemplateById);
router.put('/templates/:id', upload.single('image'), templateController.updateTemplate);
router.delete('/templates/:id', templateController.deleteTemplate);

module.exports = router;