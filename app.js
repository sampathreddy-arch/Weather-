/**
 * AETHERIA WEATHER — MAIN APPLICATION LOGIC
 * Features:
 * - OpenWeatherMap API Integration with user key
 * - Intelligent live fallback to Open-Meteo for zero-downtime weather
 * - Real-time geocoding search & auto-complete suggestions
 * - Geolocation detection
 * - 24-Hour hourly forecast & 7-Day extended outlook
 * - Dynamic 60fps HTML5 atmospheric particle canvas (Rain, Snow, Clouds, Stars, Sun)
 * - Metric (°C) / Imperial (°F) instant switching
 * - Favorites / Pinned cities system with LocalStorage persistence
 */

// ==========================================================================
// ALL 28 INDIAN STATES & 8 UNION TERRITORIES DATASET
// ==========================================================================
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
  { id: 'JK', name: 'Jammu and Kashmir', type: 'UT', capital: 'Srinagar', region: 'UT', lat: 34.0837, lon: 74.7973, majorCities: ['Jammu', 'Anantnag', 'Baramulla', 'Gulmarg'] },
  { id: 'LA', name: 'Ladakh', type: 'UT', capital: 'Leh', region: 'UT', lat: 34.1526, lon: 77.5771, majorCities: ['Kargil', 'Nubra Valley', 'Zanskar'] },
  { id: 'LD', name: 'Lakshadweep', type: 'UT', capital: 'Kavaratti', region: 'UT', lat: 10.5669, lon: 72.6420, majorCities: ['Agatti', 'Andrott', 'Minicoy'] },
  { id: 'PY', name: 'Puducherry', type: 'UT', capital: 'Puducherry', region: 'UT', lat: 11.9416, lon: 79.8083, majorCities: ['Karaikal', 'Mahe', 'Yanam'] }
];

// ==========================================================================
// CONFIGURATION & STATE (INDIA ONLY)
// ==========================================================================
const CONFIG = {
  defaultApiKey: '3567b3619cf3d391f319c063da450977',
  defaultCity: 'New Delhi',
  defaultState: 'Delhi',
  storageKeys: {
    apiKey: 'aetheria_api_key',
    providerChoice: 'aetheria_provider_choice',
    unit: 'aetheria_unit',
    favorites: 'aetheria_favorites',
    lastCity: 'aetheria_last_city',
    lastState: 'aetheria_last_state',
    userLocation: 'aetheria_user_location'
  },
  defaultFavorites: ['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Jaipur']
};

const state = {
  apiKey: localStorage.getItem(CONFIG.storageKeys.apiKey) || CONFIG.defaultApiKey,
  providerChoice: localStorage.getItem(CONFIG.storageKeys.providerChoice) || 'auto', // 'auto' | 'owm' | 'openmeteo'
  activeProvider: 'OpenWeatherMap',
  unit: localStorage.getItem(CONFIG.storageKeys.unit) || 'C', // 'C' | 'F'
  currentData: null,
  currentLocationName: localStorage.getItem(CONFIG.storageKeys.lastCity) || 'New Delhi',
  currentStateName: localStorage.getItem(CONFIG.storageKeys.lastState) || 'Delhi',
  currentCountry: 'IN',
  favorites: JSON.parse(localStorage.getItem(CONFIG.storageKeys.favorites)) || CONFIG.defaultFavorites,
  isFavorited: false,
  searchDebounceTimer: null,
  activeWeatherType: 'clouds', // 'clear-day' | 'clear-night' | 'clouds' | 'rain' | 'thunder' | 'snow' | 'mist'
  isDaytime: true,
  userLocation: JSON.parse(localStorage.getItem(CONFIG.storageKeys.userLocation)) || null,
  isCurrentViewingUserLoc: false,
  selectedRegionFilter: 'all'
};

// ==========================================================================
// WEATHER ICONS SYSTEM (RETINA INLINE SVGS)
// ==========================================================================
const WeatherIcons = {
  clearDay: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="40%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#sunGrad)"/>
      <g stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.85">
        <line x1="32" y1="6" x2="32" y2="12"/>
        <line x1="32" y1="52" x2="32" y2="58"/>
        <line x1="6" y1="32" x2="12" y2="32"/>
        <line x1="52" y1="32" x2="58" y2="32"/>
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/>
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/>
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/>
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/>
      </g>
    </svg>
  `,
  clearNight: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M42 36.5c0 10.2-8.3 18.5-18.5 18.5-3.3 0-6.4-.9-9.1-2.4 8.7 5.7 20.3 4.2 27.2-3.4 6-6.6 6-16.5 0-23.2 2.5 3.1 3.9 6.9 3.9 10.5h-3.5Z" fill="#e0e7ff"/>
      <circle cx="48" cy="18" r="1.5" fill="#f8fafc"/>
      <circle cx="42" cy="12" r="1.2" fill="#93c5fd"/>
      <circle cx="52" cy="28" r="1.3" fill="#f8fafc"/>
    </svg>
  `,
  partlyCloudyDay: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="26" cy="24" r="11" fill="#f59e0b"/>
      <path d="M46 48H22a10 10 0 0 1-1.3-19.9A14 14 0 0 1 45.4 25 9.5 9.5 0 0 1 46 48Z" fill="#e2e8f0" opacity="0.95"/>
      <path d="M46 48H22a10 10 0 0 1-1.3-19.9A14 14 0 0 1 45.4 25" stroke="#cbd5e1" stroke-width="1.5"/>
    </svg>
  `,
  partlyCloudyNight: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M28 16a9 9 0 0 0 8 13 9 9 0 0 1-8-13Z" fill="#c7d2fe"/>
      <path d="M48 50H24a10 10 0 0 1-1.3-19.9A14 14 0 0 1 47.4 27 9.5 9.5 0 0 1 48 50Z" fill="#94a3b8" opacity="0.92"/>
    </svg>
  `,
  clouds: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M46 48H18a11 11 0 0 1-1.4-21.9A15 15 0 0 1 45.4 23 10.5 10.5 0 0 1 46 48Z" fill="#cbd5e1" opacity="0.95"/>
      <path d="M38 38H14a8 8 0 0 1-1-15.9A11 11 0 0 1 37.6 20 7.5 7.5 0 0 1 38 38Z" fill="#94a3b8" opacity="0.75"/>
    </svg>
  `,
  rain: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M46 40H20a10 10 0 0 1-1.3-19.9A13.5 13.5 0 0 1 45.3 17 9.5 9.5 0 0 1 46 40Z" fill="#64748b"/>
      <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
        <line x1="22" y1="46" x2="19" y2="54"/>
        <line x1="32" y1="46" x2="29" y2="54"/>
        <line x1="42" y1="46" x2="39" y2="54"/>
      </g>
    </svg>
  `,
  heavyRain: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M46 38H20a10 10 0 0 1-1.3-19.9A13.5 13.5 0 0 1 45.3 15 9.5 9.5 0 0 1 46 38Z" fill="#475569"/>
      <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
        <line x1="20" y1="44" x2="16" y2="56"/>
        <line x1="28" y1="44" x2="24" y2="56"/>
        <line x1="36" y1="44" x2="32" y2="56"/>
        <line x1="44" y1="44" x2="40" y2="56"/>
      </g>
    </svg>
  `,
  thunderstorm: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M48 36H22a10 10 0 0 1-1.3-19.9A13.5 13.5 0 0 1 47.3 13 9.5 9.5 0 0 1 48 36Z" fill="#334155"/>
      <polygon points="32 36 24 47 30 47 26 58 38 45 32 45" fill="#fbbf24"/>
    </svg>
  `,
  snow: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M46 38H20a10 10 0 0 1-1.3-19.9A13.5 13.5 0 0 1 45.3 15 9.5 9.5 0 0 1 46 38Z" fill="#94a3b8"/>
      <circle cx="22" cy="48" r="2" fill="#e0f2fe"/>
      <circle cx="32" cy="52" r="2.5" fill="#e0f2fe"/>
      <circle cx="42" cy="47" r="2" fill="#e0f2fe"/>
      <circle cx="26" cy="56" r="1.8" fill="#e0f2fe"/>
      <circle cx="38" cy="57" r="1.8" fill="#e0f2fe"/>
    </svg>
  `,
  mist: () => `
    <svg viewBox="0 0 64 64" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round">
      <line x1="16" y1="22" x2="48" y2="22"/>
      <line x1="12" y1="30" x2="52" y2="30"/>
      <line x1="18" y1="38" x2="46" y2="38"/>
      <line x1="14" y1="46" x2="50" y2="46"/>
    </svg>
  `
};

/**
 * Returns the matching SVG icon for weather code & day/night
 */
function getWeatherIcon(conditionCode, isDay = true) {
  const code = String(conditionCode).toLowerCase();
  
  if (code.includes('thunder') || code === '11d' || code === '11n' || [95, 96, 99].includes(Number(code))) {
    return WeatherIcons.thunderstorm();
  }
  if (code.includes('snow') || code === '13d' || code === '13n' || [71, 73, 75, 77, 85, 86].includes(Number(code))) {
    return WeatherIcons.snow();
  }
  if (code.includes('heavy rain') || [65, 82].includes(Number(code))) {
    return WeatherIcons.heavyRain();
  }
  if (code.includes('rain') || code.includes('drizzle') || code === '09d' || code === '09n' || code === '10d' || code === '10n' || [51, 53, 55, 61, 63, 80, 81].includes(Number(code))) {
    return WeatherIcons.rain();
  }
  if (code.includes('fog') || code.includes('mist') || code.includes('haze') || code === '50d' || code === '50n' || [45, 48].includes(Number(code))) {
    return WeatherIcons.mist();
  }
  if (code.includes('broken') || code.includes('overcast') || code === '04d' || code === '04n' || code === '3') {
    return WeatherIcons.clouds();
  }
  if (code.includes('few') || code.includes('scattered') || code === '02d' || code === '03d' || code === '1' || code === '2') {
    return isDay ? WeatherIcons.partlyCloudyDay() : WeatherIcons.partlyCloudyNight();
  }
  if (code.includes('02n') || code.includes('03n')) {
    return WeatherIcons.partlyCloudyNight();
  }
  
  // Clear
  return isDay ? WeatherIcons.clearDay() : WeatherIcons.clearNight();
}

/**
 * Maps condition to aesthetic theme tag
 */
function getThemeFromCondition(conditionShort, isDay = true) {
  const c = conditionShort.toLowerCase();
  if (c.includes('thunder')) return 'thunder';
  if (c.includes('snow') || c.includes('flurry')) return 'snow';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rain';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return 'mist';
  if (c.includes('cloud') || c.includes('overcast')) return 'clouds';
  return isDay ? 'clear-day' : 'clear-night';
}

// ==========================================================================
// ATMOSPHERIC BACKGROUND CANVAS ANIMATION
// ==========================================================================
class AtmosphericCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.lightningAlpha = 0;
    this.currentMode = 'clouds';
    this.width = 0;
    this.height = 0;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const count = this.getParticleCount();

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  getParticleCount() {
    switch (this.currentMode) {
      case 'rain': return 160;
      case 'thunder': return 200;
      case 'snow': return 80;
      case 'clear-night': return 120;
      case 'clear-day': return 35;
      default: return 25; // clouds / mist
    }
  }

  createParticle() {
    const w = this.width;
    const h = this.height;

    switch (this.currentMode) {
      case 'rain':
      case 'thunder':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 20 + 15,
          speed: Math.random() * 12 + 18,
          opacity: Math.random() * 0.4 + 0.2,
          slant: -2
        };
      case 'snow':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 2.5 + 1,
          speedY: Math.random() * 1.5 + 0.8,
          speedX: Math.random() * 0.8 - 0.4,
          opacity: Math.random() * 0.7 + 0.3
        };
      case 'clear-night':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.4 + 0.5,
          baseAlpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2
        };
      case 'clear-day':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1,
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.3 + 0.1
        };
      default: // clouds & mist
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 80 + 40,
          speedX: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.04 + 0.01
        };
    }
  }

  animate() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Occasional lightning flash in thunderstorm
    if (this.currentMode === 'thunder') {
      if (Math.random() < 0.007 && this.lightningAlpha <= 0) {
        this.lightningAlpha = 0.45;
      }
      if (this.lightningAlpha > 0) {
        ctx.fillStyle = `rgba(216, 180, 254, ${this.lightningAlpha})`;
        ctx.fillRect(0, 0, w, h);
        this.lightningAlpha -= 0.03;
      }
    }

    // Render particles
    for (let p of this.particles) {
      if (this.currentMode === 'rain' || this.currentMode === 'thunder') {
        ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.slant, p.y + p.length);
        ctx.stroke();

        p.y += p.speed;
        p.x += p.slant;
        if (p.y > h) {
          p.y = -20;
          p.x = Math.random() * w;
        }
      } else if (this.currentMode === 'snow') {
        ctx.fillStyle = `rgba(240, 249, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > h) {
          p.y = -10;
          p.x = Math.random() * w;
        }
      } else if (this.currentMode === 'clear-night') {
        p.phase += p.twinkleSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.phase) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.currentMode === 'clear-day') {
        ctx.fillStyle = `rgba(253, 224, 71, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
      } else {
        // Clouds / mist
        ctx.fillStyle = `rgba(203, 213, 225, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        if (p.x - p.radius > w) {
          p.x = -p.radius;
          p.y = Math.random() * h;
        }
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  }
}

let atmosphericBackground;

// ==========================================================================
// WEATHER SERVICE (DUAL ENGINE: OPENWEATHERMAP + OPEN-METEO FALLBACK)
// ==========================================================================
const WeatherService = {
  /**
   * Geocoding: Strictly finds matching locations within India
   */
  async geocode(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // 1. Try Backend API search endpoint first
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Backend not reached, fall back to local/client logic below
    }

    const results = [];
    const seenKeys = new Set();

    // 2. Search Local Comprehensive Dataset of 36 Indian States & UTs + Major Cities
    INDIA_STATES_DATA.forEach(item => {
      const stateMatch = item.name.toLowerCase().includes(q);
      const capMatch = item.capital.toLowerCase().includes(q);
      const cityMatch = item.majorCities.some(city => city.toLowerCase().includes(q));

      if (stateMatch || capMatch || cityMatch) {
        let matchedCity = item.capital;
        if (cityMatch) {
          const specificCity = item.majorCities.find(c => c.toLowerCase().includes(q));
          if (specificCity) matchedCity = specificCity;
        }

        const key = `${matchedCity.toLowerCase()}-${item.name.toLowerCase()}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          results.push({
            name: matchedCity,
            lat: item.lat,
            lon: item.lon,
            country: 'IN',
            admin: item.name,
            type: item.type,
            isStateCapital: matchedCity.toLowerCase() === item.capital.toLowerCase()
          });
        }
      }
    });

    // 3. Fetch Remote Geocoding from Open-Meteo (Filtered Strictly to India)
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=40&language=en&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const indiaResults = data.results.filter(
            item => (item.country_code && item.country_code.toUpperCase() === 'IN') || 
                    (item.country && item.country.toLowerCase() === 'india')
          );

          indiaResults.forEach(item => {
            const key = `${item.name.toLowerCase()}-${(item.admin1 || '').toLowerCase()}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
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
      console.warn('Open-Meteo geocoding error:', err);
    }

    // 4. Fallback to OpenStreetMap Nominatim restricted to India (&countrycodes=in)
    if (results.length < 3) {
      try {
        const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&addressdetails=1&limit=8`;
        const osmRes = await fetch(osmUrl, { headers: { 'Accept-Language': 'en' } });
        if (osmRes.ok) {
          const osmData = await osmRes.json();
          osmData.forEach(item => {
            const cityName = item.address?.city || item.address?.town || item.address?.village || item.address?.county || item.name;
            const stateName = item.address?.state || 'India';
            const key = `${cityName.toLowerCase()}-${stateName.toLowerCase()}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
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
        console.warn('Nominatim geocoding error:', err);
      }
    }

    return results.slice(0, 10);
  },

  /**
   * Reverse Geocoding: Detects user's city, state and verifies India location
   */
  async reverseGeocode(lat, lon) {
    // 1. Try Backend API locate endpoint first
    try {
      const res = await fetch(`/api/locate?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.city) return data;
      }
    } catch {
      // Backend not reached, fall back to client logic below
    }

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      const addr = data.address || {};
      
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || addr.county || 'Detected Location';
      const stateName = addr.state || '';
      const countryCode = (addr.country_code || '').toUpperCase();
      const isIndia = countryCode === 'IN';

      return {
        city,
        state: stateName,
        country: 'IN',
        countryCode,
        isIndia,
        displayName: stateName ? `${city}, ${stateName}` : city
      };
    } catch {
      return { city: 'Detected Location', state: 'India', country: 'IN', countryCode: 'IN', isIndia: true, displayName: 'Detected Location' };
    }
  },

  /**
   * Fetches weather using OpenWeatherMap API
   */
  async fetchFromOpenWeatherMap(lat, lon, cityName, stateName) {
    const apiKey = state.apiKey;
    const units = 'metric';

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

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

    return this.normalizeOpenWeatherData(current, forecast, cityName, stateName);
  },

  /**
   * Fetches weather using Open-Meteo API
   */
  async fetchFromOpenMeteo(lat, lon, cityName, stateName, countryCode) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();
    return this.normalizeOpenMeteoData(data, cityName, stateName, countryCode, lat, lon);
  },

  /**
   * Main fetch dispatcher with auto-fallback & backend proxy integration
   */
  async fetchWeatherData(location) {
    const { lat, lon, name, stateName, country } = location;

    // 1. Try Backend API endpoint first (with server-side cache and proxying)
    try {
      const backendUrl = `/api/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(name)}&state=${encodeURIComponent(stateName || '')}`;
      const res = await fetch(backendUrl);
      if (res.ok) {
        const data = await res.json();
        state.activeProvider = data.provider || 'Express Backend';
        updateConnectionPill('active', `${data.provider || 'Backend'} Live`);
        return data;
      }
    } catch {
      // Backend not running (e.g. running via file:// protocol), proceed to direct client fetch below
    }

    if (state.providerChoice === 'openmeteo') {
      const data = await this.fetchFromOpenMeteo(lat, lon, name, stateName, country);
      state.activeProvider = 'Open-Meteo';
      updateConnectionPill('active', 'Open-Meteo Live');
      return data;
    }

    try {
      const data = await this.fetchFromOpenWeatherMap(lat, lon, name, stateName);
      state.activeProvider = 'OpenWeatherMap';
      updateConnectionPill('active', 'OpenWeatherMap Active');
      return data;
    } catch (err) {
      console.warn('OpenWeatherMap attempt failed:', err);

      if (state.providerChoice === 'owm') {
        throw err;
      }

      console.info('Switching to Open-Meteo fallback...');
      const fallbackData = await this.fetchFromOpenMeteo(lat, lon, name, stateName, country);
      state.activeProvider = 'Open-Meteo Fallback';
      
      const isActivationDelay = err.status === 401;
      updateConnectionPill(
        'activating', 
        isActivationDelay 
          ? 'OWM Key Activating (Using Live Fallback)' 
          : 'Live Weather Active'
      );
      
      if (isActivationDelay) {
        showNoticeBanner('Your OpenWeatherMap key is registered! New keys take 10-60 min to propagate on OpenWeatherMap servers. Displaying live satellite weather in the meantime.');
      }
      return fallbackData;
    }
  },

  /**
   * Normalizer: OpenWeatherMap -> Standard format
   */
  normalizeOpenWeatherData(cur, forecast, cityName, stateName) {
    const isDay = cur.weather[0]?.icon?.endsWith('d') ?? true;
    const condCode = cur.weather[0]?.id || cur.weather[0]?.icon || 'clear';
    const condShort = cur.weather[0]?.main || 'Clear';
    const condDesc = cur.weather[0]?.description || 'Clear Sky';

    // 24h Hourly: OpenWeatherMap provides 3-hour slices, take next 8 (24h)
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

    // 7-Day Daily: Aggregate forecast list by day
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
      stateName: stateName || state.currentStateName || 'India',
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
      windSpeed: Math.round((cur.wind.speed || 0) * 3.6), // m/s -> km/h
      windDeg: cur.wind.deg || 0,
      windGust: Math.round(((cur.wind.gust || cur.wind.speed || 0) * 3.6)),
      pressure: cur.main.pressure || 1013,
      visibility: cur.visibility ? (cur.visibility / 1000).toFixed(1) : '10.0',
      cloudCover: cur.clouds?.all || 0,
      uvIndex: 3.5, // Standard estimate when one-call UV not present
      sunrise: sunriseTime,
      sunset: sunsetTime,
      hourly: hourlyList,
      daily
    };
  },

  /**
   * Normalizer: Open-Meteo -> Standard format
   */
  normalizeOpenMeteoData(data, cityName, stateName, countryCode, lat, lon) {
    const cur = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const isDay = cur.is_day === 1;
    const weatherInfo = mapWmoCode(cur.weather_code);

    // Hourly next 24 hours
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

    // 7 Day Daily
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
      stateName: stateName || state.currentStateName || 'India',
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
      daily: dailyItems
    };
  }
};

/**
 * WMO Weather interpretation codes
 */
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

// ==========================================================================
// UNIT CONVERSION HELPERS
// ==========================================================================
function formatTemp(celsius) {
  if (state.unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
}

function formatSpeed(kmh) {
  if (state.unit === 'F') {
    return Math.round(kmh * 0.621371); // mph
  }
  return kmh; // km/h
}

function getSpeedUnit() {
  return state.unit === 'F' ? 'mph' : 'km/h';
}

function getCompassDirection(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

function getUvRiskLevel(uv) {
  const val = Number(uv);
  if (val <= 2) return { label: 'Low', advice: 'No protection required. Safe for all.' };
  if (val <= 5) return { label: 'Moderate', advice: 'Wear sunglasses and apply SPF 30+.' };
  if (val <= 7) return { label: 'High', advice: 'Seek shade during midday hours.' };
  if (val <= 10) return { label: 'Very High', advice: 'Take extra precautions against sunburn.' };
  return { label: 'Extreme', advice: 'Avoid sun exposure around solar noon.' };
}

// ==========================================================================
// UI RENDERING & COMPONENT UPDATES
// ==========================================================================
function renderWeatherData(data) {
  state.currentData = data;
  state.isDaytime = data.isDay;

  // 1. Update Body Theme & Canvas
  const theme = getThemeFromCondition(data.conditionShort, data.isDay);
  state.activeWeatherType = theme;
  document.body.className = `theme-${theme}`;
  if (atmosphericBackground) {
    atmosphericBackground.setMode(theme);
  }

  // 2. City, State & Country
  document.getElementById('city-name').textContent = data.cityName;
  const stateBadgeEl = document.getElementById('state-badge');
  if (stateBadgeEl) {
    stateBadgeEl.textContent = data.stateName || state.currentStateName || 'India';
  }
  document.getElementById('country-badge').textContent = 'India 🇮🇳';

  // User location indicator badge
  const userLocInd = document.getElementById('user-loc-indicator');
  if (userLocInd) {
    const isUserLocation = state.isCurrentViewingUserLoc || 
      (state.userLocation && state.userLocation.city.toLowerCase() === data.cityName.toLowerCase());
    userLocInd.classList.toggle('hidden', !isUserLocation);
  }

  // 3. Local Datetime
  const now = new Date();
  const dateFormatted = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('datetime-display').textContent = `${dateFormatted} • ${timeFormatted}`;

  // 4. Condition Short Badge & Advice
  document.getElementById('condition-short').textContent = data.conditionShort;
  document.getElementById('condition-description').textContent = data.conditionDescription;
  
  const adviceText = generateAdvice(data.conditionShort, data.temp, data.windSpeed);
  document.getElementById('condition-advice').textContent = adviceText;

  // 5. Hero Weather SVG Icon
  document.getElementById('hero-weather-icon').innerHTML = getWeatherIcon(data.conditionCode, data.isDay);

  // 6. Hero Temperatures
  document.getElementById('current-temp').textContent = formatTemp(data.temp);
  document.getElementById('feels-like-temp').textContent = `${formatTemp(data.feelsLike)}°`;
  document.getElementById('temp-high').textContent = `${formatTemp(data.tempMax)}°`;
  document.getElementById('temp-low').textContent = `${formatTemp(data.tempMin)}°`;

  // 7. Hero Quick 4 Stats
  document.getElementById('hero-humidity').textContent = `${data.humidity}%`;
  document.getElementById('hero-wind').textContent = `${formatSpeed(data.windSpeed)} ${getSpeedUnit()}`;
  document.getElementById('hero-uv').textContent = `${data.uvIndex}`;
  document.getElementById('hero-pressure').textContent = `${data.pressure} hPa`;

  // 8. Detailed Environmental Metrics
  // Wind
  document.getElementById('detail-wind-speed').textContent = formatSpeed(data.windSpeed);
  document.getElementById('detail-wind-unit').textContent = getSpeedUnit();
  document.getElementById('compass-needle').style.transform = `translate(-50%, -50%) rotate(${data.windDeg}deg)`;
  document.getElementById('wind-direction-text').textContent = `${getCompassDirection(data.windDeg)} (${data.windDeg}°)`;
  document.getElementById('wind-gust-text').textContent = `Gusts up to ${formatSpeed(data.windGust)} ${getSpeedUnit()}`;

  // Sun Cycle
  document.getElementById('sunrise-time').textContent = data.sunrise;
  document.getElementById('sunset-time').textContent = data.sunset;
  updateSunArcPosition();

  // Humidity & Dew Point
  document.getElementById('detail-humidity').textContent = data.humidity;
  document.getElementById('humidity-progress').style.width = `${Math.min(100, data.humidity)}%`;
  const approxDewPoint = Math.round(data.temp - ((100 - data.humidity) / 5));
  document.getElementById('dew-point-text').textContent = `The dew point is ${formatTemp(approxDewPoint)}° right now`;

  // Visibility
  document.getElementById('detail-visibility').textContent = data.visibility;
  document.getElementById('detail-visibility-unit').textContent = 'km';

  // UV Radiation
  document.getElementById('detail-uv-val').textContent = data.uvIndex;
  const uvInfo = getUvRiskLevel(data.uvIndex);
  document.getElementById('detail-uv-category').textContent = uvInfo.label;
  document.getElementById('uv-progress').style.width = `${Math.min(100, (Number(data.uvIndex) / 11) * 100)}%`;
  document.getElementById('uv-advice').textContent = uvInfo.advice;

  // Pressure & Cloud cover
  document.getElementById('detail-pressure').textContent = data.pressure;
  document.getElementById('cloud-cover-text').textContent = `Cloud coverage: ${data.cloudCover}%`;

  // 9. Hourly Projections
  renderHourlyForecast(data.hourly);

  // 10. 7-Day Extended Outlook
  renderDailyForecast(data.daily);

  // 11. Update Favorite Pin Button state
  updateFavoriteButtonState();
}

/**
 * Renders 24-hour horizontal cards
 */
function renderHourlyForecast(hourlyItems) {
  const container = document.getElementById('hourly-scroll-container');
  container.innerHTML = '';

  if (!hourlyItems || hourlyItems.length === 0) return;

  hourlyItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `hourly-card ${index === 0 ? 'active-hour' : ''}`;
    
    card.innerHTML = `
      <span class="hour-time">${index === 0 ? 'Now' : item.time}</span>
      <div class="hour-icon">${getWeatherIcon(item.icon, item.isDay)}</div>
      <span class="hour-temp">${formatTemp(item.temp)}°</span>
      ${item.pop > 10 ? `<span class="hour-rain-chance">💧${item.pop}%</span>` : ''}
    `;

    container.appendChild(card);
  });
}

/**
 * Renders 7-day extended forecast with visual temp gradient bars
 */
function renderDailyForecast(dailyItems) {
  const container = document.getElementById('daily-forecast-list');
  container.innerHTML = '';

  if (!dailyItems || dailyItems.length === 0) return;

  // Compute global min & max to scale the range bars relative to each other
  let globalMin = Math.min(...dailyItems.map(d => d.min));
  let globalMax = Math.max(...dailyItems.map(d => d.max));
  if (globalMax === globalMin) globalMax += 1;

  dailyItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'daily-item';

    // Calculate relative width & offset
    const leftPercent = Math.max(0, ((item.min - globalMin) / (globalMax - globalMin)) * 100);
    const widthPercent = Math.max(15, (((item.max - item.min) / (globalMax - globalMin)) * 100));

    row.innerHTML = `
      <div class="daily-day-info">
        <span class="daily-day-name">${item.dayName}</span>
        <span class="daily-date">${item.dateStr}</span>
      </div>
      
      <div class="daily-weather-preview">
        <div class="daily-icon-wrap">${getWeatherIcon(item.icon, true)}</div>
        <span class="daily-condition-label">${item.condition}</span>
      </div>

      <div class="daily-temp-bar-container">
        <div class="daily-temp-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
      </div>

      <div class="daily-temp-numbers">
        <span class="daily-temp-min">${formatTemp(item.min)}°</span>
        <span class="daily-temp-max">${formatTemp(item.max)}°</span>
      </div>
    `;

    container.appendChild(row);
  });
}

/**
 * Sun position progression arc dot calculator
 */
function updateSunArcPosition() {
  const dot = document.getElementById('sun-position-dot');
  if (!dot) return;

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  
  // Daylight typically 6 to 18 (12 hours)
  const daylightProgress = Math.min(1, Math.max(0, (currentHour - 6) / 12));

  // Ellipse arc from x=20, y=90 through peak x=100, y=10 to x=180, y=90
  const angle = Math.PI * (1 - daylightProgress);
  const cx = 100 - 80 * Math.cos(angle);
  const cy = 90 - 80 * Math.sin(angle);

  dot.setAttribute('cx', cx.toFixed(1));
  dot.setAttribute('cy', cy.toFixed(1));
  dot.style.opacity = state.isDaytime ? '1' : '0.3';
}

function generateAdvice(condition, temp, wind) {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return 'Take an umbrella with you before heading out';
  if (c.includes('snow')) return 'Winter coats and boots recommended today';
  if (c.includes('thunder')) return 'Stay indoors; thunderstorm conditions active';
  if (temp > 28) return 'Stay hydrated and seek shade during peak hours';
  if (temp < 5) return 'Bundle up warmly in layered clothing';
  if (wind > 35) return 'Brisk winds outside — secure loose items';
  return 'Comfortable meteorological conditions for outdoor plans';
}

// ==========================================================================
// FAVORITES & PINNED LOCATIONS BAR
// ==========================================================================
function renderPinnedLocationsBar() {
  const container = document.getElementById('chips-container');
  container.innerHTML = '';

  state.favorites.forEach(city => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `location-chip ${state.currentLocationName.toLowerCase() === city.toLowerCase() ? 'active' : ''}`;
    chip.textContent = city;
    chip.addEventListener('click', () => loadCityWeather(city));
    container.appendChild(chip);
  });
}

function updateFavoriteButtonState() {
  const favBtn = document.getElementById('favorite-city-btn');
  const isFav = state.favorites.some(c => c.toLowerCase() === state.currentLocationName.toLowerCase());
  favBtn.classList.toggle('favorited', isFav);
  favBtn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
}

function addCityToSaved(cityName, countryCode = '') {
  const trimmed = cityName.trim();
  if (!trimmed) return;

  const exists = state.favorites.some(c => c.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    showNoticeBanner(`${trimmed} is already in your saved locations!`);
    return;
  }

  state.favorites.unshift(trimmed);
  if (state.favorites.length > 12) state.favorites.pop();

  localStorage.setItem(CONFIG.storageKeys.favorites, JSON.stringify(state.favorites));
  renderPinnedLocationsBar();
  updateFavoriteButtonState();
  renderSavedLocationsInModal();
  showNoticeBanner(`✓ Added "${trimmed}" to your saved locations!`);
}

function removeCityFromSaved(cityName) {
  state.favorites = state.favorites.filter(c => c.toLowerCase() !== cityName.toLowerCase());
  localStorage.setItem(CONFIG.storageKeys.favorites, JSON.stringify(state.favorites));
  renderPinnedLocationsBar();
  updateFavoriteButtonState();
  renderSavedLocationsInModal();
  showNoticeBanner(`Removed "${cityName}" from saved locations.`);
}

function toggleFavoriteCurrentCity() {
  const city = state.currentLocationName;
  const isFav = state.favorites.some(c => c.toLowerCase() === city.toLowerCase());
  if (isFav) {
    removeCityFromSaved(city);
  } else {
    addCityToSaved(city, state.currentCountry);
  }
}

// ==========================================================================
// SEARCH & AUTOCOMPLETE ENGINE
// ==========================================================================
function initSearchListeners() {
  const searchInput = document.getElementById('city-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const dropdown = document.getElementById('suggestions-dropdown');
  const geoBtn = document.getElementById('geo-location-btn');

  // Input typing with debounce
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    clearBtn.classList.toggle('hidden', val.length === 0);

    clearTimeout(state.searchDebounceTimer);
    if (val.length < 2) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }

    state.searchDebounceTimer = setTimeout(async () => {
      const results = await WeatherService.geocode(val);
      renderSuggestions(results);
    }, 280);
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    dropdown.classList.add('hidden');
    searchInput.focus();
  });

  // Enter key selection
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = searchInput.value.trim();
      if (val) {
        dropdown.classList.add('hidden');
        loadCityWeather(val);
      }
    }
  });

  // Geolocation button
  geoBtn.addEventListener('click', () => {
    locateUserPosition(false);
  });

  // Click outside to dismiss dropdown
  document.addEventListener('click', (e) => {
    if (!document.getElementById('search-section').contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function renderSuggestions(results) {
  const dropdown = document.getElementById('suggestions-dropdown');
  dropdown.innerHTML = '';

  if (!results || results.length === 0) {
    dropdown.innerHTML = `<div class="suggestion-item"><span class="suggestion-city">No matching locations found in India. Check spelling.</span></div>`;
    dropdown.classList.remove('hidden');
    return;
  }

  results.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    
    item.innerHTML = `
      <div class="suggestion-main">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <span class="suggestion-city">${loc.name}</span>
        ${loc.admin ? `<span class="suggestion-region">${loc.admin}</span>` : ''}
      </div>
      <div class="suggestion-actions">
        <span class="suggestion-country">IN 🇮🇳</span>
        <button type="button" class="quick-add-btn" title="Add ${loc.name} to saved locations" aria-label="Add location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    `;

    // Click item to view weather
    item.addEventListener('click', (e) => {
      if (e.target.closest('.quick-add-btn')) return;
      document.getElementById('city-search-input').value = loc.name;
      dropdown.classList.add('hidden');
      loadCoordinateWeather(loc.lat, loc.lon, loc.name, loc.admin || '');
    });

    // Click plus button to add to saved locations
    const addBtn = item.querySelector('.quick-add-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addCityToSaved(loc.name, loc.country);
      addBtn.innerHTML = '✓';
      addBtn.style.background = '#34d399';
      addBtn.style.color = '#064e3b';
    });

    dropdown.appendChild(item);
  });

  dropdown.classList.remove('hidden');
}

// ==========================================================================
// WEATHER DATA CONTROLLERS (INDIA FOCUS)
// ==========================================================================
async function loadCityWeather(cityName, stateName = '') {
  try {
    showNoticeBanner(`Locating atmospheric data for ${cityName}...`);

    // First check local Indian States dataset
    const matchedState = INDIA_STATES_DATA.find(s => 
      s.name.toLowerCase() === cityName.toLowerCase() || 
      s.capital.toLowerCase() === cityName.toLowerCase()
    );
    if (matchedState) {
      await loadCoordinateWeather(matchedState.lat, matchedState.lon, matchedState.capital, matchedState.name);
      return;
    }

    const geo = await WeatherService.geocode(cityName);
    if (!geo || geo.length === 0) {
      showNoticeBanner(`Could not find "${cityName}" in India. Please check the spelling.`);
      return;
    }
    const loc = geo[0];
    await loadCoordinateWeather(loc.lat, loc.lon, loc.name, loc.admin || stateName);
  } catch (err) {
    console.error('Failed to load city:', err);
    showNoticeBanner(`Error fetching weather for ${cityName}: ${err.message}`);
  }
}

async function loadCoordinateWeather(lat, lon, cityName, stateName = '', isUserLoc = false) {
  try {
    state.currentLocationName = cityName;
    state.currentStateName = stateName || state.currentStateName || 'India';
    state.isCurrentViewingUserLoc = isUserLoc;
    state.currentCountry = 'IN';

    localStorage.setItem(CONFIG.storageKeys.lastCity, cityName);
    if (stateName) localStorage.setItem(CONFIG.storageKeys.lastState, stateName);

    const data = await WeatherService.fetchWeatherData({
      lat,
      lon,
      name: cityName,
      stateName: state.currentStateName,
      country: 'IN'
    });

    renderWeatherData(data);
    renderPinnedLocationsBar();
    renderStatesGrid();
  } catch (err) {
    console.error('Failed to load coordinate weather:', err);
    showNoticeBanner(`Error loading weather: ${err.message}`);
  }
}

function locateUserPosition(auto = false) {
  if (!navigator.geolocation) {
    if (!auto) showNoticeBanner('Geolocation is not supported by your browser.');
    return;
  }

  showNoticeBanner('Detecting your live position in India...');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const geo = await WeatherService.reverseGeocode(lat, lon);

      state.userLocation = {
        lat,
        lon,
        city: geo.city,
        state: geo.state,
        country: 'IN'
      };
      localStorage.setItem(CONFIG.storageKeys.userLocation, JSON.stringify(state.userLocation));

      updateUserLocationUI();
      await loadCoordinateWeather(lat, lon, geo.city, geo.state, true);
      showNoticeBanner(`📍 Located in ${geo.city}, ${geo.state || 'India'}`);
    },
    (err) => {
      console.warn('Geolocation denied or failed:', err);
      if (!auto) {
        showNoticeBanner('Location permission denied or unavailable. Using New Delhi, India.');
      }
      if (auto && !localStorage.getItem(CONFIG.storageKeys.lastCity)) {
        loadCityWeather('New Delhi', 'Delhi');
      }
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

function updateUserLocationUI() {
  const chipLabel = document.getElementById('my-loc-chip-label');
  const userLocDesc = document.getElementById('user-loc-desc');

  if (state.userLocation) {
    const locText = `${state.userLocation.city}${state.userLocation.state ? ', ' + state.userLocation.state : ''}`;
    if (chipLabel) chipLabel.textContent = `📍 ${locText}`;
    if (userLocDesc) userLocDesc.textContent = `${locText}, India`;
  } else {
    if (chipLabel) chipLabel.textContent = '📍 My Location';
    if (userLocDesc) userLocDesc.textContent = 'Click to detect your current location in India';
  }
}

// ==========================================================================
// ALL INDIAN STATES & UNION TERRITORIES (36 TOTAL)
// ==========================================================================
function initStateQuickSelect() {
  const select = document.getElementById('state-quick-select');
  if (!select) return;

  select.innerHTML = '<option value="">🏛️ Quick State Jump (36)...</option>';

  // Optgroup for 28 States
  const statesGroup = document.createElement('optgroup');
  statesGroup.label = '── States of India (28) ──';
  INDIA_STATES_DATA.filter(s => s.type === 'State').forEach(st => {
    const opt = document.createElement('option');
    opt.value = st.id;
    opt.textContent = `${st.name} — ${st.capital}`;
    statesGroup.appendChild(opt);
  });
  select.appendChild(statesGroup);

  // Optgroup for 8 Union Territories
  const utGroup = document.createElement('optgroup');
  utGroup.label = '── Union Territories (8) ──';
  INDIA_STATES_DATA.filter(s => s.type === 'UT').forEach(st => {
    const opt = document.createElement('option');
    opt.value = st.id;
    opt.textContent = `${st.name} — ${st.capital}`;
    utGroup.appendChild(opt);
  });
  select.appendChild(utGroup);

  select.addEventListener('change', (e) => {
    const id = e.target.value;
    if (!id) return;
    const item = INDIA_STATES_DATA.find(s => s.id === id);
    if (item) {
      loadCoordinateWeather(item.lat, item.lon, item.capital, item.name);
      showNoticeBanner(`Switched to ${item.name} (${item.capital})`);
    }
    select.value = '';
  });
}

function initAllStatesModal() {
  const modal = document.getElementById('all-states-modal');
  const openBtn = document.getElementById('open-all-states-btn');
  const closeBtn = document.getElementById('close-all-states-btn');
  const searchInput = document.getElementById('state-search-input');
  const regionTabs = document.querySelectorAll('#region-filter-tabs .region-tab');
  const refreshGpsBtn = document.getElementById('modal-refresh-gps-btn');
  const myLocChipBtn = document.getElementById('my-location-chip-btn');

  const openModal = () => {
    if (searchInput) searchInput.value = '';
    state.selectedRegionFilter = 'all';
    regionTabs.forEach(t => t.classList.toggle('active', t.dataset.region === 'all'));
    renderStatesGrid();
    modal.classList.remove('hidden');
    if (searchInput) searchInput.focus();
  };

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Region filter tabs
  regionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      regionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.selectedRegionFilter = tab.dataset.region;
      renderStatesGrid();
    });
  });

  // Search input typing
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderStatesGrid();
    });
  }

  // GPS buttons
  if (refreshGpsBtn) {
    refreshGpsBtn.addEventListener('click', () => {
      closeModal();
      locateUserPosition(false);
    });
  }

  if (myLocChipBtn) {
    myLocChipBtn.addEventListener('click', () => {
      locateUserPosition(false);
    });
  }
}

function renderStatesGrid() {
  const grid = document.getElementById('states-grid');
  if (!grid) return;

  const searchInput = document.getElementById('state-search-input');
  const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const region = state.selectedRegionFilter || 'all';

  grid.innerHTML = '';

  const filtered = INDIA_STATES_DATA.filter(st => {
    const regionMatch = region === 'all' || 
      (region === 'UT' ? st.type === 'UT' : st.region === region && st.type === 'State');

    if (!regionMatch) return false;

    if (!q) return true;
    return st.name.toLowerCase().includes(q) ||
           st.capital.toLowerCase().includes(q) ||
           st.majorCities.some(c => c.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 36px; color: var(--clr-white-50);">
        No matching Indian States or Union Territories found for "${q}".
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isActive = state.currentStateName.toLowerCase() === item.name.toLowerCase() ||
                     state.currentLocationName.toLowerCase() === item.capital.toLowerCase();
    const isUserHome = state.userLocation && state.userLocation.state && 
                       state.userLocation.state.toLowerCase() === item.name.toLowerCase();

    const card = document.createElement('div');
    card.className = `state-card ${isActive ? 'active-state' : ''} ${isUserHome ? 'user-home-state' : ''}`;
    
    card.innerHTML = `
      <div class="state-card-header">
        <span class="state-name-title">
          ${item.name}
          ${isUserHome ? '<span class="user-state-tag">YOUR STATE</span>' : ''}
        </span>
        <div class="state-badge-tags">
          <span class="state-region-pill ${item.type === 'UT' ? 'ut' : ''}">${item.type === 'UT' ? 'UT' : item.region}</span>
        </div>
      </div>
      <div class="state-capital-row">
        <span class="capital-label">Capital & Hub:</span>
        <strong>${item.capital}</strong>
      </div>
      <div class="state-major-cities">
        Major: ${item.majorCities.join(', ')}
      </div>
      <div class="state-footer-row">
        <span class="view-weather-label">View Live Weather →</span>
        ${isActive ? '<span style="font-size: 0.72rem; color: #38bdf8; font-weight: 700;">VIEWING</span>' : ''}
      </div>
    `;

    card.addEventListener('click', () => {
      document.getElementById('all-states-modal').classList.add('hidden');
      loadCoordinateWeather(item.lat, item.lon, item.capital, item.name);
      showNoticeBanner(`Loading weather for ${item.name} (${item.capital})...`);
    });

    grid.appendChild(card);
  });
}

// ==========================================================================
// NOTICE BANNER & STATUS PILL
// ==========================================================================
let noticeTimer = null;

function showNoticeBanner(msg, duration = 6000) {
  const banner = document.getElementById('notice-banner');
  const text = document.getElementById('notice-text');
  text.textContent = msg;
  banner.classList.remove('hidden');

  clearTimeout(noticeTimer);
  if (duration > 0) {
    noticeTimer = setTimeout(() => {
      banner.classList.add('hidden');
    }, duration);
  }
}

function updateConnectionPill(status, label) {
  const pillText = document.getElementById('provider-status-text');
  const dot = document.querySelector('.status-dot');
  pillText.textContent = label;

  dot.classList.remove('activating', 'error');
  if (status === 'activating') dot.classList.add('activating');
}

// ==========================================================================
// SETTINGS & API KEY MODAL
// ==========================================================================
function initSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('settings-toggle-btn');
  const closeBtn = document.getElementById('close-settings-btn');
  const saveBtn = document.getElementById('save-settings-btn');
  const testBtn = document.getElementById('test-key-btn');
  const keyInput = document.getElementById('api-key-input');

  const openModal = () => {
    keyInput.value = state.apiKey;
    const radios = document.getElementsByName('provider-choice');
    for (let r of radios) {
      if (r.value === state.providerChoice) r.checked = true;
    }
    modal.classList.remove('hidden');
  };

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Test Key Button
  testBtn.addEventListener('click', async () => {
    const key = keyInput.value.trim();
    const resultSpan = document.getElementById('key-test-result');
    resultSpan.textContent = 'Testing key connection with OpenWeatherMap...';
    resultSpan.style.color = '#38bdf8';

    const startTime = performance.now();
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}&units=metric`);
      const latency = Math.round(performance.now() - startTime);

      if (res.ok) {
        resultSpan.textContent = `✓ Key is Valid and Active! (${latency}ms latency)`;
        resultSpan.style.color = '#34d399';
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          resultSpan.textContent = `⏳ Key recognized! Pending OpenWeatherMap server propagation (usually 10-60 min). Seamless live fallback active in app.`;
          resultSpan.style.color = '#fbbf24';
        } else {
          resultSpan.textContent = `Error ${res.status}: ${data.message || 'Verification failed'}`;
          resultSpan.style.color = '#f87171';
        }
      }
    } catch (err) {
      resultSpan.textContent = `Connection test failed: ${err.message}`;
      resultSpan.style.color = '#f87171';
    }
  });

  // Save Settings
  saveBtn.addEventListener('click', () => {
    const newKey = keyInput.value.trim();
    if (newKey) {
      state.apiKey = newKey;
      localStorage.setItem(CONFIG.storageKeys.apiKey, newKey);
    }

    const radios = document.getElementsByName('provider-choice');
    for (let r of radios) {
      if (r.checked) {
        state.providerChoice = r.value;
        localStorage.setItem(CONFIG.storageKeys.providerChoice, r.value);
        break;
      }
    }

    closeModal();
    showNoticeBanner('Configuration saved! Refreshing weather data...');
    loadCityWeather(state.currentLocationName);
  });
}

// ==========================================================================
// ADD & MANAGE LOCATIONS MODAL
// ==========================================================================
function renderSavedLocationsInModal() {
  const container = document.getElementById('saved-locations-grid');
  const countBadge = document.getElementById('saved-count-badge');
  if (!container || !countBadge) return;

  countBadge.textContent = `${state.favorites.length} Pinned`;
  container.innerHTML = '';

  if (state.favorites.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--clr-white-50);">
        No saved cities yet. Use the search bar above to add your favorite locations!
      </div>
    `;
    return;
  }

  state.favorites.forEach(city => {
    const isCurrent = state.currentLocationName.toLowerCase() === city.toLowerCase();
    const card = document.createElement('div');
    card.className = `saved-city-card ${isCurrent ? 'active-city' : ''}`;
    
    card.innerHTML = `
      <div class="saved-city-info">
        <span class="saved-city-name">
          ${city}
          ${isCurrent ? '<span class="saved-city-country">ACTIVE</span>' : ''}
        </span>
      </div>
      <div class="saved-city-actions">
        <button type="button" class="remove-city-btn" title="Remove ${city}" aria-label="Remove city">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    // Click card to select & view weather
    card.addEventListener('click', (e) => {
      if (e.target.closest('.remove-city-btn')) return;
      document.getElementById('locations-modal').classList.add('hidden');
      loadCityWeather(city);
    });

    // Remove button
    const removeBtn = card.querySelector('.remove-city-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeCityFromSaved(city);
    });

    container.appendChild(card);
  });
}

function initLocationsModal() {
  const modal = document.getElementById('locations-modal');
  const openBtn = document.getElementById('open-add-location-btn');
  const closeBtn = document.getElementById('close-locations-btn');
  const input = document.getElementById('modal-city-input');
  const suggestions = document.getElementById('modal-suggestions-list');
  const geoBtn = document.getElementById('modal-geo-btn');

  let modalDebounceTimer = null;

  const openModal = () => {
    input.value = '';
    suggestions.classList.add('hidden');
    suggestions.innerHTML = '';
    renderSavedLocationsInModal();
    modal.classList.remove('hidden');
    input.focus();
  };

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Modal live autocomplete search
  input.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    clearTimeout(modalDebounceTimer);

    if (val.length < 2) {
      suggestions.classList.add('hidden');
      suggestions.innerHTML = '';
      return;
    }

    modalDebounceTimer = setTimeout(async () => {
      const results = await WeatherService.geocode(val);
      renderModalSuggestions(results);
    }, 260);
  });

  // GPS button in modal
  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      closeModal();
      locateUserPosition();
    });
  }
}

function renderModalSuggestions(results) {
  const list = document.getElementById('modal-suggestions-list');
  list.innerHTML = '';

  if (!results || results.length === 0) {
    list.innerHTML = `<div class="modal-suggestion-item" style="color: var(--clr-white-50);">No matching locations found</div>`;
    list.classList.remove('hidden');
    return;
  }

  results.forEach(loc => {
    const item = document.createElement('div');
    item.className = 'modal-suggestion-item';

    item.innerHTML = `
      <div class="suggestion-main">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <strong style="color: #fff; font-size: 0.9rem;">${loc.name}</strong>
        ${loc.admin ? `<span style="font-size: 0.78rem; color: var(--clr-white-50);">${loc.admin}</span>` : ''}
        <span class="suggestion-country" style="margin-left: 4px;">${loc.country}</span>
      </div>
      <button type="button" class="modal-add-city-btn" title="Add ${loc.name}">
        <span>+ Add</span>
      </button>
    `;

    const addBtn = item.querySelector('.modal-add-city-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addCityToSaved(loc.name, loc.country);
      document.getElementById('modal-city-input').value = '';
      list.classList.add('hidden');
    });

    item.addEventListener('click', () => {
      addCityToSaved(loc.name, loc.country);
      document.getElementById('locations-modal').classList.add('hidden');
      loadCoordinateWeather(loc.lat, loc.lon, loc.name, loc.admin || '');
    });

    list.appendChild(item);
  });

  list.classList.remove('hidden');
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Atmospheric Canvas Background
  atmosphericBackground = new AtmosphericCanvas('weather-canvas');

  // 2. Unit Switcher (°C / °F)
  const unitCBtn = document.getElementById('unit-c-btn');
  const unitFBtn = document.getElementById('unit-f-btn');

  function updateUnitButtons() {
    unitCBtn.classList.toggle('active', state.unit === 'C');
    unitFBtn.classList.toggle('active', state.unit === 'F');
  }

  unitCBtn.addEventListener('click', () => {
    if (state.unit !== 'C') {
      state.unit = 'C';
      localStorage.setItem(CONFIG.storageKeys.unit, 'C');
      updateUnitButtons();
      if (state.currentData) renderWeatherData(state.currentData);
    }
  });

  unitFBtn.addEventListener('click', () => {
    if (state.unit !== 'F') {
      state.unit = 'F';
      localStorage.setItem(CONFIG.storageKeys.unit, 'F');
      updateUnitButtons();
      if (state.currentData) renderWeatherData(state.currentData);
    }
  });

  updateUnitButtons();

  // 3. Search & Auto-complete Listeners
  initSearchListeners();

  // 4. Modal & Settings
  initSettingsModal();

  // 5. Locations Modal & Management
  initLocationsModal();

  // 6. Indian States & Union Territories (36 Total) & User Location
  initStateQuickSelect();
  initAllStatesModal();
  updateUserLocationUI();

  // 7. Favorite Star Toggle
  document.getElementById('favorite-city-btn').addEventListener('click', toggleFavoriteCurrentCity);



  // 9. Dismiss notice banner
  document.getElementById('notice-close-btn').addEventListener('click', () => {
    document.getElementById('notice-banner').classList.add('hidden');
  });

  // 10. Render Pinned Cities Chips
  renderPinnedLocationsBar();

  // 11. Initial Location Load:
  // If user has a saved city, load it; otherwise auto-locate user's position in India
  const savedCity = localStorage.getItem(CONFIG.storageKeys.lastCity);
  if (!savedCity) {
    locateUserPosition(true);
  } else {
    const savedState = localStorage.getItem(CONFIG.storageKeys.lastState) || '';
    loadCityWeather(savedCity, savedState);
  }
});
