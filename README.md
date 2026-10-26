# Aetheria Weather 🌤️

A modern real-time meteorological web application designed with frosted glassmorphism, responsive data grids, 60 FPS atmospheric particle effects, and multi-provider weather intelligence.

---

## ⚡ Features

- **Integrated OpenWeatherMap API:** Configured with API key `3567b3619cf3d391f319c063da450977`.
- **Zero-Downtime Smart Fallback:** When a new API key is propagating on OpenWeatherMap's global servers (typically 10–60 minutes), the app automatically switches to live satellite meteorological data so the app remains 100% operational.
- **Exclusive India Focus & All 36 States/UTs Explorer:**
  - 🇮🇳 **All 28 States & 8 Union Territories:** Dedicated interactive explorer with regional filters (North, South, West, East, Central, Northeast, UTs), capital city hubs, and 1-click live weather.
  - 🏛️ **Quick State Jump Dropdown:** Instant dropdown in the top bar to jump directly to any state or union territory across India.
  - 📍 **Automatic User Location GPS:** Detects the user's exact city, district, and state in India via browser geolocation and reverse geocoding with visual "Your Location" indicators.
  - 🔍 **Strict India-Only Search:** Real-time geocoding autocomplete strictly filtered to Indian cities, districts, and towns (`country_code: IN`).
- **Dynamic 60 FPS Canvas Background:**
  - ☀️ Solar flares & golden dust motes for clear sunny days
  - 🌙 Twinkling starry night sky
  - 🌧️ Realistic angled rain streaks
  - ⚡ Thunderstorm with electric flashes
  - ❄️ Drifting snowflakes
  - ☁️ Floating cloud puffs & mist
- **24-Hour Hourly Timeline:** Horizontal scrolling cards with rain chance and trend indicators.
- **7-Day Extended Forecast:** Daily outlook featuring min/max temperature comparison gradient bars.
- **6-Metric Environmental Dashboard:**
  - Wind speed, gusts, and animated 360° compass needle
  - Solar cycle arc tracking sunrise and sunset progression
  - Relative humidity & comfort dew point
  - Horizon visibility
  - UV radiation index with safety recommendations
  - Barometric pressure & cloud coverage
- **Unit Conversion:** Instant one-click toggle between Celsius (°C, km/h) and Fahrenheit (°F, mph).
- **Pinned Indian Favorites Bar:** Pre-configured with major Indian cities (New Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Jaipur) with LocalStorage persistence.
- **API Key & Engine Manager:** Test key connection latency, update API keys, or switch between OpenWeatherMap and Open-Meteo engines directly in the UI.

---

## 🚀 How to Run

### Option 1: Open Directly in Any Web Browser
Simply double-click [`index.html`](file:///c:/Users/madur/OneDrive/Documents/wheater/index.html) or right-click and open with your preferred browser (Chrome, Edge, Brave, Firefox, etc.).

### Option 2: Run via Local Server (Running on Port 3000)
The local server is already running:
```
http://localhost:3000
```
Or start anytime in terminal:
```bash
python -m http.server 3000
```

---

## 📁 Project Structure

```
wheater/
├── index.html     # Semantic HTML5 layout with accessible ARIA roles
├── style.css      # Vanilla CSS design system, glassmorphic styling & themes
├── app.js         # Weather data fetcher, atmospheric canvas & UI engine
└── README.md      # Documentation & quick start guide
```
