import React, { createContext, useContext, useEffect, useState } from 'react'
import { storage, UserProfile } from '../lib/storage'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for authentication
const DEMO_USERS = [
  { id: '1', email: 'demo@weatherpro.com', password: 'demo123' },
  { id: '2', email: 'user@example.com', password: 'password' },
  { id: '3', email: 'test@test.com', password: 'test123' }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const currentUser = storage.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const userProfile = storage.getUserProfile()
      if (userProfile) {
        setProfile(userProfile)
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email,
          tempPreference: 20,
          healthSensitivities: {
            pollen: false,
            airQuality: false,
            humidity: false
          },
          preferences: {
            units: 'metric',
            theme: 'auto',
            notifications: true
          }
        }
        setProfile(defaultProfile)
        storage.saveUserProfile(defaultProfile)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (!demoUser) {
      return { error: 'Invalid email or password' }
    }

    const user = { id: demoUser.id, email: demoUser.email }
    setUser(user)
    storage.setCurrentUser(user)

    // Load or create profile
    let userProfile = storage.getUserProfile()
    if (!userProfile) {
      userProfile = {
        id: user.id,
        email: user.email,
        tempPreference: 20,
        healthSensitivities: {
          pollen: false,
          airQuality: false,
          humidity: false
        },
        preferences: {
          units: 'metric',
          theme: 'auto',
          notifications: true
        }
      }
      storage.saveUserProfile(userProfile)
    }
    setProfile(userProfile)

    return { error: null }
  }

  const signUp = async (email: string, password: string) => {
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === email)
    if (existingUser) {
      return { error: 'User already exists' }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password
    }

    // In a real app, you'd save this to a database
    // For demo, we'll just add to our demo users array
    DEMO_USERS.push(newUser)

    const user = { id: newUser.id, email: newUser.email }
    setUser(user)
    storage.setCurrentUser(user)

    // Create default profile
    const defaultProfile: UserProfile = {
      id: user.id,
      email: user.email,
      tempPreference: 20,
      healthSensitivities: {
        pollen: false,
        airQuality: false,
        humidity: false
      },
      preferences: {
        units: 'metric',
        theme: 'auto',
        notifications: true
      }
    }
    setProfile(defaultProfile)
    storage.saveUserProfile(defaultProfile)

    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    storage.signOut()
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      storage.saveUserProfile(updatedProfile)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}