import React from 'react'
import { motion } from 'framer-motion'
import { Wind, Gauge, Sun, Droplets } from 'lucide-react'
import { getAQILevel } from '../../lib/weather-api'

interface HighlightsCardProps {
  weather: any
  airPollution: any
}

const HighlightsCard: React.FC<HighlightsCardProps> = ({ weather, airPollution }) => {
  if (!weather) return null

  const aqiData = airPollution?.list?.[0]
  const aqi = aqiData?.main?.aqi || 1
  const aqiLevel = getAQILevel(aqi)

  const highlights = [
    {
      title: 'Air Quality',
      value: aqiLevel.label,
      subvalue: `AQI ${aqi}`,
      icon: Wind,
      color: aqiLevel.color,
      badge: true
    },
    {
      title: 'UV Index',
      value: '6',
      subvalue: 'High exposure',
      icon: Sun,
      color: 'text-orange-400'
    },
    {
      title: 'Wind Status',
      value: `${weather.wind?.speed || 0} m/s`,
      subvalue: `${weather.wind?.deg || 0}° direction`,
      icon: Wind,
      color: 'text-blue-400'
    },
    {
      title: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      subvalue: 'Normal',
      icon: Gauge,
      color: 'text-green-400'
    }
  ]

  return (
    <div className="card-glass">
      <h3 className="text-lg font-semibold mb-4">Today's Highlights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-all relative"
          >
            <div className="flex items-center justify-between mb-3">
              <highlight.icon size={20} className={highlight.color} />
              {highlight.badge && (
                <motion.span 
                  className="px-2 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-20 text-primary"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {highlight.value}
                </motion.span>
              )}
            </div>
            <div className="text-sm text-text-variant mb-1">{highlight.title}</div>
            {!highlight.badge && (
              <motion.div 
                className="text-xl font-semibold mb-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {highlight.value}
              </motion.div>
            )}
            <div className="text-xs text-text-variant">{highlight.subvalue}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HighlightsCard