import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { WeatherProvider, useWeather } from './contexts/WeatherContext'
import { ToastProvider } from './components/ui/Toast'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Maps from './pages/Maps'
import Calendar from './pages/Calendar'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import AuthPage from './pages/AuthPage'
import LoadingScreen from './components/ui/LoadingScreen'

function AppContent() {
  const { user, loading, profile } = useAuth()
  const { weatherData } = useWeather()

  // Sync preferences to document data-attributes for global styling hooks
  useEffect(() => {
    const root = document.documentElement
    const prefs = profile?.preferences
    if (prefs) {
      root.dataset.theme = prefs.theme || 'dark'
      root.dataset.compact = String(!!prefs.compact)
      root.dataset.animations = String(!!prefs.animations)
      root.dataset.iconstyle = prefs.iconStyle || '3d'
      root.dataset.bgweather = String(!!prefs.backgroundWeather)

      if (prefs.animations === false) {
        root.classList.add('no-animations')
      } else {
        root.classList.remove('no-animations')
      }
    }
  }, [profile])

  // Choose atmospheric background based on current weather + time of day
  useEffect(() => {
    const root = document.documentElement
    const condition = weatherData?.current?.weather?.[0]?.main?.toLowerCase() || ''
    const isNight = (() => {
      try {
        const now = new Date()
        const hour = now.getHours()
        return hour < 6 || hour >= 19
      } catch {
        return false
      }
    })()

    let theme: 'fog' | 'rain' | 'clouds' | 'clear' | 'snow' | 'night' = 'clear'
    if (isNight) theme = 'night'
    if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) theme = isNight ? 'night' : 'fog'
    else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunder')) theme = isNight ? 'night' : 'rain'
    else if (condition.includes('cloud')) theme = isNight ? 'night' : 'clouds'
    else if (condition.includes('snow')) theme = isNight ? 'night' : 'snow'
    else if (condition.includes('clear')) theme = isNight ? 'night' : 'clear'

    root.dataset.bgtheme = theme
  }, [weatherData])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen app-bg">
        <AuthProvider>
          <WeatherProvider>
            <AppContent />
          </WeatherProvider>
        </AuthProvider>
      </div>
    </ToastProvider>
  )
}

export default App