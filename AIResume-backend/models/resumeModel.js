const mongoose = require('mongoose');

// Define the subdocument schema for a single resume entry
const resumeEntrySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  category: { type: String},
  modified : { type: Date, default: Date.now }, 

  score : { type: Number, default: 0 },
  selectedTemplateId: { type: String }, 
   // category for the resume
  final: { type: mongoose.Schema.Types.Mixed,default: {} }, // Store the final resume data as a mixed type
}, { _id: false }); 

const resumeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  data: {
    type: [resumeEntrySchema],
    default: [],
  }
});

// Compound index: each resume name must be unique per email
resumeSchema.index({ email: 1, 'data.Name': 1 }, { unique: true });

module.exports = mongoose.model('Resume', resumeSchema);
