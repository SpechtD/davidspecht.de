const greets = [
  "Guten Abend.",
  "Guten Morgen!",
  "Guten Mittag!",
  "Guten Abend.",
];

const wmoCodeToEmojiMap = {
  0: '☀️',   // Clear sky
  1: '🌤️',   // Mainly clear
  2: '⛅',   // Partly cloudy
  3: '☁️',   // Overcast
  45: '🌫️',  // Fog
  48: '🌫️',  // Depositing rime fog
  51: '🌧️',  // Drizzle: Light intensity
  53: '🌧️',  // Drizzle: Moderate intensity
  55: '🌧️',  // Drizzle: Dense intensity
  56: '🌧️',  // Freezing Drizzle: Light intensity
  57: '🌧️',  // Freezing Drizzle: Dense intensity
  61: '🌧️',  // Rain: Slight intensity
  63: '🌧️',  // Rain: Moderate intensity
  65: '🌧️',  // Rain: Heavy intensity
  66: '🌧️',  // Freezing Rain: Light intensity
  67: '🌧️',  // Freezing Rain: Heavy intensity
  71: '❄️',  // Snow fall: Slight intensity
  73: '❄️',  // Snow fall: Moderate intensity
  75: '❄️',  // Snow fall: Heavy intensity
  77: '❄️',  // Snow grains
  80: '🌧️',  // Rain showers: Slight intensity
  81: '🌧️',  // Rain showers: Moderate intensity
  82: '🌧️',  // Rain showers: Violent intensity
  85: '❄️',  // Snow showers: Slight intensity
  86: '❄️',  // Snow showers: Heavy intensity
  95: '⛈️',  // Thunderstorm: Slight or moderate
  96: '⛈️',  // Thunderstorm with slight hail
  99: '⛈️'   // Thunderstorm with heavy hail
};

const getJulianDate = (date = new Date()) => {
  const time = date.getTime();
  const tzoffset = date.getTimezoneOffset()

  return (time / 86400000) - (tzoffset / 1440) + 2440587.5;
}

const LUNAR_MONTH = 29.530588853;
const getLunarAge = (date = new Date()) => {
  const percent = getLunarAgePercent(date);
  const age = percent * LUNAR_MONTH;
  return age;
}
const getLunarAgePercent = (date = new Date()) => {
  return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
}
const normalize = value => {
  value = value - Math.floor(value);
  if (value < 0)
    value = value + 1
  return value;
}

const getLunarPhase = (date = new Date()) => {
  const age = getLunarAge(date);
  if (age < 1.84566)
    return "🌑";
  else if (age < 5.53699)
    return "🌒";
  else if (age < 9.22831)
    return "🌓";
  else if (age < 12.91963)
    return "🌔";
  else if (age < 16.61096)
    return "🌕";
  else if (age < 20.30228)
    return "🌖";
  else if (age < 23.99361)
    return "🌗";
  else if (age < 27.68493)
    return "🌘";
  return "🌑";
}

async function getWeather() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=48.27&longitude=11.84&models=icon_seamless&current=is_day,weather_code";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

const weather = await getWeather();

const wmo = weather.current.weather_code;
const isDay = weather.current.is_day;

const index = Math.floor(new Date().getHours() / 24 * greets.length);


document.getElementById("greeting").innerHTML =  (isDay ? wmoCodeToEmojiMap[wmo] : getLunarPhase()) + ' ' + greets[index];
console.log(wmo + ' ' + wmoCodeToEmojiMap[wmo]);
console.log(isDay);
