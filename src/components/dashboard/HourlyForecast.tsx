import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { getWeatherIcon } from '../../lib/weather-api'

interface HourlyForecastProps {
  forecast: any
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  if (!forecast?.list) return null

  const hourlyData = forecast.list.slice(0, 8) // Next 24 hours (3-hour intervals)

  return (
    <div className="card-glass">
      <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
      <div className="overflow-x-auto">
        <motion.div 
          className="flex space-x-4 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {hourlyData.map((hour: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 text-center p-4 bg-white bg-opacity-5 rounded-lg min-w-[100px] hover:bg-opacity-10 transition-all"
            >
              <div className="text-sm text-text-variant mb-2">
                {index === 0 ? 'Now' : format(new Date(hour.dt * 1000), 'HH:mm')}
              </div>
              <div className="text-2xl mb-2">
                {getWeatherIcon(hour.weather[0].icon)}
              </div>
              <motion.div 
                className="font-semibold text-lg mb-1"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {Math.round(hour.main.temp)}°
              </motion.div>
              <div className="text-xs text-text-variant">
                {Math.round(hour.pop * 100)}% rain
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default HourlyForecast