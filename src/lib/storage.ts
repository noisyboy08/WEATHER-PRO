/**
 * Local storage utilities for user data persistence
 */

export interface UserProfile {
  id: string
  email: string
  name?: string
  homeLocation?: {
    lat: number
    lon: number
    name: string
  }
  tempPreference: number
  healthSensitivities: {
    pollen: boolean
    airQuality: boolean
    humidity: boolean
  }
  preferences: {
    units: 'metric' | 'imperial'
    theme: 'auto' | 'light' | 'dark'
    notifications: boolean
    // Optional UI flags
    animations?: boolean
    compact?: boolean
    twentyFourHour?: boolean
    backgroundWeather?: boolean
    iconStyle?: 'modern' | 'classic' | 'minimal' | '3d'
    windUnit?: 'km/h' | 'mph' | 'm/s' | 'knots'
    pressureUnit?: 'hPa' | 'inHg' | 'mmHg'
    distanceUnit?: 'Kilometers' | 'Miles'
  }
}

export interface CalendarEvent {
  id: string
  userId: string
  title: string
  date: Date
  location?: {
    lat: number
    lon: number
    name: string
  }
  cachedForecast?: any
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria: string
  unlocked: boolean
  unlockedAt?: Date
}

export interface WeatherHistory {
  id: string
  userId: string
  date: Date
  location: string
  temperature: number
  condition: string
  weatherCode: string
}

// Default badges
export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'weather-explorer',
    name: 'Weather Explorer',
    description: 'Check weather in 5 different cities',
    icon: '🌍',
    criteria: 'locations_visited',
    unlocked: false
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Check weather before 6 AM',
    icon: '🌅',
    criteria: 'early_morning_checks',
    unlocked: false
  },
  {
    id: 'storm-chaser',
    name: 'Storm Chaser',
    description: 'Experience 3 thunderstorms',
    icon: '⛈️',
    criteria: 'thunderstorm_encounters',
    unlocked: false
  },
  {
    id: 'sun-seeker',
    name: 'Sun Seeker',
    description: 'Enjoy 10 sunny days',
    icon: '☀️',
    criteria: 'sunny_days',
    unlocked: false
  },
  {
    id: 'rain-dancer',
    name: 'Rain Dancer',
    description: 'Experience 5 rainy days',
    icon: '🌧️',
    criteria: 'rainy_days',
    unlocked: false
  },
  {
    id: 'snow-lover',
    name: 'Snow Lover',
    description: 'Experience snowy weather',
    icon: '❄️',
    criteria: 'snow_encounters',
    unlocked: false
  },
  {
    id: 'heat-warrior',
    name: 'Heat Warrior',
    description: 'Survive temperatures above 35°C',
    icon: '🔥',
    criteria: 'high_temperature',
    unlocked: false
  },
  {
    id: 'cold-survivor',
    name: 'Cold Survivor',
    description: 'Endure temperatures below 0°C',
    icon: '🧊',
    criteria: 'low_temperature',
    unlocked: false
  },
  {
    id: 'weather-guru',
    name: 'Weather Guru',
    description: 'Use the app for 30 consecutive days',
    icon: '🧙‍♂️',
    criteria: 'consecutive_days',
    unlocked: false
  },
  {
    id: 'ai-friend',
    name: 'AI Friend',
    description: 'Have 10 conversations with the AI assistant',
    icon: '🤖',
    criteria: 'ai_conversations',
    unlocked: false
  }
]

class LocalStorage {
  private getKey(key: string): string {
    return `weatherpro_${key}`
  }

  // User Profile Management
  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.getKey('profile'), JSON.stringify(profile))
  }

  getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(this.getKey('profile'))
    return data ? JSON.parse(data) : null
  }

  // Authentication
  setCurrentUser(user: { id: string; email: string }): void {
    localStorage.setItem(this.getKey('currentUser'), JSON.stringify(user))
  }

  getCurrentUser(): { id: string; email: string } | null {
    const data = localStorage.getItem(this.getKey('currentUser'))
    return data ? JSON.parse(data) : null
  }

  signOut(): void {
    localStorage.removeItem(this.getKey('currentUser'))
    localStorage.removeItem(this.getKey('profile'))
  }

  // Calendar Events
  saveCalendarEvents(events: CalendarEvent[]): void {
    localStorage.setItem(this.getKey('calendar_events'), JSON.stringify(events))
  }

  getCalendarEvents(): CalendarEvent[] {
    const data = localStorage.getItem(this.getKey('calendar_events'))
    return data ? JSON.parse(data) : []
  }

  addCalendarEvent(event: CalendarEvent): void {
    const events = this.getCalendarEvents()
    events.push(event)
    this.saveCalendarEvents(events)
  }

  // Badges
  getUserBadges(): Badge[] {
    const data = localStorage.getItem(this.getKey('badges'))
    if (data) {
      return JSON.parse(data)
    }
    // Initialize with default badges
    this.saveUserBadges(DEFAULT_BADGES)
    return DEFAULT_BADGES
  }

  saveUserBadges(badges: Badge[]): void {
    localStorage.setItem(this.getKey('badges'), JSON.stringify(badges))
  }

  unlockBadge(badgeId: string): boolean {
    const badges = this.getUserBadges()
    const badge = badges.find(b => b.id === badgeId)
    if (badge && !badge.unlocked) {
      badge.unlocked = true
      badge.unlockedAt = new Date()
      this.saveUserBadges(badges)
      return true
    }
    return false
  }

  // Weather History
  addWeatherHistory(entry: WeatherHistory): void {
    const history = this.getWeatherHistory()
    history.push(entry)
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(0, history.length - 100)
    }
    localStorage.setItem(this.getKey('weather_history'), JSON.stringify(history))
  }

  getWeatherHistory(): WeatherHistory[] {
    const data = localStorage.getItem(this.getKey('weather_history'))
    return data ? JSON.parse(data) : []
  }

  // Statistics for badges
  getStatistics(): any {
    const data = localStorage.getItem(this.getKey('statistics'))
    return data ? JSON.parse(data) : {
      locationsVisited: new Set(),
      earlyMorningChecks: 0,
      thunderstormEncounters: 0,
      sunnyDays: 0,
      rainyDays: 0,
      snowEncounters: 0,
      highTemperatureEncounters: 0,
      lowTemperatureEncounters: 0,
      consecutiveDays: 0,
      aiConversations: 0,
      lastCheckDate: null
    }
  }

  updateStatistics(updates: any): void {
    const stats = this.getStatistics()
    const updatedStats = { ...stats, ...updates }
    
    // Convert Set to Array for storage
    if (updatedStats.locationsVisited instanceof Set) {
      updatedStats.locationsVisited = Array.from(updatedStats.locationsVisited)
    }
    
    localStorage.setItem(this.getKey('statistics'), JSON.stringify(updatedStats))
  }
}

export const storage = new LocalStorage()

// Badge checking logic
export const checkAndUnlockBadges = (weatherData?: any, location?: string): string[] => {
  const stats = storage.getStatistics()
  const newlyUnlocked: string[] = []

  // Convert array back to Set if needed
  if (Array.isArray(stats.locationsVisited)) {
    stats.locationsVisited = new Set(stats.locationsVisited)
  }

  if (weatherData && location) {
    // Update statistics
    stats.locationsVisited.add(location)
    
    const currentHour = new Date().getHours()
    if (currentHour < 6) {
      stats.earlyMorningChecks++
    }

    const condition = weatherData.weather?.[0]?.main?.toLowerCase()
    const temp = weatherData.main?.temp

    if (condition?.includes('thunderstorm')) {
      stats.thunderstormEncounters++
    }
    if (condition?.includes('clear') || condition?.includes('sun')) {
      stats.sunnyDays++
    }
    if (condition?.includes('rain')) {
      stats.rainyDays++
    }
    if (condition?.includes('snow')) {
      stats.snowEncounters++
    }
    if (temp > 35) {
      stats.highTemperatureEncounters++
    }
    if (temp < 0) {
      stats.lowTemperatureEncounters++
    }

    // Check consecutive days
    const today = new Date().toDateString()
    const lastCheck = stats.lastCheckDate
    if (lastCheck) {
      const lastDate = new Date(lastCheck)
      const daysDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff === 1) {
        stats.consecutiveDays++
      } else if (daysDiff > 1) {
        stats.consecutiveDays = 1
      }
    } else {
      stats.consecutiveDays = 1
    }
    stats.lastCheckDate = today

    storage.updateStatistics(stats)

    // Check badge criteria
    const badges = storage.getUserBadges()
    
    if (stats.locationsVisited.size >= 5 && storage.unlockBadge('weather-explorer')) {
      newlyUnlocked.push('Weather Explorer')
    }
    if (stats.earlyMorningChecks >= 1 && storage.unlockBadge('early-bird')) {
      newlyUnlocked.push('Early Bird')
    }
    if (stats.thunderstormEncounters >= 3 && storage.unlockBadge('storm-chaser')) {
      newlyUnlocked.push('Storm Chaser')
    }
    if (stats.sunnyDays >= 10 && storage.unlockBadge('sun-seeker')) {
      newlyUnlocked.push('Sun Seeker')
    }
    if (stats.rainyDays >= 5 && storage.unlockBadge('rain-dancer')) {
      newlyUnlocked.push('Rain Dancer')
    }
    if (stats.snowEncounters >= 1 && storage.unlockBadge('snow-lover')) {
      newlyUnlocked.push('Snow Lover')
    }
    if (stats.highTemperatureEncounters >= 1 && storage.unlockBadge('heat-warrior')) {
      newlyUnlocked.push('Heat Warrior')
    }
    if (stats.lowTemperatureEncounters >= 1 && storage.unlockBadge('cold-survivor')) {
      newlyUnlocked.push('Cold Survivor')
    }
    if (stats.consecutiveDays >= 30 && storage.unlockBadge('weather-guru')) {
      newlyUnlocked.push('Weather Guru')
    }
    if (stats.aiConversations >= 10 && storage.unlockBadge('ai-friend')) {
      newlyUnlocked.push('AI Friend')
    }
  }

  return newlyUnlocked
}

export const incrementAIConversations = (): string[] => {
  const stats = storage.getStatistics()
  stats.aiConversations++
  storage.updateStatistics(stats)

  const newlyUnlocked: string[] = []
  if (stats.aiConversations >= 10 && storage.unlockBadge('ai-friend')) {
    newlyUnlocked.push('AI Friend')
  }
  return newlyUnlocked
}