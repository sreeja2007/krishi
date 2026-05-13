const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Tip: ensure MongoDB is running locally on 127.0.0.1:27017 or set a reachable MONGO_URI in server/.env');
    // Don't exit — let server start so Render health check passes
    setTimeout(connectDB, 5000); // retry after 5s
  }
};

module.exports = connectDB;
