const axios = require('axios');

const getWeather = async (location) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const [current, forecast] = await Promise.all([
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`),
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=40`),
  ]);

  const daily = [];
  const seen = new Set();
  for (const item of forecast.data.list) {
    const date = item.dt_txt.split(' ')[0];
    if (!seen.has(date) && daily.length < 7) {
      seen.add(date);
      daily.push({
        date,
        temp: Math.round(item.main.temp),
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        wind: item.wind.speed,
      });
    }
  }

  return {
    current: {
      temp: Math.round(current.data.main.temp),
      feelsLike: Math.round(current.data.main.feels_like),
      humidity: current.data.main.humidity,
      wind: current.data.wind.speed,
      description: current.data.weather[0].description,
      icon: current.data.weather[0].icon,
      city: current.data.name,
    },
    forecast: daily,
  };
};

module.exports = { getWeather };
