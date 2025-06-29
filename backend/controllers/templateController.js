const Template = require('../models/templateModel');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
// Cloudinary config (set your credentials in env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});





exports.createTemplate = async (req, res) => {
  try {
    // For multipart/form-data, fields are in req.body, file is in req.file
    const { name, description, templateIndex, category } = req.body;

    if (!name) return res.status(400).json({ error: 'Template name is required.' });
    if (!category) return res.status(400).json({ error: 'Category is required.' });
    if (typeof templateIndex === "undefined") return res.status(400).json({ error: 'Template index is required.' });

    const exists = await Template.findOne({ name });
    if (exists) return res.status(400).json({ error: 'Template with this name already exists.' });

    let thumbnailUrl = "";
    if (req.file) {
      // Upload image buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'resume_templates', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    const template = new Template({
      name,
      description,
      thumbnailUrl,
      templateIndex,
      category,
    });
    await template.save();
    res.json({ message: 'Template saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save template.' });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({});
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch templates.' });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the template by templateIndex (string or number)
    const template = await Template.findOne({ templateIndex: id });
    if (!template) return res.status(404).json({ error: 'Template not found.' });
    res.json({ template });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch template.' });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, templateIndex, category } = req.body;
    let update = { name, description, templateIndex, category };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'resume_templates', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      update.thumbnailUrl = uploadResult.secure_url;
    }

    const template = await Template.findByIdAndUpdate(id, update, { new: true });
    if (!template) return res.status(404).json({ error: 'Template not found.' });
    res.json({ message: 'Template updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update template.' });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndDelete(id);
    if (!template) return res.status(404).json({ error: 'Template not found.' });
    res.json({ message: 'Template deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete template.' });
  }
};
