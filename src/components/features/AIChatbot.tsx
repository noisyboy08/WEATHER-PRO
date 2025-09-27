import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User } from 'lucide-react'
import { useWeather } from '../../contexts/WeatherContext'
import { useAuth } from '../../contexts/AuthContext'
import { storage, incrementAIConversations } from '../../lib/storage'
import { showToast } from '../ui/Toast'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AIChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI weather assistant. I can help you understand weather patterns, provide forecasts, and answer questions about weather conditions. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { weatherData } = useWeather()
  const { profile } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateWeatherResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()
    
    if (!weatherData?.current) {
      return "I need weather data to help you. Please wait while we load the current weather information."
    }

    const { current, location } = weatherData
    const tempPref = profile?.tempPreference || 20
    
    // Temperature questions
    if (message.includes('temperature') || message.includes('temp') || message.includes('hot') || message.includes('cold')) {
      const temp = Math.round(current.main.temp)
      const feelsLike = Math.round(current.main.feels_like)
      let advice = `The current temperature in ${location.name} is ${temp}°C (${Math.round((temp * 9/5) + 32)}°F). It feels like ${feelsLike}°C.`
      
      if (temp < tempPref) {
        advice += ` Since you feel cold below ${tempPref}°C, you might want to dress warmly today!`
      } else if (temp > tempPref + 10) {
        advice += ` It's much warmer than your preference of ${tempPref}°C, so light clothing would be comfortable.`
      } else {
        advice += ` The temperature is close to your comfort zone around ${tempPref}°C.`
      }
      
      return advice
    }
    
    // Rain/precipitation
    if (message.includes('rain') || message.includes('precipitation') || message.includes('umbrella')) {
      const hasRain = current.weather[0].main.toLowerCase().includes('rain')
      return hasRain 
        ? `Yes, it's currently raining in ${location.name}. You should take an umbrella if you're going out. The current conditions show ${current.weather[0].description}.`
        : `No rain is currently reported in ${location.name}. The weather is ${current.weather[0].description}. However, I recommend checking the forecast for later today.`
    }
    
    // Wind conditions
    if (message.includes('wind') || message.includes('windy')) {
      return `The current wind speed in ${location.name} is ${current.wind.speed} m/s (${Math.round(current.wind.speed * 2.237)} mph) from ${current.wind.deg}°. ${current.wind.speed > 10 ? "It's quite windy today!" : "The wind is relatively calm."}`
    }
    
    // Humidity
    if (message.includes('humid') || message.includes('humidity')) {
      return `The current humidity in ${location.name} is ${current.main.humidity}%. ${current.main.humidity > 70 ? "It's quite humid today, you might feel a bit sticky." : current.main.humidity < 30 ? "The air is quite dry today, consider staying hydrated." : "The humidity level is comfortable."}`
    }
    
    // General weather
    if (message.includes('weather') || message.includes('today') || message.includes('currently')) {
      return `The current weather in ${location.name} is ${current.weather[0].description}. Temperature: ${Math.round(current.main.temp)}°C, Humidity: ${current.main.humidity}%, Wind: ${current.wind.speed} m/s. ${current.main.temp > 25 ? "It's a warm day!" : current.main.temp < 5 ? "Bundle up, it's cold!" : "Pleasant weather today!"}`
    }
    
    // Clothing advice
    if (message.includes('wear') || message.includes('clothes') || message.includes('outfit')) {
      const temp = current.main.temp
      const userTemp = profile?.tempPreference || 20
      let advice = ""
      
      if (temp > userTemp + 10) {
        advice = "Light, breathable clothing like cotton shirts and shorts would be comfortable."
      } else if (temp > userTemp) {
        advice = "A light jacket or long-sleeve shirt should be perfect."
      } else if (temp > userTemp - 5) {
        advice = "You'll want a warm jacket, and consider layers."
      } else {
        advice = "Dress warmly with multiple layers, a heavy coat, and don't forget gloves and a hat!"
      }
      
      advice += ` Based on your temperature preference of ${userTemp}°C, `
      if (temp < userTemp) {
        advice += "you'll likely feel cold, so extra layers are recommended."
      } else {
        advice += "you should feel comfortable with the suggested clothing."
      }
      
      const hasRain = current.weather[0].main.toLowerCase().includes('rain')
      if (hasRain) advice += " Don't forget an umbrella or rain jacket!"
      
      return advice
    }
    
    // Health-related advice
    if (message.includes('health') || message.includes('allergy') || message.includes('pollen')) {
      let healthAdvice = `Current conditions in ${location.name}: `
      
      if (profile?.healthSensitivities?.pollen && (current.weather[0].main === 'Clear' || current.weather[0].main === 'Clouds')) {
        healthAdvice += "Pollen levels may be moderate to high on clear days like today. "
      }
      
      if (profile?.healthSensitivities?.airQuality) {
        healthAdvice += "Air quality information is available in the highlights section. "
      }
      
      if (profile?.healthSensitivities?.humidity && current.main.humidity > 70) {
        healthAdvice += `High humidity (${current.main.humidity}%) may cause discomfort. Stay hydrated and consider indoor activities.`
      }
      
      return healthAdvice || "No specific health concerns for current weather conditions."
    }
    
    // Default responses
    const responses = [
      `The weather in ${location.name} is currently ${current.weather[0].description} with a temperature of ${Math.round(current.main.temp)}°C.`,
      `Based on current conditions in ${location.name}, it's ${current.weather[0].description}. Would you like more specific information about temperature, wind, or humidity?`,
      `I can provide detailed weather information for ${location.name}. What specific aspect of the weather would you like to know about?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    // Simulate AI thinking time
    setTimeout(() => {
      // Check for new badges from AI conversation
      const newBadges = incrementAIConversations()
      newBadges.forEach(badgeName => {
        showToast(`🏆 Badge Unlocked: ${badgeName}!`, 'success')
      })
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateWeatherResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Chatbot container */}
          <motion.div
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 300, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-80 h-96 md:w-96 md:h-[500px] glass-strong rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-primary-dark" />
                </div>
                <div>
                  <h3 className="font-semibold">Weather Assistant</h3>
                  <p className="text-xs text-text-variant">AI-powered weather help</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-2 ${message.isUser ? 'justify-end' : ''}`}
                >
                  {!message.isUser && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-primary-dark" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-primary text-primary-dark ml-8'
                        : 'bg-white bg-opacity-10'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.isUser && (
                    <div className="w-6 h-6 bg-text-variant bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Bot size={14} className="text-primary-dark" />
                  </div>
                  <div className="bg-white bg-opacity-10 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-text-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-text-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-text-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white border-opacity-10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about the weather..."
                  className="flex-1 px-3 py-2 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="px-3 py-2 bg-primary text-primary-dark rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AIChatbot