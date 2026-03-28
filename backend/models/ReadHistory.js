const mongoose = require('mongoose');

const ReadHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  url: { type: String, required: true },
  title: String,
  category: { type: String, default: "General" },
  // --- THE PIE CHART FIX ---
  source: { type: String, default: "Global News" }, 
  readAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadHistory', ReadHistorySchema);