import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { getWeatherIcon } from '../../lib/weather-api'

interface ForecastCardProps {
  forecast: any
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  if (!forecast?.list) return null

  // Group forecast by day (take one forecast per day)
  const dailyForecast = forecast.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5)

  return (
    <div className="card-glass">
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {dailyForecast.map((day: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-all"
          >
            <div className="flex items-center space-x-3">
              <motion.span 
                className="text-2xl"
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.2
                }}
                transition={{ duration: 0.5 }}
              >
                {getWeatherIcon(day.weather[0].icon)}
              </motion.span>
              <div>
                <div className="font-medium">
                  {index === 0 ? 'Today' : format(new Date(day.dt * 1000), 'EEE')}
                </div>
                <div className="text-sm text-text-variant capitalize">
                  {day.weather[0].description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{Math.round(day.main.temp_max)}°</div>
              <div className="text-sm text-text-variant">{Math.round(day.main.temp_min)}°</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ForecastCard