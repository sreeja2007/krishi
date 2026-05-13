require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

connectDB();

const app = express();

app.use(cors({ 
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean), 
  credentials: true 
}));
app.use(express.json());
app.use('/api', apiLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/queries', require('./routes/queries'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/market', require('./routes/market'));
app.use('/api/weather', require('./routes/weather'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KrishiAI server running on port ${PORT}`));
