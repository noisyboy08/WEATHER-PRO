import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

let toastId = 0
let addToastFunction: ((message: string, type: 'success' | 'error' | 'info', duration?: number) => void) | null = null

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
  if (addToastFunction) {
    addToastFunction(message, type, duration)
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: 'success' | 'error' | 'info', duration = 4000) => {
    const id = (++toastId).toString()
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    addToastFunction = addToast
    return () => {
      addToastFunction = null
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />
      case 'info':
        return <Info size={20} className="text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500 bg-opacity-10 border-green-500'
      case 'error':
        return 'bg-red-500 bg-opacity-10 border-red-500'
      case 'info':
        return 'bg-blue-500 bg-opacity-10 border-blue-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`glass-strong rounded-lg p-4 border ${getBgColor()} min-w-80 max-w-md`}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-text-variant hover:text-text-primary transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}