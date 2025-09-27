import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Globe, Palette, Shield, Database, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useWeather } from '../contexts/WeatherContext'
import Badges from '../components/profile/Badges'
import { showToast } from '../components/ui/Toast'

const Settings: React.FC = () => {
  const { user, profile, updateProfile, signOut } = useAuth()
  const { searchLocation } = useWeather()
  const [activeSection, setActiveSection] = useState('profile')
  const [homeLocationQuery, setHomeLocationQuery] = useState('')
  const [locationResults, setLocationResults] = useState<any[]>([])
  const [tempPreference, setTempPreference] = useState(profile?.tempPreference || 20)

  const prefs = useMemo(() => profile?.preferences || {
    theme: 'dark', units: 'metric', notifications: true
  }, [profile])
  
  const settingSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'badges', label: 'Achievements', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Database }
  ]

  const handleLocationSearch = async (query: string) => {
    setHomeLocationQuery(query)
    if (query.length > 2) {
      const results = await searchLocation(query)
      setLocationResults(results.slice(0, 5))
    } else {
      setLocationResults([])
    }
  }

  const handleLocationSelect = (location: any) => {
    const homeLocation = {
      lat: location.lat,
      lon: location.lon,
      name: `${location.name}, ${location.country}`
    }
    updateProfile({ homeLocation })
    setHomeLocationQuery(homeLocation.name)
    setLocationResults([])
    showToast('Home location updated successfully!', 'success')
  }

  const handleTempPreferenceChange = (temp: number) => {
    setTempPreference(temp)
    if (updateProfile) {
      updateProfile({ tempPreference: temp })
    }
    showToast('Temperature preference updated!', 'success')
  }

  const updatePrefs = (partial: Partial<typeof prefs>) => {
    if (!profile) return
    const next = { ...prefs, ...partial }
    updateProfile({ preferences: next })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col lg:flex-row gap-6"
    >
      {/* Settings Navigation */}
      <div className="w-full lg:w-80">
        <div className="card-glass sticky top-0">
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          <nav className="space-y-2">
            {settingSections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-dark'
                    : 'text-text-variant hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <section.icon size={20} />
                <span>{section.label}</span>
              </motion.button>
            ))}
            
            <div className="border-t border-white/10 my-4"></div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all text-left"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </motion.button>
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        <div className="card-glass">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
              
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-dark text-2xl font-bold">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{user?.email}</h4>
                  <p className="text-text-variant">WeatherPro User</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Home Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={homeLocationQuery || profile?.homeLocation?.name || ''}
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      placeholder="Search for your city"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {locationResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background-surface border border-outline rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                        {locationResults.map((location, index) => (
                          <button
                            key={index}
                            onClick={() => handleLocationSelect(location)}
                            className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                          >
                            {location.name}, {location.country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature Preference</label>
                  <input
                    type="number"
                    value={tempPreference}
                    onChange={(e) => handleTempPreferenceChange(Number(e.target.value))}
                    min="-10"
                    max="40"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-text-variant mt-1">I feel cold below {tempPreference}°C</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Zone</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (Central European Time)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Health Sensitivities</h4>
                <div className="space-y-3">
                  {[
                    { key: 'pollen', label: 'Pollen Alerts', desc: 'Get notified about high pollen levels' },
                    { key: 'airQuality', label: 'Air Quality Warnings', desc: 'Alert for poor air quality' },
                    { key: 'humidity', label: 'Humidity Sensitivity', desc: 'Warnings for high humidity levels' }
                  ].map((sensitivity) => (
                    <div key={sensitivity.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium">{sensitivity.label}</div>
                        <div className="text-sm text-text-variant">{sensitivity.desc}</div>
                      </div>
                      <button 
                        onClick={() => {
                          const newSensitivities = {
                            ...profile?.healthSensitivities,
                           [sensitivity.key]: !profile?.healthSensitivities?.[sensitivity.key as keyof typeof profile.healthSensitivities]
                          }
                         if (updateProfile) {
                           updateProfile({ healthSensitivities: newSensitivities })
                         }
                        }}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          profile?.healthSensitivities?.[sensitivity.key as keyof typeof profile.healthSensitivities] 
                            ? 'bg-primary' 
                            : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          profile?.healthSensitivities?.[sensitivity.key as keyof typeof profile.healthSensitivities] 
                            ? 'right-1' 
                            : 'left-1'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Badges */}
          {activeSection === 'badges' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badges />
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Notification Settings</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Weather Alerts', desc: 'Get notified about severe weather' },
                  { label: 'Daily Forecast', desc: 'Receive daily weather summary' },
                  { label: 'Rain Notifications', desc: 'Alert when rain is expected' },
                  { label: 'Temperature Warnings', desc: 'Extreme temperature alerts' },
                  { label: 'UV Index Alerts', desc: 'High UV index notifications' },
                  { label: 'Air Quality Updates', desc: 'Poor air quality warnings' }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium">{setting.label}</div>
                      <div className="text-sm text-text-variant">{setting.desc}</div>
                    </div>
                    <button className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Weather Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature Unit</label>
                  <select
                    value={prefs.units}
                    onChange={(e) => updatePrefs({ units: e.target.value as 'metric' | 'imperial' })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="metric">Celsius (°C)</option>
                    <option value="imperial">Fahrenheit (°F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Wind Speed Unit</label>
                  <select
                    value={prefs.windUnit || 'km/h'}
                    onChange={(e) => updatePrefs({ windUnit: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>km/h</option>
                    <option>mph</option>
                    <option>m/s</option>
                    <option>knots</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pressure Unit</label>
                  <select
                    value={prefs.pressureUnit || 'hPa'}
                    onChange={(e) => updatePrefs({ pressureUnit: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>hPa</option>
                    <option>inHg</option>
                    <option>mmHg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Distance Unit</label>
                  <select
                    value={prefs.distanceUnit || 'Kilometers'}
                    onChange={(e) => updatePrefs({ distanceUnit: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>Kilometers</option>
                    <option>Miles</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Default Location</h4>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Use Current Location</div>
                      <div className="text-sm text-text-variant">Automatically detect your location</div>
                    </div>
                    <button
                      onClick={() => updatePrefs({ useCurrentLocation: !prefs.useCurrentLocation })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${prefs.useCurrentLocation ? 'bg-primary' : 'bg-white/20'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${prefs.useCurrentLocation ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Appearance Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Theme</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['dark', 'light', 'auto'].map((theme) => (
                      <motion.div
                        key={theme}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => updatePrefs({ theme: theme as any })}
                        className={`p-4 bg-white/5 rounded-lg cursor-pointer border-2 ${prefs.theme === theme ? 'border-primary' : 'border-transparent'}`}
                      >
                        <div className="text-center">
                          <div className={`w-16 h-12 mx-auto mb-2 rounded ${
                            theme === 'dark' ? 'bg-black' : 
                            theme === 'light' ? 'bg-white' : 
                            'bg-gradient-to-r from-gray-800 to-white'
                          }`}></div>
                          <div className="font-medium capitalize">{theme}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Weather Icons</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['modern', 'classic', 'minimal', '3d'].map((style) => (
                      <div
                        key={style}
                        onClick={() => updatePrefs({ iconStyle: style as any })}
                        className={`p-4 bg-white/5 rounded-lg text-center cursor-pointer transition-all ${prefs.iconStyle === style ? 'ring-2 ring-primary' : 'hover:bg-white/10'}`}
                      >
                        <div className="text-2xl mb-2">☀️</div>
                        <div className="font-medium text-sm capitalize">{style}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Display Options</h4>
                  <div className="space-y-4">
                    {[
                      { key: 'animations', label: 'Show Animations', desc: 'Enable smooth transitions and effects' },
                      { key: 'compact', label: 'Compact Mode', desc: 'Show more information in less space' },
                      { key: 'twentyFourHour', label: '24-Hour Format', desc: 'Display time in 24-hour format' },
                      { key: 'backgroundWeather', label: 'Show Background Weather', desc: 'Dynamic backgrounds based on weather' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium">{setting.label}</div>
                          <div className="text-sm text-text-variant">{setting.desc}</div>
                        </div>
                        <button
                          onClick={() => updatePrefs({ [setting.key]: !(prefs as any)[setting.key] } as any)}
                          className={`w-12 h-6 rounded-full relative transition-colors ${(prefs as any)[setting.key] ? 'bg-primary' : 'bg-white/20'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${(prefs as any)[setting.key] ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Privacy & Security</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Location Sharing', desc: 'Share your location for accurate forecasts' },
                  { label: 'Usage Analytics', desc: 'Help improve the app with anonymous usage data' },
                  { label: 'Personalized Recommendations', desc: 'Get weather insights based on your preferences' },
                  { label: 'Third-party Integration', desc: 'Allow calendar and other app integrations' }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium">{setting.label}</div>
                      <div className="text-sm text-text-variant">{setting.desc}</div>
                    </div>
                    <button className="w-12 h-6 bg-white/20 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Data Management</h4>
                <p className="text-sm text-text-variant mb-4">
                  Manage your account data and privacy settings.
                </p>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                    Delete Account
                  </button>
                  <button className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    Export Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Data & Storage */}
          {activeSection === 'data' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Data & Storage</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Storage Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Weather Data</span>
                      <span>45 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache</span>
                      <span>12 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Settings</span>
                      <span>2 MB</span>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>59 MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Data Sync</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto Sync</div>
                        <div className="text-sm text-text-variant">Sync across devices</div>
                      </div>
                      <button className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </button>
                    </div>
                    <div className="text-sm text-green-400">
                      Last sync: 2 minutes ago
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Cache Management</h4>
                <p className="text-sm text-text-variant mb-4">
                  Clear cached data to free up space. This won't affect your settings.
                </p>
                <button className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  Clear Cache
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Settings