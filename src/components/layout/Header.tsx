import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, User, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LocationSearch from '../features/LocationSearch'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-background-surface border-b border-outline sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="hidden lg:flex items-center">
            <motion.h1
              className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              WeatherPro
            </motion.h1>
          </div>
        </div>

        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-md mx-4">
          <LocationSearch />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <Bell size={20} />
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <User size={20} />
            </motion.button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-48 glass-strong rounded-lg shadow-lg py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-white border-opacity-10">
                  <p className="text-sm text-text-variant">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
                <button className="w-full px-4 py-2 text-left hover:bg-white hover:bg-opacity-5 flex items-center space-x-2">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={signOut}
                  className="w-full px-4 py-2 text-left hover:bg-white hover:bg-opacity-5 text-red-400"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header