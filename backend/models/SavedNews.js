const mongoose = require('mongoose');

const SavedNewsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  urlToImage: { type: String },
  source: { type: String },
  savedAt: { type: Date, default: Date.now }
});

// Prevents a user from saving the exact same URL twice
SavedNewsSchema.index({ userId: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('SavedNews', SavedNewsSchema);