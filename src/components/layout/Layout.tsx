import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Sidebar from './Sidebar'
import AIChatbot from '../features/AIChatbot'
import { MessageCircle } from 'lucide-react'
import { useWeather } from '../../contexts/WeatherContext'
import { Canvas } from '@react-three/fiber'
import { Sky, Cloud, Stars } from '@react-three/drei'

function AtmosphereBG() {
  // Subtle, performance-friendly atmospheric scene
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 8], fov: 50 }}>
        {/* Soft ambient and directional light to add depth */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        {/* Clear sky with slight inclination; reacts nicely for day scenes */}
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          azimuth={0.25}
          turbidity={6}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
          rayleigh={2}
          inclination={0.49}
        />
        {/* Subtle drifting clouds to keep motion minimal but alive */}
        <group position={[0, 2, -5]}>
          <Cloud opacity={0.2} speed={0.15} width={20} depth={2} segments={12} />
        </group>
        {/* Stars are faint; visible mostly at night themes */}
        <Stars radius={80} depth={50} count={2000} factor={2} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  )
}

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const { weatherData } = useWeather()

  return (
    <motion.div 
      className={`relative min-h-screen flex flex-col lg:flex-row transition-all duration-1000`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D Atmospheric Background */}
      <AtmosphereBG />
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-hidden">
          {children}
        </main>
      </div>

      {/* AI Chatbot Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-dark rounded-full shadow-lg flex items-center justify-center z-30 hover:shadow-xl transition-shadow"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* AI Chatbot */}
      <div className="relative z-10">
        <AIChatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      </div>
    </motion.div>
  )
}

export default Layout