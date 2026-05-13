const mongoose = require('mongoose');

const soilSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ph: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  organicMatter: { type: Number, default: 0 },
  moisture: { type: Number, default: 0 },
  aiRecommendation: { type: String, default: '' },
  fieldName: { type: String, default: 'Main Field' },
}, { timestamps: true });

module.exports = mongoose.model('SoilReport', soilSchema);
