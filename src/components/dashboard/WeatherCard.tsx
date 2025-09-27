import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Thermometer, Eye, Droplets } from 'lucide-react'
import { getWeatherIcon } from '../../lib/weather-api'

interface WeatherCardProps {
  weather: any
  location: { name: string; lat: number; lon: number }
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, location }) => {
  if (!weather) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-glass relative overflow-hidden"
    >
      {/* Transparent holographic panel (no internal gradient) */}

      <div className="relative z-10">
        {/* Location */}
        <div className="flex items-center space-x-2 mb-4">
          <MapPin size={18} className="text-text-variant" />
          <span className="text-text-variant text-glow">{location.name}</span>
        </div>

        {/* Main Weather Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold mb-2 text-glow-strong"
            >
              <CountUpAnimation value={Math.round(weather.main.temp)} />°
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-text-variant capitalize text-glow"
            >
              {weather.weather[0].description}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
              rotate: [0, -6, 6, -6, 0],
              transition: { duration: 0.8 }
            }}
            transition={{ delay: 0.35, type: "spring", stiffness: 120, damping: 12 }}
            className="shrink-0 flex items-center justify-center"
          >
            <div className="weather-icon w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 text-7xl md:text-8xl lg:text-9xl leading-none text-glow-strong">
              {getWeatherIcon(weather.weather[0].icon)}
            </div>
          </motion.div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Thermometer size={20} className="mx-auto mb-2 text-text-variant" />
            <div className="text-sm text-text-variant text-glow">Feels like</div>
            <div className="font-semibold text-glow-strong">{Math.round(weather.main.feels_like)}°</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Droplets size={20} className="mx-auto mb-2 text-text-variant" />
            <div className="text-sm text-text-variant text-glow">Humidity</div>
            <div className="font-semibold text-glow-strong">{weather.main.humidity}%</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Eye size={20} className="mx-auto mb-2 text-text-variant" />
            <div className="text-sm text-text-variant text-glow">Visibility</div>
            <div className="font-semibold text-glow-strong">{weather.visibility ? `${weather.visibility / 1000}km` : 'N/A'}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="text-lg mb-2 text-glow">💨</div>
            <div className="text-sm text-text-variant text-glow">Wind</div>
            <div className="font-semibold text-glow-strong">{weather.wind.speed} m/s</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Count up animation component
const CountUpAnimation: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setCount(Math.round(increment * currentStep))
      
      if (currentStep >= steps) {
        setCount(value)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return <span>{count}</span>
}

export default WeatherCard