const Resume = require('../models/resumeModel');
const jwt = require('jsonwebtoken');

function getEmailFromToken(req) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email;
  } catch {
    return null;
  }
}

// Submit the final resume data for a specific resume name
exports.submitResume = async (req, res) => {
  try {
    const { formData, resumename } = req.body;
    const email = getEmailFromToken(req);
    if (!email) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });

    const resumeName = resumename
    if (!resumeName) return res.status(400).json({ error: 'Resume name is required.' });

    let resume = await Resume.findOne({ email });
  
    if (!resume) {
      // If no resume doc for this user, create it with the first resume in data array
      resume = new Resume({
        email,
        data: [{ Name: resumeName, final: formData }]
      });
    } else {
      // Check if resume with this name exists in data array
      const idx = resume.data.findIndex(r => r.Name === resumeName);
      if (idx !== -1) {
        resume.data[idx].final = formData;
      } else {
        resume.data.push({ Name: resumeName, final: formData });
      }
    }
    await resume.save();
    res.json({ message: 'Resume submitted successfully.' });
  } catch (err) {
    console.error('Submit resume error:', err);
    res.status(500).json({ error: 'Failed to submit resume.' });
  }
};

// Create a new resume entry (just the name, no data yet)
exports.createResume = async (req, res) => {
  try {
    const { resumeName , category,selectedTemplateId } = req.body;

    const email = getEmailFromToken(req);

    if (!email) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });
    if (!resumeName) return res.status(400).json({ error: 'Project name is required.' });

    let resume = await Resume.findOne({ email });

    if (!resume) {
      // No resume doc for this user, create it with the first resume in data array
      resume = new Resume({
        email,
        data: [{ Name: resumeName, category,selectedTemplateId }]
      });
    } else {
      // Check if resume with this name exists in data array
      const exists = resume.data.some(r => r.Name === resumeName);
      if (exists) {
        return res.status(400).json({ error: 'Project with this name already exists.' });
      }
      resume.data.push({ Name: resumeName ,category,selectedTemplateId});
    }
    await resume.save();
    res.json({ message: 'Project created successfully.' });
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({ error: 'Failed to create resume.' });
  }
};

// Fetch a resume by name for the logged-in user
exports.getResumeByName = async (req, res) => {
  try {
    const email = getEmailFromToken(req);
   
    if (!email) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });
    const resumeName = req.params.name;
 
    if (!resumeName) return res.status(400).json({ error: 'Resume name is required.' });

    const resume = await Resume.findOne({ email });
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });

    const entry = resume.data.find(r => r.Name === resumeName);
   
    if (!entry) return res.status(404).json({ error: 'Resume not found.' });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume.' });
  }
};

// Fetch all resumes for the logged-in user
exports.listResumes = async (req, res) => {
  try {
    const email = getEmailFromToken(req);
    if (!email) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });

    const resume = await Resume.findOne({ email });
    if (!resume) return res.json({ resumes: [] });

    // Return all resume entries (Name, final, etc.)
    res.json({ resumes: resume.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes.' });
  }
};

// Delete a resume by name for the logged-in user
exports.deleteResume = async (req, res) => {
  try {
    const email = getEmailFromToken(req);
    if (!email) return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });
    const resumeName = req.params.name;
    if (!resumeName) return res.status(400).json({ error: 'Resume name is required.' });

    const resume = await Resume.findOne({ email });
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });

    const initialLength = resume.data.length;
    resume.data = resume.data.filter(r => r.Name !== resumeName);

    if (resume.data.length === initialLength) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    await resume.save();
    res.json({ message: 'Resume deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume.' });
  }
};
