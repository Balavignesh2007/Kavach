const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

// GET /api/weather/live — fetch live weather from OpenWeatherMap
router.get('/live', protect, async (req, res) => {
  try {
    const city = req.worker.city;
    if (!city) {
      return res.status(400).json({ error: 'Worker has no registered city.' });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'OpenWeather API Key is not configured.' });
    }

    // Call OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},in&appid=${API_KEY}&units=metric`
    );

    res.json({
      success: true,
      weather: {
        temp: response.data.main.temp,
        humidity: response.data.main.humidity,
        description: response.data.weather[0]?.description,
        icon: response.data.weather[0]?.icon,
        windSpeed: response.data.wind.speed,
        city: response.data.name
      }
    });
  } catch (err) {
    console.error('Weather API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
