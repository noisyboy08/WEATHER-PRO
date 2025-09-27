import React, { useState } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Download, Filter } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { storage } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'
import EmptyState from '../components/ui/EmptyState'

// Mock data
const temperatureData = [
  { date: 'Jan 1', temp: 15, feels: 12 },
  { date: 'Jan 2', temp: 18, feels: 16 },
  { date: 'Jan 3', temp: 22, feels: 21 },
  { date: 'Jan 4', temp: 20, feels: 18 },
  { date: 'Jan 5', temp: 17, feels: 15 },
  { date: 'Jan 6', temp: 25, feels: 24 },
  { date: 'Jan 7', temp: 28, feels: 27 }
]

const precipitationData = [
  { month: 'Jul', rainfall: 45 },
  { month: 'Aug', rainfall: 32 },
  { month: 'Sep', rainfall: 67 },
  { month: 'Oct', rainfall: 89 },
  { month: 'Nov', rainfall: 43 },
  { month: 'Dec', rainfall: 56 },
  { month: 'Jan', rainfall: 78 }
]

const weatherDistribution = [
  { name: 'Sunny', value: 45, color: '#ffd93d' },
  { name: 'Cloudy', value: 30, color: '#6c5ce7' },
  { name: 'Rainy', value: 20, color: '#74b9ff' },
  { name: 'Stormy', value: 5, color: '#fd79a8' }
]

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const { user } = useAuth()
  const [weatherHistory, setWeatherHistory] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      const history = storage.getWeatherHistory().filter(h => h.userId === user.id)
      setWeatherHistory(history)
    }
  }, [user])

  const timeRanges = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '1y', label: '1 Year' }
  ]

  // Process weather history for charts
  const processedData = weatherHistory.slice(-7).map((entry, index) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temp: entry.temperature,
    feels: entry.temperature - 2 + Math.random() * 4, // Simulate feels like
    location: entry.location
  }))

  if (weatherHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex items-center justify-center"
      >
        <EmptyState
          icon={<BarChart3 size={48} />}
          title="No Analytics Data Yet"
          message="Start using the app to see your weather analytics and insights here."
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full space-y-6 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weather Analytics</h1>
          <p className="text-text-variant mt-1">
            Detailed insights and trends from your weather data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex bg-white bg-opacity-5 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  timeRange === range.key
                    ? 'bg-primary text-primary-dark font-medium'
                    : 'text-text-variant hover:text-text-primary'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Avg Temperature', 
            value: weatherHistory.length > 0 ? `${Math.round(weatherHistory.reduce((sum, h) => sum + h.temperature, 0) / weatherHistory.length)}°C` : 'N/A',
            change: '+2.3°', 
            trend: 'up', 
            icon: '🌡️' 
          },
          { 
            label: 'Locations Visited', 
            value: new Set(weatherHistory.map(h => h.location)).size.toString(),
            change: '+2 cities', 
            trend: 'up', 
            icon: '🌍' 
          },
          { 
            label: 'Weather Checks', 
            value: weatherHistory.length.toString(),
            change: `+${Math.min(weatherHistory.length, 10)}`, 
            trend: 'up', 
            icon: '📊' 
          },
          { 
            label: 'Days Active', 
            value: new Set(weatherHistory.map(h => new Date(h.date).toDateString())).size.toString(),
            change: '+3 days', 
            trend: 'up', 
            icon: '📅' 
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-glass"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <TrendingUp 
                size={16} 
                className={stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}
              />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-text-variant mb-2">{stat.label}</div>
            <div className={`text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change} from last period
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Trend */}
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Temperature Trend</h3>
            <Filter size={18} className="text-text-variant cursor-pointer hover:text-text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData.length > 0 ? processedData : temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#7b7980"
                fontSize={12}
              />
              <YAxis 
                stroke="#7b7980"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1d1c1f',
                  border: '1px solid #3e3d40',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#b5a1e5" 
                strokeWidth={3}
                dot={{ fill: '#b5a1e5', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#b5a1e5', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="feels" 
                stroke="#74b9ff" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#74b9ff', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Precipitation */}
        <div className="card-glass">
          <h3 className="text-lg font-semibold mb-6">Monthly Precipitation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={precipitationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#7b7980"
                fontSize={12}
              />
              <YAxis 
                stroke="#7b7980"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1d1c1f',
                  border: '1px solid #3e3d40',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="rainfall" 
                fill="#74b9ff"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Distribution */}
        <div className="card-glass">
          <h3 className="text-lg font-semibold mb-6">Weather Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={weatherDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {weatherDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1d1c1f',
                  border: '1px solid #3e3d40',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity & Pressure */}
        <div className="card-glass">
          <h3 className="text-lg font-semibold mb-6">Atmospheric Conditions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#7b7980"
                fontSize={12}
              />
              <YAxis 
                stroke="#7b7980"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1d1c1f',
                  border: '1px solid #3e3d40',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#a29bfe" 
                fill="#a29bfe"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="card-glass">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-500 bg-opacity-10 rounded-lg border border-blue-500 border-opacity-20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-medium text-blue-400">Trend Alert</span>
            </div>
            <p className="text-sm">
              Temperature has been trending 15% higher than seasonal average
            </p>
          </div>
          <div className="p-4 bg-green-500 bg-opacity-10 rounded-lg border border-green-500 border-opacity-20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium text-green-400">Pattern Detected</span>
            </div>
            <p className="text-sm">
              Clear weather pattern suggests sunny conditions for next 3 days
            </p>
          </div>
          <div className="p-4 bg-yellow-500 bg-opacity-10 rounded-lg border border-yellow-500 border-opacity-20">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="font-medium text-yellow-400">Recommendation</span>
            </div>
            <p className="text-sm">
              Optimal conditions for outdoor activities between 2-5 PM today
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics