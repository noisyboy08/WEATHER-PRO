import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Sun, Cloud, CloudRain, Wind } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import { storage, CalendarEvent } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'
import { useWeather } from '../contexts/WeatherContext'
import { showToast } from '../components/ui/Toast'

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const { user } = useAuth()
  const { searchLocation } = useWeather()

  useEffect(() => {
    if (user) {
      const userEvents = storage.getCalendarEvents().filter(e => e.userId === user.id)
      setEvents(userEvents)
    }
  }, [user])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Extend to show complete weeks
  const calendarStart = new Date(monthStart)
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay())
  
  const calendarEnd = new Date(monthEnd)
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()))
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const addEvent = () => {
    if (!newEventTitle.trim() || !user) return
    
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      userId: user.id,
      title: newEventTitle.trim(),
      date: selectedDate,
      location: undefined,
      cachedForecast: undefined
    }
    
    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    storage.addCalendarEvent(newEvent)
    setNewEventTitle('')
    setShowAddEvent(false)
    showToast('Event added successfully!', 'success')
  }

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'sun': return <Sun size={16} className="text-yellow-400" />
      case 'cloud': return <Cloud size={16} className="text-gray-400" />
      case 'rain': return <CloudRain size={16} className="text-blue-400" />
      case 'wind': return <Wind size={16} className="text-green-400" />
      default: return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Weather Calendar</h1>
          <p className="text-text-variant mt-1">
            Plan your activities with weather-integrated calendar
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddEvent(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Event</span>
        </motion.button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="card-glass h-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-text-variant">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isDayToday = isToday(day)
                const isSelected = isSameDay(day, selectedDate)

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-3 h-20 rounded-lg transition-all flex flex-col items-center justify-between
                      ${isCurrentMonth 
                        ? 'hover:bg-white hover:bg-opacity-10' 
                        : 'text-text-variant opacity-50'
                      }
                      ${isDayToday ? 'bg-primary text-primary-dark font-bold' : ''}
                      ${isSelected && !isDayToday ? 'bg-white bg-opacity-10 ring-2 ring-primary' : ''}
                    `}
                  >
                    <span className="text-sm">{format(day, 'd')}</span>
                    
                    {dayEvents.length > 0 && (
                      <div className="flex flex-col items-center space-y-1">
                        <div className="text-xs">📅</div>
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <div className="card-glass">
            <h3 className="font-semibold mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event, index) => (
                  <div key={index} className="p-3 bg-white bg-opacity-5 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">📅</span>
                      <span className="font-medium">Event</span>
                    </div>
                    <p className="text-sm text-text-variant">{event.title}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-white bg-opacity-5 rounded-lg">
                  <p className="text-sm text-text-variant">
                    No events scheduled for this date
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowAddEvent(true)}
                className="w-full p-3 border-2 border-dashed border-white border-opacity-20 rounded-lg hover:border-primary hover:border-opacity-50 transition-colors text-text-variant hover:text-text-primary"
              >
                + Add Event
              </button>
            </div>
          </div>

          {/* Upcoming Weather Events */}
          <div className="card-glass">
            <h3 className="font-semibold mb-4">Your Events</h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white bg-opacity-5 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">📅</span>
                    <span className="text-sm font-medium">
                      {format(new Date(event.date), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-xs text-text-variant">
                    {event.title}
                  </p>
                </motion.div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-text-variant text-center py-4">
                  No events yet. Add your first event!
                </p>
              )}
            </div>
          </div>

          {/* Weather Insights */}
          <div className="card-glass">
            <h3 className="font-semibold mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sunny Days</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rainy Days</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Temperature</span>
                <span className="font-medium">22°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Best Day for Outdoors</span>
                <span className="font-medium text-primary">Jan 20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background-surface border border-outline rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">
              Add Event for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Event title"
              className="w-full px-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={addEvent}
                disabled={!newEventTitle.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Event
              </button>
              <button
                onClick={() => {
                  setShowAddEvent(false)
                  setNewEventTitle('')
                }}
                className="flex-1 px-4 py-3 bg-white bg-opacity-5 rounded-lg hover:bg-opacity-10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Calendar