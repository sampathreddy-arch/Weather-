# 🌤️ Aetheria Weather India

A full-stack real-time weather dashboard exclusively built for India — covering all **28 States & 8 Union Territories** with live meteorological data, dynamic atmospheric visuals, and an Express.js backend with server-side caching.

---

## ✨ Features

### 🇮🇳 India-First Design
- **All 36 States & UTs Explorer** — Browse every Indian state and union territory with regional filters (North, South, East, West, Central, Northeast, UTs)
- **Auto GPS Detection** — Detects your city and state in India via browser geolocation + reverse geocoding
- **India-Only Search** — Autocomplete strictly filtered to Indian cities, districts, and towns
- **Quick State Jump** — Instant dropdown to navigate any state's weather in one click
- **Pinned Cities Bar** — Pre-loaded with major Indian metros (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Jaipur)

### 🌡️ Weather Intelligence
- **Dual-Engine Data** — OpenWeatherMap (primary) + Open-Meteo satellite (automatic fallback)
- **Zero-Downtime Fallback** — New API keys propagate in 10–60 min; Open-Meteo keeps the app live in the interim
- **Server-Side Caching** — 10-minute in-memory cache on the Express backend to preserve API quota
- **24-Hour Hourly Forecast** — Scrollable cards with rain probability indicators
- **7-Day Extended Outlook** — Min/max gradient bars for weekly planning

### 🎨 Live Atmospheric Canvas (60 FPS)
| Condition | Visual Effect |
|-----------|--------------|
| ☀️ Clear Day | Solar flares & golden dust motes |
| 🌙 Clear Night | Twinkling starfield |
| 🌧️ Rain | Realistic angled rain streaks |
| ⛈️ Thunderstorm | Electric lightning flashes |
| ❄️ Snow | Drifting snowflakes |
| ☁️ Clouds / Mist | Floating cloud puffs & fog |

### 📊 6-Metric Environmental Dashboard
- 💨 Wind speed, gusts & animated 360° compass
- 🌅 Solar arc tracking sunrise/sunset progression
- 💧 Relative humidity & dew point comfort index
- 👁️ Horizon visibility rating
- ☀️ UV radiation index with safety advice
- 🌡️ Barometric pressure & cloud coverage

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- An [OpenWeatherMap API key](https://home.openweathermap.org/users/sign_up) (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/sampathreddy-arch/Weather-.git
cd Weather-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Open `.env` and add your OpenWeatherMap API key:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 4. Start the server
```bash
npm start
```

Open **http://localhost:3000** in your browser. 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status & uptime |
| `GET` | `/api/weather?lat=&lon=&city=&state=` | Fetch weather with caching |
| `GET` | `/api/search?q=city` | India-only geocoding search |
| `GET` | `/api/locate?lat=&lon=` | Reverse geocode to city/state |
| `GET` | `/api/states` | All 28 States & 8 UTs dataset |
| `GET` | `/api/states/:id` | Single state by ID or name |

---

## 📁 Project Structure

```
Weather-/
├── index.html          # Semantic HTML5 UI with ARIA roles
├── style.css           # Vanilla CSS — glassmorphism, animations & themes
├── app.js              # Frontend: weather engine, canvas & UI logic
├── server.js           # Express backend: API proxy, caching & geocoding
├── package.json        # Node.js dependencies
├── .env.example        # Environment variable template
└── README.md           # You are here
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Vanilla CSS, JavaScript (ES2022) |
| Backend | Node.js, Express.js |
| Weather APIs | OpenWeatherMap, Open-Meteo |
| Geocoding | Open-Meteo Geocoding, Nominatim (OSM) |
| Canvas | HTML5 Canvas API (60 FPS animations) |

---

## 📄 License

ISC © Aetheria Weather
