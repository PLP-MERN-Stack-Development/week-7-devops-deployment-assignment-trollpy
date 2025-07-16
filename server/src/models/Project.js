const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  githubRepo: String,
  owner: {
    type: String, // Clerk user ID
    required: true
  },
  members: [String], // Array of Clerk user IDs
  settings: {
    enableCI: {
      type: Boolean,
      default: true
    },
    enableLogs: {
      type: Boolean,
      default: true
    },
    enableUptime: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);