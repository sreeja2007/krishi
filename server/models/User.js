const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, required: true },
  location: { type: String, default: '' },
  farmSize: { type: Number, default: 0 },
  preferredLanguage: { type: String, default: 'en', enum: ['en', 'hi', 'ta'] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
