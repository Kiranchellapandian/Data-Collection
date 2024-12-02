// models/userdata.js

const mongoose = require('mongoose');

// Define schema for the user interaction data
const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'anonymous-user' }, // Added userId
  avgCursorSpeed: { type: Number, required: true },
  cursorAcceleration: { type: Number, required: true },
  pathDeviation: { type: Number, required: true },
  idleTime: { type: Number, required: true },
  jitter: { type: Number, required: true },
  clickPattern: { type: Number, default: 0 },
  typingSpeed: { type: Number, default: 0 },
  keyPressDuration: { type: Number, default: 0 },
  keyTransitionTime: { type: Number, default: 0 },
  errorRate: { type: Number, default: 0 },
  sessionDuration: { type: Number, default: 0 },
  pageNavigationPattern: { type: [String], default: [] },
  averageDwellTime: { type: Number, default: 0 },
  scrollBehavior: { type: Number, default: 0 },
}, { timestamps: true });

// Create and export the UserData model
const UserData = mongoose.model('UserData', userDataSchema);
module.exports = UserData;
