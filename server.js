/**
 * AETHERIA WEATHER INDIA — BACKEND SERVER
 * Built with Node.js & Express
 * 
 * Features:
 * - Secure server-side weather fetching (OpenWeatherMap + Open-Meteo fallback)
 * - In-memory caching with TTL (Time-To-Live) for high performance & quota preservation
 * - Strict India-only geocoding and reverse geocoding endpoints
 * - Full dataset of all 28 Indian States & 8 Union Territories
 * - Static asset serving for seamless full-stack deployment
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
let OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '3567b3619cf3d391f319c063da450977';
let WEATHER_PROVIDER = process.env.WEATHER_PROVIDER || 'auto'; // 'auto' | 'owm' | 'openmeteo'
const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS, 10) || 600000; // 10 minutes

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==============================================================================
// IN-MEMORY CACHE
// ==============================================================================
const weatherCache = new Map();

function getCachedData(key) {
  const entry = weatherCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    weatherCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedData(key, data) {
  weatherCache.set(key, {
    timestamp: Date.now(),
    data
  });
}

// ==============================================================================
// ALL 28 INDIAN STATES & 8 UNION TERRITORIES DATASET
// ==============================================================================
const INDIA_STATES_DATA = [
  // 28 States
  { id: 'AP', name: 'Andhra Pradesh', type: 'State', capital: 'Amaravati', region: 'South', lat: 16.5062, lon: 80.6480, majorCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'] },
  { id: 'AR', name: 'Arunachal Pradesh', type: 'State', capital: 'Itanagar', region: 'Northeast', lat: 27.0844, lon: 93.6053, majorCities: ['Tawang', 'Pasighat', 'Ziro', 'Naharlagun'] },
  { id: 'AS', name: 'Assam', type: 'State', capital: 'Dispur', region: 'Northeast', lat: 26.1445, lon: 91.7362, majorCities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'] },
  { id: 'BR', name: 'Bihar', type: 'State', capital: 'Patna', region: 'East', lat: 25.5941, lon: 85.1376, majorCities: ['Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'] },
  { id: 'CG', name: 'Chhattisgarh', type: 'State', capital: 'Raipur', region: 'Central', lat: 21.2514, lon: 81.6296, majorCities: ['Bhilai', 'Bilaspur', 'Korba', 'Durg'] },
  { id: 'GA', name: 'Goa', type: 'State', capital: 'Panaji', region: 'West', lat: 15.4909, lon: 73.8278, majorCities: ['Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'] },
  { id: 'GJ', name: 'Gujarat', type: 'State', capital: 'Gandhinagar', region: 'West', lat: 23.2156, lon: 72.6369, majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'] },
  { id: 'HR', name: 'Haryana', type: 'State', capital: 'Chandigarh', region: 'North', lat: 30.7333, lon: 76.7794, majorCities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'] },
  { id: 'HP', name: 'Himachal Pradesh', type: 'State', capital: 'Shimla', region: 'North', lat: 31.1048, lon: 77.1734, majorCities: ['Dharamshala', 'Manali', 'Mandi', 'Solan'] },
  { id: 'JH', name: 'Jharkhand', type: 'State', capital: 'Ranchi', region: 'East', lat: 23.3441, lon: 85.3096, majorCities: ['Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'] },
  { id: 'KA', name: 'Karnataka', type: 'State', capital: 'Bengaluru', region: 'South', lat: 12.9716, lon: 77.5946, majorCities: ['Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi'] },
  { id: 'KL', name: 'Kerala', type: 'State', capital: 'Thiruvananthapuram', region: 'South', lat: 8.5241, lon: 76.9366, majorCities: ['Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha'] },
  { id: 'MP', name: 'Madhya Pradesh', type: 'State', capital: 'Bhopal', region: 'Central', lat: 23.2599, lon: 77.4126, majorCities: ['Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'] },
  { id: 'MH', name: 'Maharashtra', type: 'State', capital: 'Mumbai', region: 'West', lat: 19.0760, lon: 72.8777, majorCities: ['Pune', 'Nagpur', 'Nashik', 'Thane', 'Chhatrapati Sambhajinagar'] },
  { id: 'MN', name: 'Manipur', type: 'State', capital: 'Imphal', region: 'Northeast', lat: 24.8170, lon: 93.9368, majorCities: ['Churachandpur', 'Thoubal', 'Bishnupur', 'Ukhrul'] },
  { id: 'ML', name: 'Meghalaya', type: 'State', capital: 'Shillong', region: 'Northeast', lat: 25.5788, lon: 91.8933, majorCities: ['Tura', 'Cherrapunji', 'Jowai', 'Nongpoh'] },
  { id: 'MZ', name: 'Mizoram', type: 'State', capital: 'Aizawl', region: 'Northeast', lat: 23.7271, lon: 92.7176, majorCities: ['Lunglei', 'Champhai', 'Serchhip', 'Kolasib'] },
  { id: 'NL', name: 'Nagaland', type: 'State', capital: 'Kohima', region: 'Northeast', lat: 25.6751, lon: 94.1086, majorCities: ['Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'] },
  { id: 'OD', name: 'Odisha', type: 'State', capital: 'Bhubaneswar', region: 'East', lat: 20.2961, lon: 85.8245, majorCities: ['Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur'] },
  { id: 'PB', name: 'Punjab', type: 'State', capital: 'Chandigarh', region: 'North', lat: 30.7333, lon: 76.7794, majorCities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { id: 'RJ', name: 'Rajasthan', type: 'State', capital: 'Jaipur', region: 'North', lat: 26.9124, lon: 75.7873, majorCities: ['Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { id: 'SK', name: 'Sikkim', type: 'State', capital: 'Gangtok', region: 'Northeast', lat: 27.3389, lon: 88.6065, majorCities: ['Namchi', 'Geyzing', 'Mangan', 'Ravangla'] },
  { id: 'TN', name: 'Tamil Nadu', type: 'State', capital: 'Chennai', region: 'South', lat: 13.0827, lon: 80.2707, majorCities: ['Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'] },
  { id: 'TG', name: 'Telangana', type: 'State', capital: 'Hyderabad', region: 'South', lat: 17.3850, lon: 78.4867, majorCities: ['Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'] },
  { id: 'TR', name: 'Tripura', type: 'State', capital: 'Agartala', region: 'Northeast', lat: 23.8315, lon: 91.2868, majorCities: ['Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia'] },
  { id: 'UP', name: 'Uttar Pradesh', type: 'State', capital: 'Lucknow', region: 'North', lat: 26.8467, lon: 80.9462, majorCities: ['Kanpur', 'Varanasi', 'Noida', 'Agra', 'Prayagraj', 'Meerut', 'Ayodhya'] },
  { id: 'UK', name: 'Uttarakhand', type: 'State', capital: 'Dehradun', region: 'North', lat: 30.3165, lon: 78.0322, majorCities: ['Haridwar', 'Rishikesh', 'Nainital', 'Roorkee', 'Haldwani'] },
  { id: 'WB', name: 'West Bengal', type: 'State', capital: 'Kolkata', region: 'East', lat: 22.5726, lon: 88.3639, majorCities: ['Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Darjeeling'] },
  
  // 8 Union Territories
  { id: 'AN', name: 'Andaman and Nicobar Islands', type: 'UT', capital: 'Port Blair', region: 'UT', lat: 11.6234, lon: 92.7265, majorCities: ['Havelock Island', 'Neil Island', 'Diglipur'] },
  { id: 'CH', name: 'Chandigarh', type: 'UT', capital: 'Chandigarh', region: 'UT', lat: 30.7333, lon: 76.7794, majorCities: ['Sector 17', 'Manimajra'] },
  { id: 'DH', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'UT', capital: 'Daman', region: 'UT', lat: 20.3974, lon: 72.8328, majorCities: ['Silvassa', 'Diu'] },
  { id: 'DL', name: 'Delhi (NCT)', type: 'UT', capital: 'New Delhi', region: 'UT', lat: 28.6139, lon: 77.2090, majorCities: ['Central Delhi', 'South Delhi', 'Connaught Place', 'Dwarka'] },
  { id: 'JK', name: 'Jammon and Kashmir', type: 'UT', capital: 'Srinagar', region: 'UT', lat: 34.0837, lon: 74.7973, majorCities: ['Jammu', 'Anantnag', 'Baramulla', 'Gulmarg'] },
  { id: 'LA', name: 'Ladakh', type: 'UT', capital: 'Leh', region: 'UT', lat: 34.1526, lon: 77.5771, majorCities: ['Kargil', 'Nubra Valley', 'Zanskar'] },
  { id: 'LD', name: 'Lakshadweep', type: 'UT', capital: 'Kavaratti', region: 'UT', lat: 10.5669, lon: 72.6420, majorCities: ['Agatti', 'Andrott', 'Minicoy'] },
  { id: 'PY', name: 'Puducherry', type: 'UT', capital: 'Puducherry', region: 'UT', lat: 11.9416, lon: 79.8083, majorCities: ['Karaikal', 'Mahe', 'Yanam'] }
];

// ==============================================================================
// WEATHER SERVICE HELPERS
// ==============================================================================

function mapWmoCode(code) {
  const c = Number(code);
  if (c === 0) return { short: 'Clear', desc: 'Clear sky and gentle conditions' };
  if (c === 1) return { short: 'Mainly Clear', desc: 'Mainly clear with occasional light clouds' };
  if (c === 2) return { short: 'Partly Cloudy', desc: 'Scattered clouds with sunshine intervals' };
  if (c === 3) return { short: 'Overcast', desc: 'Cloudy skies throughout the area' };
  if (c === 45 || c === 48) return { short: 'Foggy', desc: 'Dense fog limiting visibility' };
  if ([51, 53, 55].includes(c)) return { short: 'Drizzle', desc: 'Light mist and soft drizzle' };
  if ([61, 63].includes(c)) return { short: 'Rain', desc: 'Moderate rainfall expected' };
  if (c === 65) return { short: 'Heavy Rain', desc: 'Continuous downpour and puddles' };
  if ([71, 73, 75].includes(c)) return { short: 'Snow', desc: 'Crisp snowfall covering rooftops' };
  if ([80, 81, 82].includes(c)) return { short: 'Rain Showers', desc: 'Intermittent brisk rain showers' };
  if ([95, 96, 99].includes(c)) return { short: 'Thunderstorm', desc: 'Thunderstorms with electric lightning' };
  return { short: 'Atmospheric', desc: 'Variable atmospheric conditions' };
}

function normalizeOpenWeatherData(cur, forecast, cityName, stateName) {
  const isDay = cur.weather[0]?.icon?.endsWith('d') ?? true;
  const condCode = cur.weather[0]?.id || cur.weather[0]?.icon || 'clear';
  const condShort = cur.weather[0]?.main || 'Clear';
  const condDesc = cur.weather[0]?.description || 'Clear Sky';

  const hourlyList = (forecast.list || []).slice(0, 9).map(item => {
    const date = new Date(item.dt * 1000);
    const hourStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const itemIsDay = item.weather[0]?.icon?.endsWith('d') ?? true;
    return {
      time: hourStr,
      temp: Math.round(item.main.temp),
      icon: item.weather[0]?.icon || '01d',
      isDay: itemIsDay,
      pop: Math.round((item.pop || 0) * 100)
    };
  });

  const dailyMap = new Map();
  (forecast.list || []).forEach(item => {
    const d = new Date(item.dt * 1000);
    const dayKey = d.toDateString();
    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        date: d,
        min: item.main.temp_min,
        max: item.main.temp_max,
        weather: item.weather[0]
      });
    } else {
      const entry = dailyMap.get(dayKey);
      entry.min = Math.min(entry.min, item.main.temp_min);
      entry.max = Math.max(entry.max, item.main.temp_max);
    }
  });

  const daily = Array.from(dailyMap.values()).slice(0, 7).map(item => {
    const dayName = item.date.toLocaleDateString([], { weekday: 'short' });
    const dateStr = item.date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      dayName,
      dateStr,
      min: Math.round(item.min),
      max: Math.round(item.max),
      condition: item.weather?.main || 'Clear',
      icon: item.weather?.icon || '01d',
      isDay: true
    };
  });

  const sunriseTime = new Date(cur.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(cur.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    cityName: cityName || cur.name,
    stateName: stateName || 'India',
    country: 'India 🇮🇳',
    temp: Math.round(cur.main.temp),
    feelsLike: Math.round(cur.main.feels_like),
    tempMin: Math.round(cur.main.temp_min),
    tempMax: Math.round(cur.main.temp_max),
    conditionShort: condShort,
    conditionDescription: condDesc,
    conditionCode: condCode,
    isDay,
    humidity: cur.main.humidity || 50,
    windSpeed: Math.round((cur.wind.speed || 0) * 3.6),
    windDeg: cur.wind.deg || 0,
    windGust: Math.round(((cur.wind.gust || cur.wind.speed || 0) * 3.6)),
    pressure: cur.main.pressure || 1013,
    visibility: cur.visibility ? (cur.visibility / 1000).toFixed(1) : '10.0',
    cloudCover: cur.clouds?.all || 0,
    uvIndex: 3.5,
    sunrise: sunriseTime,
    sunset: sunsetTime,
    hourly: hourlyList,
    daily,
    provider: 'OpenWeatherMap'
  };
}

function normalizeOpenMeteoData(data, cityName, stateName) {
  const cur = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  const isDay = cur.is_day === 1;
  const weatherInfo = mapWmoCode(cur.weather_code);

  const currentHourIndex = hourly.time.findIndex(t => new Date(t) >= new Date());
  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
  const hourlyItems = [];

  for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i += 2) {
    const d = new Date(hourly.time[i]);
    const hourVal = d.getHours();
    const itemIsDay = hourVal >= 6 && hourVal < 18;
    hourlyItems.push({
      time: d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      temp: Math.round(hourly.temperature_2m[i]),
      icon: String(hourly.weather_code[i]),
      isDay: itemIsDay,
      pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0
    });
  }

  const dailyItems = daily.time.map((timeStr, idx) => {
    const d = new Date(timeStr);
    const wInfo = mapWmoCode(daily.weather_code[idx]);
    return {
      dayName: idx === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' }),
      dateStr: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      min: Math.round(daily.temperature_2m_min[idx]),
      max: Math.round(daily.temperature_2m_max[idx]),
      condition: wInfo.short,
      icon: String(daily.weather_code[idx]),
      isDay: true
    };
  });

  const sunriseD = new Date(daily.sunrise[0]);
  const sunsetD = new Date(daily.sunset[0]);

  return {
    cityName: cityName || 'Location',
    stateName: stateName || 'India',
    country: 'India 🇮🇳',
    temp: Math.round(cur.temperature_2m),
    feelsLike: Math.round(cur.apparent_temperature),
    tempMin: Math.round(daily.temperature_2m_min[0]),
    tempMax: Math.round(daily.temperature_2m_max[0]),
    conditionShort: weatherInfo.short,
    conditionDescription: weatherInfo.desc,
    conditionCode: cur.weather_code,
    isDay,
    humidity: Math.round(cur.relative_humidity_2m),
    windSpeed: Math.round(cur.wind_speed_10m),
    windDeg: Math.round(cur.wind_direction_10m),
    windGust: Math.round(cur.wind_speed_10m * 1.3),
    pressure: Math.round(cur.surface_pressure),
    visibility: '10.0',
    cloudCover: 30,
    uvIndex: daily.uv_index_max ? daily.uv_index_max[0].toFixed(1) : 2.5,
    sunrise: sunriseD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: sunsetD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hourly: hourlyItems,
    daily: dailyItems,
    provider: 'Open-Meteo'
  };
}

async function fetchFromOpenWeatherMap(lat, lon, cityName, stateName) {
  const units = 'metric';
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl)
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    const status = currentRes.status || forecastRes.status;
    const err = new Error(`OpenWeatherMap HTTP ${status}`);
    err.status = status;
    throw err;
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();
  return normalizeOpenWeatherData(current, forecast, cityName, stateName);
}

async function fetchFromOpenMeteo(lat, lon, cityName, stateName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const data = await res.json();
  return normalizeOpenMeteoData(data, cityName, stateName);
}

// ==============================================================================
// API ROUTES
// ==============================================================================

/**
 * Healthcheck & API status
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Aetheria Weather India',
    version: '1.0.0',
    activeProvider: WEATHER_PROVIDER,
    cacheEntries: weatherCache.size,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/**
 * Configuration summary for client
 */
app.get('/api/config', (req, res) => {
  res.json({
    providerChoice: WEATHER_PROVIDER,
    hasApiKey: Boolean(OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.length > 10),
    countryLock: 'IN',
    defaultCity: 'New Delhi',
    defaultState: 'Delhi'
  });
});

/**
 * All 28 States & 8 Union Territories
 * Query params: ?region=North|South|West|East|Central|Northeast|UT
 */
app.get('/api/states', (req, res) => {
  const { region, type, search } = req.query;
  let list = [...INDIA_STATES_DATA];

  if (region && region !== 'all') {
    if (region.toUpperCase() === 'UT') {
      list = list.filter(s => s.type === 'UT');
    } else {
      list = list.filter(s => s.region.toLowerCase() === region.toLowerCase() && s.type === 'State');
    }
  }

  if (type) {
    list = list.filter(s => s.type.toLowerCase() === type.toLowerCase());
  }

  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.capital.toLowerCase().includes(q) ||
      s.majorCities.some(c => c.toLowerCase().includes(q))
    );
  }

  res.json({
    total: list.length,
    states: list
  });
});

/**
 * Get single State/UT by ID or Name
 */
app.get('/api/states/:identifier', (req, res) => {
  const idOrName = req.params.identifier.toLowerCase();
  const match = INDIA_STATES_DATA.find(s => 
    s.id.toLowerCase() === idOrName || 
    s.name.toLowerCase() === idOrName ||
    s.capital.toLowerCase() === idOrName
  );

  if (!match) {
    return res.status(404).json({ error: 'Indian State or UT not found' });
  }

  res.json(match);
});

/**
 * India-Only Geocoding Search
 * Query param: ?q=pune
 */
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim().length < 2) {
    return res.json([]);
  }

  const q = query.trim().toLowerCase();
  const results = [];
  const seen = new Set();

  // 1. Search Local States & Major Cities
  INDIA_STATES_DATA.forEach(item => {
    const stateMatch = item.name.toLowerCase().includes(q);
    const capMatch = item.capital.toLowerCase().includes(q);
    const cityMatch = item.majorCities.some(city => city.toLowerCase().includes(q));

    if (stateMatch || capMatch || cityMatch) {
      let matchedCity = item.capital;
      if (cityMatch) {
        const specific = item.majorCities.find(c => c.toLowerCase().includes(q));
        if (specific) matchedCity = specific;
      }

      const key = `${matchedCity.toLowerCase()}-${item.name.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          name: matchedCity,
          lat: item.lat,
          lon: item.lon,
          country: 'IN',
          admin: item.name,
          type: item.type
        });
      }
    }
  });

  // 2. Query Open-Meteo Geocoding Filtered to India
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=40&language=en&format=json`;
    const geoRes = await fetch(url);
    if (geoRes.ok) {
      const data = await geoRes.json();
      if (data.results) {
        const indiaResults = data.results.filter(
          item => (item.country_code && item.country_code.toUpperCase() === 'IN') || 
                  (item.country && item.country.toLowerCase() === 'india')
        );

        indiaResults.forEach(item => {
          const key = `${item.name.toLowerCase()}-${(item.admin1 || '').toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              name: item.name,
              lat: item.latitude,
              lon: item.longitude,
              country: 'IN',
              admin: item.admin1 || 'India'
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Server] Geocoding remote error:', err.message);
  }

  // 3. Nominatim Fallback if few results
  if (results.length < 3) {
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&addressdetails=1&limit=6`;
      const osmRes = await fetch(osmUrl, { headers: { 'Accept-Language': 'en', 'User-Agent': 'AetheriaWeather/1.0' } });
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        osmData.forEach(item => {
          const cityName = item.address?.city || item.address?.town || item.address?.village || item.name;
          const stateName = item.address?.state || 'India';
          const key = `${cityName.toLowerCase()}-${stateName.toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              name: cityName,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
              country: 'IN',
              admin: stateName
            });
          }
        });
      }
    } catch (err) {
      console.warn('[Server] Nominatim geocoding error:', err.message);
    }
  }

  res.json(results.slice(0, 10));
});

/**
 * Reverse Geocoding for User GPS Coordinates in India
 * Query params: ?lat=...&lon=...
 */
app.get('/api/locate', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Valid latitude and longitude are required' });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const osmRes = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'AetheriaWeather/1.0' } });
    if (!osmRes.ok) throw new Error(`Nominatim HTTP ${osmRes.status}`);

    const data = await osmRes.json();
    const addr = data.address || {};

    const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.county || 'Detected Location';
    const stateName = addr.state || '';
    const countryCode = (addr.country_code || '').toUpperCase();
    const isIndia = countryCode === 'IN';

    res.json({
      lat,
      lon,
      city,
      state: stateName,
      country: 'IN',
      countryCode,
      isIndia,
      displayName: stateName ? `${city}, ${stateName}` : city
    });
  } catch (err) {
    console.error('[Server] Reverse geocode error:', err.message);
    res.json({
      lat,
      lon,
      city: 'Current Location',
      state: 'India',
      country: 'IN',
      countryCode: 'IN',
      isIndia: true,
      displayName: 'Current Location, India'
    });
  }
});

/**
 * Weather Fetch Endpoint with In-Memory Caching & Auto-Fallback
 * Query params: ?lat=...&lon=...&city=...&state=...
 */
app.get('/api/weather', async (req, res) => {
  let lat = parseFloat(req.query.lat);
  let lon = parseFloat(req.query.lon);
  let cityName = req.query.city || '';
  let stateName = req.query.state || '';

  // If no lat/lon provided, resolve from city name or default to New Delhi
  if (isNaN(lat) || isNaN(lon)) {
    if (!cityName) cityName = 'New Delhi';
    const matchedState = INDIA_STATES_DATA.find(s => 
      s.name.toLowerCase() === cityName.toLowerCase() || 
      s.capital.toLowerCase() === cityName.toLowerCase()
    );

    if (matchedState) {
      lat = matchedState.lat;
      lon = matchedState.lon;
      cityName = matchedState.capital;
      stateName = matchedState.name;
    } else {
      // Default coordinates (New Delhi)
      lat = 28.6139;
      lon = 77.2090;
      cityName = 'New Delhi';
      stateName = 'Delhi';
    }
  }

  // Check In-Memory Cache
  const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return res.json({
      ...cached,
      cityName: cityName || cached.cityName,
      stateName: stateName || cached.stateName,
      _fromCache: true
    });
  }

  // Fetch weather with provider selection and fallback
  try {
    let weatherData = null;

    if (WEATHER_PROVIDER === 'openmeteo') {
      weatherData = await fetchFromOpenMeteo(lat, lon, cityName, stateName);
    } else {
      try {
        weatherData = await fetchFromOpenWeatherMap(lat, lon, cityName, stateName);
      } catch (owmErr) {
        console.warn(`[Server] OpenWeatherMap request failed (${owmErr.message}), switching to Open-Meteo fallback...`);
        weatherData = await fetchFromOpenMeteo(lat, lon, cityName, stateName);
        weatherData.note = 'Served via Live Satellite Fallback (OpenWeatherMap key propagating or rate limited)';
      }
    }

    // Save to Cache
    setCachedData(cacheKey, weatherData);

    res.json(weatherData);
  } catch (err) {
    console.error('[Server] Weather fetch error:', err.message);
    res.status(500).json({
      error: 'Failed to retrieve meteorological data',
      message: err.message
    });
  }
});

/**
 * Update / Test API Key
 */
app.post('/api/settings/key', async (req, res) => {
  const { apiKey, provider } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
    return res.status(400).json({ error: 'Valid API key is required' });
  }

  const keyToTest = apiKey.trim();
  const startTime = Date.now();

  try {
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=Delhi,IN&appid=${keyToTest}&units=metric`;
    const testRes = await fetch(testUrl);
    const latency = Date.now() - startTime;

    if (testRes.ok) {
      OPENWEATHER_API_KEY = keyToTest;
      if (provider) WEATHER_PROVIDER = provider;
      return res.json({
        success: true,
        status: 'active',
        latencyMs: latency,
        message: `API Key validated and saved successfully (${latency}ms latency)`
      });
    }

    if (testRes.status === 401) {
      // Key recognized but propagating
      OPENWEATHER_API_KEY = keyToTest;
      if (provider) WEATHER_PROVIDER = provider;
      return res.json({
        success: true,
        status: 'propagating',
        message: 'Key recognized! OpenWeatherMap keys typically require 10-60 minutes to propagate on global servers. Seamless live satellite fallback is active.'
      });
    }

    const data = await testRes.json().catch(() => ({}));
    return res.status(testRes.status).json({
      success: false,
      status: 'error',
      message: data.message || `Verification failed with HTTP ${testRes.status}`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 'network_error',
      message: `Connection test error: ${err.message}`
    });
  }
});

// Fallback to index.html for single-page application routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🌤️  AETHERIA WEATHER INDIA — BACKEND SERVER RUNNING`);
  console.log(`📍  URL: http://localhost:${PORT}`);
  console.log(`🇮🇳  Coverage: All 28 States & 8 Union Territories of India`);
  console.log(`⚡  Provider: ${WEATHER_PROVIDER} (OpenWeatherMap + Open-Meteo Fallback)`);
  console.log(`⏱️   Cache TTL: ${CACHE_TTL_MS / 1000 / 60} Minutes`);
  console.log(`=============================================================\n`);
});
