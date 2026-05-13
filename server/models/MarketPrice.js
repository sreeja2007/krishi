const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'quintal' },
  market: { type: String, required: true },
  state: { type: String, required: true },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  priceHistory: [{ price: Number, date: Date }],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
