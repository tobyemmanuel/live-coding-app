import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from './LoadingSpinner'
import { apiService } from '../services/api'

interface SplashScreenProps {
  onLoadingComplete: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onLoadingComplete,
}) => {
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const loadApp = async () => {
      const steps = [
        { text: 'Checking server connection...', duration: 1000 },
        { text: 'Loading settings...', duration: 1500 },
        { text: 'Preparing interface...', duration: 1000 },
        { text: 'Almost ready...', duration: 500 },
      ]

      for (let i = 0; i < steps.length; i++) {
        setLoadingText(steps[i].text)
        setProgress(((i + 1) / steps.length) * 100)

        if (i === 1) {
          // Try to fetch settings
          try {
            // await apiService.getSettings()
          } catch (error) {
            console.warn('Failed to fetch settings:', error)
          }
        }

        await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
      }

      onLoadingComplete()
    }

    loadApp()
  }, [onLoadingComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50"
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">DevByteTest</h1>
          <p className="text-xl opacity-80">Live exam platform with live coding.</p>
        </motion.div>

        <div className="mb-6">
          <LoadingSpinner />
        </div>

        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg mb-4"
        >
          {loadingText}
        </motion.p>

        <div className="w-64 bg-white/20 rounded-full h-2 mx-auto">
          <motion.div
            className="bg-white h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
