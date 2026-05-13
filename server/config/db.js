const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishiai';

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected (${mongoUri})`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Tip: ensure MongoDB is running locally on 127.0.0.1:27017 or set a reachable MONGO_URI in server/.env');
    process.exit(1);
  }
};

module.exports = connectDB;
