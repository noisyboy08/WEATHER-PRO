import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Lock } from 'lucide-react'
import { storage, Badge } from '../../lib/storage'

const Badges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    const userBadges = storage.getUserBadges()
    const userStats = storage.getStatistics()
    setBadges(userBadges)
    setStats(userStats)
  }, [])

  const unlockedCount = badges.filter(b => b.unlocked).length
  const totalCount = badges.length

  const getProgressForBadge = (badge: Badge) => {
    const locationsVisited = Array.isArray(stats.locationsVisited) 
      ? stats.locationsVisited.length 
      : stats.locationsVisited?.size || 0

    switch (badge.id) {
      case 'weather-explorer':
        return Math.min(locationsVisited / 5, 1)
      case 'early-bird':
        return Math.min(stats.earlyMorningChecks / 1, 1)
      case 'storm-chaser':
        return Math.min(stats.thunderstormEncounters / 3, 1)
      case 'sun-seeker':
        return Math.min(stats.sunnyDays / 10, 1)
      case 'rain-dancer':
        return Math.min(stats.rainyDays / 5, 1)
      case 'snow-lover':
        return Math.min(stats.snowEncounters / 1, 1)
      case 'heat-warrior':
        return Math.min(stats.highTemperatureEncounters / 1, 1)
      case 'cold-survivor':
        return Math.min(stats.lowTemperatureEncounters / 1, 1)
      case 'weather-guru':
        return Math.min(stats.consecutiveDays / 30, 1)
      case 'ai-friend':
        return Math.min(stats.aiConversations / 10, 1)
      default:
        return 0
    }
  }

  const getProgressText = (badge: Badge) => {
    const locationsVisited = Array.isArray(stats.locationsVisited) 
      ? stats.locationsVisited.length 
      : stats.locationsVisited?.size || 0

    switch (badge.id) {
      case 'weather-explorer':
        return `${locationsVisited}/5 cities visited`
      case 'early-bird':
        return `${stats.earlyMorningChecks}/1 early checks`
      case 'storm-chaser':
        return `${stats.thunderstormEncounters}/3 storms experienced`
      case 'sun-seeker':
        return `${stats.sunnyDays}/10 sunny days`
      case 'rain-dancer':
        return `${stats.rainyDays}/5 rainy days`
      case 'snow-lover':
        return `${stats.snowEncounters}/1 snow encounter`
      case 'heat-warrior':
        return `${stats.highTemperatureEncounters}/1 hot day (>35°C)`
      case 'cold-survivor':
        return `${stats.lowTemperatureEncounters}/1 cold day (<0°C)`
      case 'weather-guru':
        return `${stats.consecutiveDays}/30 consecutive days`
      case 'ai-friend':
        return `${stats.aiConversations}/10 AI conversations`
      default:
        return 'Progress unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Award className="text-primary" size={24} />
          <h3 className="text-xl font-bold">Weather Achievements</h3>
        </div>
        <p className="text-text-variant">
          {unlockedCount} of {totalCount} badges earned
        </p>
        <div className="w-full bg-white bg-opacity-10 rounded-full h-2 mt-3">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge, index) => {
          const progress = getProgressForBadge(badge)
          const progressText = getProgressText(badge)

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all ${
                badge.unlocked
                  ? 'bg-primary bg-opacity-10 border-primary border-opacity-30'
                  : 'bg-white bg-opacity-5 border-white border-opacity-10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-3xl ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {badge.unlocked ? badge.icon : <Lock size={24} className="text-text-variant" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-semibold ${badge.unlocked ? 'text-primary' : 'text-text-variant'}`}>
                      {badge.name}
                    </h4>
                    {badge.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </div>
                  <p className="text-sm text-text-variant mb-2">{badge.description}</p>
                  
                  {!badge.unlocked && (
                    <div className="space-y-2">
                      <div className="text-xs text-text-variant">{progressText}</div>
                      <div className="w-full bg-white bg-opacity-10 rounded-full h-1">
                        <motion.div
                          className="bg-primary h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {badge.unlocked && badge.unlockedAt && (
                    <p className="text-xs text-primary">
                      Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Statistics Summary */}
      <div className="bg-white bg-opacity-5 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Your Weather Journey</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {Array.isArray(stats.locationsVisited) 
                ? stats.locationsVisited.length 
                : stats.locationsVisited?.size || 0}
            </div>
            <div className="text-xs text-text-variant">Cities Explored</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{stats.consecutiveDays || 0}</div>
            <div className="text-xs text-text-variant">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{stats.aiConversations || 0}</div>
            <div className="text-xs text-text-variant">AI Chats</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
            <div className="text-xs text-text-variant">Badges Earned</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Badges