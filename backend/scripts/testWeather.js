const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');

async function testWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const lat = 19.0760; // Mumbai
  const lon = 72.8777;
  console.log(`Testing OpenWeatherMap API for Mumbai...`);
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url, { timeout: 5000 });
    console.log('✅ Weather API is working!');
    console.log('Current Condition:', response.data.weather[0].description);
    console.log('Rain (1h):', response.data.rain ? response.data.rain['1h'] + ' mm/hr' : 'No rain');
  } catch (err) {
    console.error('❌ Weather API Error:', err.response ? err.response.data : err.message);
  }
}
testWeather();
