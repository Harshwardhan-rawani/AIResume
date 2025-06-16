const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  templateIndex: { // <-- replace componentCode with templateIndex
    type: String,
    required: true,
    unique:true,
  },
  category: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Template', templateSchema);
