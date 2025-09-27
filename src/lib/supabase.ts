import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_units: string
          favorite_locations: string[]
          notification_settings: any
          theme_preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_units?: string
          favorite_locations?: string[]
          notification_settings?: any
          theme_preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_units?: string
          favorite_locations?: string[]
          notification_settings?: any
          theme_preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      weather_alerts: {
        Row: {
          id: string
          user_id: string
          location: string
          alert_type: string
          conditions: any
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location: string
          alert_type: string
          conditions?: any
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location?: string
          alert_type?: string
          conditions?: any
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}