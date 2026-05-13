const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['pest', 'disease', 'weather', 'irrigation', 'market', 'general'], default: 'general' },
  severity: { type: String, enum: ['critical', 'warning', 'info'], default: 'info' },
  message: { type: String, required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
