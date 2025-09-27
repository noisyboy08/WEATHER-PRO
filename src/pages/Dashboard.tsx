import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWeather } from '../contexts/WeatherContext'
import WeatherCard from '../components/dashboard/WeatherCard'
import ForecastCard from '../components/dashboard/ForecastCard'
import HighlightsCard from '../components/dashboard/HighlightsCard'
import HourlyForecast from '../components/dashboard/HourlyForecast'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../contexts/AuthContext'

const MapCard: React.FC<{ lat: number; lon: number; theme: string }> = ({ lat, lon, theme }) => {
  const baseTile = useMemo(() => {
    if (theme === 'dark') {
      return {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
      }
    }
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  }, [theme])
  return (
    <div className="card-glass overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Location Map</h3>
      </div>
      <div className="relative h-64 rounded-2xl overflow-hidden">
        <MapContainer
          className="absolute inset-0 w-full h-full rounded-2xl"
          center={[lat, lon]}
          zoom={11}
          scrollWheelZoom
        >
          <TileLayer attribution={baseTile.attribution} url={baseTile.url} />
          <Circle center={[lat, lon]} radius={1200} pathOptions={{ color: '#b5a1e5', fillColor: '#b5a1e5', fillOpacity: 0.25 }} />
        </MapContainer>
      </div>
    </div>
  )
}

// Lightweight World Clock widget using timezone offset if available
const WorldClock: React.FC<{ label: string; offsetSeconds?: number }> = ({ label, offsetSeconds }) => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const localOffsetMs = new Date().getTimezoneOffset() * 60 * 1000
  const time = offsetSeconds != null ? new Date(now.getTime() + offsetSeconds * 1000 + localOffsetMs) : now
  const display = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(time)
  const dateStr = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(time)
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div>
        <div className="text-sm text-text-variant">{label}</div>
        <div className="text-2xl font-semibold text-glow-strong">{display}</div>
      </div>
      <div className="text-sm text-text-variant">{dateStr}</div>
    </div>
  )
}

const WorldClockCard: React.FC<{ timezoneOffset?: number; locationName: string }> = ({ timezoneOffset, locationName }) => (
  <div className="card-glass">
    <h3 className="font-semibold mb-3">World Time</h3>
    <div className="space-y-3">
      <WorldClock label={`${locationName}`} offsetSeconds={timezoneOffset} />
      <WorldClock label="UTC" offsetSeconds={0} />
      <WorldClock label="Local" />
    </div>
  </div>
)

// Mini month calendar widget
const MiniCalendar: React.FC = () => {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
  const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
  const startDay = new Date(monthStart)
  startDay.setDate(startDay.getDate() - startDay.getDay())
  const endDay = new Date(monthEnd)
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay()))
  const days: Date[] = []
  const d = new Date(startDay)
  while (d <= endDay) { days.push(new Date(d)); d.setDate(d.getDate() + 1) }
  const isSameDate = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  return (
    <div className="card-glass">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Calendar</h3>
        <div className="space-x-2">
          <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="px-2 py-1 rounded-lg hover:bg-white/10">◀</button>
          <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="px-2 py-1 rounded-lg hover:bg-white/10">▶</button>
        </div>
      </div>
      <div className="text-sm text-text-variant mb-2">
        {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(current)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-variant mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const inMonth = day.getMonth() === current.getMonth()
          const isToday = isSameDate(day, today)
          return (
            <div key={idx} className={`py-2 rounded-lg text-center ${inMonth ? 'text-white' : 'text-text-variant opacity-60'} ${isToday ? 'button-active-glow ring-1 ring-primary/60' : ''} hover:bg-white/10`}> 
              {day.getDate()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Dashboard: React.FC = () => {
  const { weatherData, loading, error, searchLocation, updateLocation } = useWeather()
  const { profile } = useAuth()
  const theme = profile?.preferences?.theme || 'dark'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load weather data</h2>
          <p className="text-text-variant">{error}</p>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weather Dashboard</h1>
          <p className="text-text-variant mt-1">
            Current conditions for {weatherData.location.name}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Weather */}
        <div className="lg:col-span-2 space-y-6">
          <WeatherCard weather={weatherData.current} location={weatherData.location} />
          <HourlyForecast forecast={weatherData.forecast} />
          <MiniCalendar />
          <MapCard lat={weatherData.location.lat} lon={weatherData.location.lon} theme={theme} />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <ForecastCard forecast={weatherData.forecast} />
          <HighlightsCard 
            weather={weatherData.current} 
            airPollution={weatherData.airPollution} 
          />
          <WorldClockCard timezoneOffset={weatherData?.timezone_offset ?? weatherData?.current?.timezone} locationName={weatherData.location.name} />
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard