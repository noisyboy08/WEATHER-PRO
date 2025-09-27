import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchData, url } from '../lib/weather-api'
import { storage, checkAndUnlockBadges } from '../lib/storage'
import { useAuth } from './AuthContext'
import { showToast } from '../components/ui/Toast'

interface WeatherData {
  current: any
  forecast: any
  airPollution: any
  location: {
    name: string
    lat: number
    lon: number
  }
}

interface WeatherContextType {
  weatherData: WeatherData | null
  loading: boolean
  error: string | null
  updateLocation: (lat: number, lon: number, locationName?: string) => Promise<void>
  searchLocation: (query: string) => Promise<any[]>
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, profile } = useAuth()

  const fetchWeatherData = useCallback(async (lat: number, lon: number, locationName?: string) => {
    setLoading(true)
    setError(null)

    try {
      const [current, forecast, airPollution, location] = await Promise.all([
        new Promise((resolve) => fetchData(url.currentWeather(lat, lon), resolve)),
        new Promise((resolve) => fetchData(url.forecast(lat, lon), resolve)),
        new Promise((resolve) => fetchData(url.airPollution(lat, lon), resolve)),
        locationName ? 
          Promise.resolve([{ name: locationName }]) :
          new Promise((resolve) => fetchData(url.reverseGeo(lat, lon), resolve))
      ])

      const weatherLocation = {
        name: locationName || (location as any[])[0]?.name || 'Unknown Location',
        lat,
        lon
      }

      setWeatherData({
        current,
        forecast,
        airPollution,
        location: weatherLocation
      })

      // Add to weather history and check badges
      if (user && current) {
        storage.addWeatherHistory({
          id: Date.now().toString(),
          userId: user.id,
          date: new Date(),
          location: weatherLocation.name,
          temperature: current.main.temp,
          condition: current.weather[0].main,
          weatherCode: current.weather[0].icon
        })

        // Check for new badges
        const newBadges = checkAndUnlockBadges(current, weatherLocation.name)
        newBadges.forEach(badgeName => {
          showToast(`🏆 Badge Unlocked: ${badgeName}!`, 'success')
        })
      }

    } catch (err) {
      setError('Failed to fetch weather data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateLocation = useCallback(async (lat: number, lon: number, locationName?: string) => {
    await fetchWeatherData(lat, lon, locationName)
  }, [fetchWeatherData])

  const searchLocation = useCallback(async (query: string): Promise<any[]> => {
    return new Promise((resolve) => {
      fetchData(url.geo(query), (data) => {
        resolve(data || [])
      })
    })
  }, [])

  // Load home location on mount if user has one
  useEffect(() => {
    if (profile?.homeLocation) {
      fetchWeatherData(
        profile.homeLocation.lat, 
        profile.homeLocation.lon, 
        profile.homeLocation.name
      )
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherData(latitude, longitude)
        },
        () => {
          // Default to New York if geolocation fails
          fetchWeatherData(40.7128, -74.0060, 'New York')
        }
      )
    } else {
      fetchWeatherData(40.7128, -74.0060, 'New York')
    }
  }, [profile, fetchWeatherData])

  const value = {
    weatherData,
    loading,
    error,
    updateLocation,
    searchLocation
  }

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}