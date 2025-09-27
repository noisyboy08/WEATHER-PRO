import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState('demo@weatherpro.com')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: authError } = isSignIn 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (authError) {
        setError(authError.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background-surface p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Cloud size={32} className="text-primary-dark" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">WeatherPro</h1>
            <p className="text-text-variant">
              {isSignIn ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Auth Toggle */}
          <div className="flex bg-white bg-opacity-5 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                isSignIn ? 'bg-primary text-primary-dark font-medium' : 'text-text-variant'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                !isSignIn ? 'bg-primary text-primary-dark font-medium' : 'text-text-variant'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Compact Demo Account notice, like the screenshot */}
          <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-3 text-xs">
            <div className="font-medium mb-1">Demo Account:</div>
            <div className="text-text-variant">
              <span className="font-mono">demo@weatherpro.com</span> / <span className="font-mono">demo123</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-variant" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-variant" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-variant hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-lg p-3 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <span>{isSignIn ? 'Sign In' : 'Sign Up'}</span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-text-variant">
            <p>
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-primary hover:underline"
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-text-variant text-sm mb-4">
            Experience the future of weather forecasting
          </p>
          <div className="flex justify-center space-x-6 text-xs text-text-variant">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>3D Weather Maps</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>AI Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Smart Analytics</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage