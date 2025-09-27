import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Satellite, Map as MapIcon, Zap } from 'lucide-react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../contexts/AuthContext'

// Helper for OpenWeather tile URL with ENV key
const owUrl = (layer: string, opacity = 0.7) => {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  return {
    url: `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${key}`,
    opacity
  }
}

const Maps: React.FC = () => {
  const { profile } = useAuth()
  const theme = profile?.preferences?.theme || 'dark'
  const [activeLayer, setActiveLayer] = useState('temperature')

  const weatherLayers = [
    { id: 'temperature', label: 'Temperature', icon: '🌡️', color: '#ff6b6b' },
    { id: 'precipitation', label: 'Precipitation', icon: '🌧️', color: '#4ecdc4' },
    { id: 'wind', label: 'Wind Speed', icon: '💨', color: '#45b7d1' },
    { id: 'pressure', label: 'Pressure', icon: '📊', color: '#96ceb4' },
    { id: 'clouds', label: 'Cloud Cover', icon: '☁️', color: '#ffeaa7' },
    { id: 'humidity', label: 'Humidity', icon: '💧', color: '#a29bfe' }
  ]

  // Map overlay matching activeLayer
  const overlay = useMemo(() => {
    switch (activeLayer) {
      case 'temperature':
        return owUrl('temp_new')
      case 'precipitation':
        return owUrl('precipitation_new')
      case 'wind':
        return owUrl('wind_new')
      case 'pressure':
        return owUrl('pressure_new')
      case 'clouds':
        return owUrl('clouds_new')
      case 'humidity':
        return owUrl('humidity')
      default:
        return owUrl('temp_new')
    }
  }, [activeLayer])

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Interactive Weather Maps</h1>
          <p className="text-text-variant mt-1">
            Explore real-time weather data with interactive layers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2"
          >
            <Satellite size={18} />
            <span className="hidden sm:inline">Satellite View</span>
          </motion.button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 flex gap-4">
        {/* Layers Panel */}
        <div className="w-72 space-y-4">
          {/* Active Layer Info */}
          <div className="card-glass">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Layers size={18} />
                <span>Weather Layers</span>
              </h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {weatherLayers.map((layer) => (
                <motion.button
                  key={layer.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`p-3 rounded-lg transition-all flex items-center space-x-3 ${
                    activeLayer === layer.id
                      ? 'bg-primary text-primary-dark button-active-glow'
                      : 'bg-black/60 text-white/80 hover:bg-black/70'
                  }`}
                >
                  <span className="text-2xl md:text-3xl">{layer.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{layer.label}</div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  ></div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Map Controls */}
          <div className="card-glass">
            <h4 className="font-semibold mb-3">Map Controls</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Opacity</span>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  defaultValue="70"
                  className="w-24"
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    const el: HTMLImageElement | null = document.querySelector('.ow-layer')
                    if (el) el.style.opacity = String(value / 100)
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Animation</span>
                <button className="w-10 h-6 bg-primary rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">3D View</span>
                <button className="w-10 h-6 bg-white/20 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="card-glass">
            <h4 className="font-semibold mb-3">
              {weatherLayers.find(l => l.id === activeLayer)?.label} Legend
            </h4>
            <div className="space-y-2">
              {['Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((level, index) => {
                const activeLayerData = weatherLayers.find(l => l.id === activeLayer)
                return (
                  <div key={level} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ 
                        backgroundColor: activeLayerData?.color,
                        opacity: (index + 1) / 5
                      }}
                    ></div>
                    <span className="text-sm">{level}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 card-glass relative overflow-hidden min-h-[520px]">
          <MapContainer
            className="absolute inset-0 w-full h-full rounded-2xl leaflet-container"
            center={[18.5204, 73.8567]} // Pune default
            zoom={10}
            scrollWheelZoom
          >
            {/* Base map */}
            <TileLayer
              attribution={baseTile.attribution}
              url={baseTile.url}
            />
            {/* Weather overlay matching active layer */}
            <TileLayer
              className="ow-layer"
              url={overlay.url}
              opacity={overlay.opacity}
              zIndex={500}
            />
            {/* Optional: allow toggling layers via native LayersControl */}
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer url={baseTile.url} />
              </LayersControl.BaseLayer>
            </LayersControl>
          </MapContainer>

          {/* Map Overlay Info */}
          <div className="absolute top-4 left-4 glass rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <MapIcon size={16} />
              <span>Global Weather Map</span>
            </div>
          </div>

          {/* Live Update Indicator */}
          <div className="absolute top-4 right-4 glass rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Zap size={16} className="text-green-400" />
              <span>Live Updates</span>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center font-bold text-lg"
            >
              +
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center font-bold text-lg"
            >
              −
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Maps