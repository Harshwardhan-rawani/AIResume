const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  email: { type: String, required: true },
  data:[{
  resumeName: { type: String, required: true },
  jobRole: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date },
  grammarFixes: { type: [String], default: [] },
  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  grammarFixes: { type: [String], default: [] }
  }]

});

module.exports = mongoose.model('Analysis', analysisSchema);
