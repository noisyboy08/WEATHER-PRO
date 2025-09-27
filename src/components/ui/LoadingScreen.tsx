import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 mb-6 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full"></div>
        </motion.div>
        <motion.h2
          className="text-2xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          WeatherPro
        </motion.h2>
        <motion.p
          className="text-text-variant"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Loading your weather experience...
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingScreen