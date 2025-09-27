import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Map, 
  Calendar, 
  BarChart3, 
  Settings, 
  X,
  Cloud,
  Zap
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Map, label: 'Weather Maps', path: '/maps' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' }
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-background-surface border-r border-outline z-40">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="p-6 border-b border-outline">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Cloud size={20} className="text-primary-dark" />
              </div>
              <span className="text-xl font-bold">WeatherPro</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-dark font-medium'
                          : 'text-text-variant hover:text-text-primary hover:bg-white hover:bg-opacity-5'
                      }`
                    }
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <item.icon size={20} />
                    </motion.div>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Weather Status */}
          <div className="p-4 border-t border-outline">
            <div className="glass rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-sm font-medium">Live Updates</span>
              </div>
              <p className="text-xs text-text-variant">
                Real-time weather data updating every 10 minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 h-full w-64 bg-background-surface border-r border-outline z-50"
          >
            <div className="flex flex-col w-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-outline">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Cloud size={20} className="text-primary-dark" />
                  </div>
                  <span className="text-xl font-bold">WeatherPro</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-primary-dark font-medium'
                              : 'text-text-variant hover:text-text-primary hover:bg-white hover:bg-opacity-5'
                          }`
                        }
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Weather Status */}
              <div className="p-4 border-t border-outline">
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-sm font-medium">Live Updates</span>
                  </div>
                  <p className="text-xs text-text-variant">
                    Real-time weather data updating every 10 minutes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar