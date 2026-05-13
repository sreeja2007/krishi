const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  variety: { type: String, default: '' },
  sowingDate: { type: Date, required: true },
  fieldArea: { type: Number, required: true },
  currentStage: {
    type: String,
    enum: ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'],
    default: 'seedling',
  },
  stageHistory: [{ stage: String, date: Date, note: String }],
  status: { type: String, enum: ['active', 'harvested', 'failed'], default: 'active' },
  expectedHarvestDate: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
