require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();                            
const PORT = process.env.PORT || 3000;
const WEATHERSTACK_KEY = process.env.WEATHERSTACK_KEY;

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/weather', async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) return res.status(400).json({ ok: false, error: 'Debes proporcionar una localidad (query)' });
  if (!WEATHERSTACK_KEY) return res.status(500).json({ ok: false, error: 'Falta WEATHERSTACK_KEY en variables de entorno' });

  try {
    const url = 'http://api.weatherstack.com/current';
    const { data } = await axios.get(url, { params: { access_key: WEATHERSTACK_KEY, query } });

    if (data && data.success === false) {
      return res.status(400).json({ ok: false, error: data.error?.info || 'Error Weatherstack' });
    }
    if (!data?.current || !data?.location) {
      return res.status(404).json({ ok: false, error: 'No se encontró información de clima para esa localidad' });
    }

    res.json({
      ok: true,
      location: {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        localtime: data.location.localtime
      },
      current: {
        temperature: data.current.temperature,
        feelslike: data.current.feelslike,
        description: Array.isArray(data.current.weather_descriptions) ? data.current.weather_descriptions[0] : '',
        icon: Array.isArray(data.current.weather_icons) ? data.current.weather_icons[0] : '',
        humidity: data.current.humidity,
        wind_speed: data.current.wind_speed,
        precip: data.current.precip
      }
    });
  } catch (err) {
    console.error('Weather error:', err.message);
    res.status(502).json({ ok: false, error: 'Error al consultar el servicio de clima' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather app escuchando en http://localhost:${PORT}`);
});
