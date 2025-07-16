const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: String // Clerk user ID
}, {
  timestamps: true
});

// Index for efficient querying
logSchema.index({ service: 1, timestamp: -1 });
logSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);