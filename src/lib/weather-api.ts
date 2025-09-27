/**
 * @license MIT
 * @fileoverview Enhanced weather API with additional features
 * @copyright udaydolas08 2025 All rights reserved
 */

const API_key = "af0348ed3ad216d028627277b50db13f"

export const fetchData = function (URL: string, callback: (data: any) => void) {
  fetch(`${URL}&appid=${API_key}`)
    .then((res) => res.json())
    .then((data) => callback(data))
    .catch((error) => {
      console.error('Weather API Error:', error)
      callback(null)
    })
}

export const url = {
  currentWeather(lat: number, lon: number) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`
  },
  forecast(lat: number, lon: number) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`
  },
  airPollution(lat: number, lon: number) {
    return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`
  },
  reverseGeo(lat: number, lon: number) {
    return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`
  },
  geo(query: string) {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
  },
  oneCall(lat: number, lon: number) {
    return `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric`
  },
  historical(lat: number, lon: number, dt: number) {
    return `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&units=metric`
  }
}

// Weather condition utilities
export const getWeatherIcon = (code: string, isDay: boolean = true) => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  }
  return iconMap[code] || '🌤️'
}

export const getAQILevel = (aqi: number) => {
  const levels = [
    { range: [1, 1], label: 'Good', color: 'aqi-1' },
    { range: [2, 2], label: 'Fair', color: 'aqi-2' },
    { range: [3, 3], label: 'Moderate', color: 'aqi-3' },
    { range: [4, 4], label: 'Poor', color: 'aqi-4' },
    { range: [5, 5], label: 'Very Poor', color: 'aqi-5' }
  ]
  
  return levels.find(level => aqi >= level.range[0] && aqi <= level.range[1]) || levels[0]
}