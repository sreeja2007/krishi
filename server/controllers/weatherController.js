const { getWeather } = require('../services/weatherService');
const { getAIResponse } = require('../services/aiService');

exports.getWeatherData = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ message: 'Location required' });
    const data = await getWeather(location);
    res.json(data);
  } catch (err) {
    const status = err.response?.status === 404 ? 404 : 500;
    res.status(status).json({ message: status === 404 ? 'Location not found' : (err.message || 'Weather fetch failed') });
  }
};

exports.getIrrigationAdvice = async (req, res) => {
  try {
    const { location, crop } = req.query;
    if (!location) return res.status(400).json({ message: 'Location required' });
    const weatherData = await getWeather(location);
    const prompt = `Weather: ${weatherData.current.temp}°C, humidity ${weatherData.current.humidity}%, ${weatherData.current.description}. Crop: ${crop || 'general'}. Give specific irrigation advice for today and next 3 days. Be brief.`;
    const advice = await getAIResponse([{ role: 'user', content: prompt }]);
    res.json({ advice, weather: weatherData.current });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get irrigation advice' });
  }
};
