const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  is_revoked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Session', sessionSchema); 