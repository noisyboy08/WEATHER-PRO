import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader } from 'lucide-react'
import { useWeather } from '../../contexts/WeatherContext'

const LocationSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { searchLocation, updateLocation } = useWeather()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchLocation(searchQuery)
      setResults(searchResults || [])
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = async (location: any) => {
    setQuery(`${location.name}, ${location.country}`)
    setIsOpen(false)
    setResults([])
    await updateLocation(location.lat, location.lon, `${location.name}, ${location.country}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-variant" size={18} />
        <input
          type="text"
          aria-label="Search for a city"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-10 py-3 md:py-3 rounded-lg md:rounded-xl bg-white/8 border border-white/15 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent placeholder-white/60 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_8px_20px_rgba(0,0,0,0.25)]"
        />
        {loading && (
          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 text-text-variant animate-spin" size={18} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
          >
            {results.map((location, index) => (
              <motion.button
                key={`${location.lat}-${location.lon}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                <MapPin size={16} className="text-text-variant" />
                <div>
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-text-variant">
                    {location.state ? `${location.state}, ` : ''}{location.country}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LocationSearch