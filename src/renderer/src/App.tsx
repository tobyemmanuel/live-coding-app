import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Zap, Shield, Rocket } from 'lucide-react'
import { SplashScreen } from './components/SplashScreen'
import { apiService } from './services/api'
import type { AppSettings } from './types'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [appVersion, setAppVersion] = useState('')
  const [platform, setPlatform] = useState('')

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [version, platformInfo] = await Promise.all([
          window.electronAPI.getAppVersion(),
          window.electronAPI.getPlatform(),
        ])
        setAppVersion(version)
        setPlatform(platformInfo)
      } catch (error) {
        console.error('Failed to get app info:', error)
      }
    }

    initializeApp()
  }, [])

  const handleLoadingComplete = async () => {
    try {
      const appSettings = await apiService.getSettings()
      setSettings(appSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Set default settings
      setSettings({
        theme: 'light',
        autoStart: false,
        notifications: true,
        language: 'en',
        apiEndpoint: 'http://localhost:3001',
      })
    }
    setShowSplash(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onLoadingComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Electron Boilerplate
            </h1>
            <p className="text-xl text-gray-600">
              Production-ready setup with React, TypeScript, and API server
            </p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
              <span>Version: {appVersion}</span>
              <span>Platform: {platform}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Lightning Fast"
              description="Vite provides instant hot reload and blazing fast builds"
              color="text-yellow-500"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure"
              description="Context isolation and secure preload scripts"
              color="text-green-500"
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="Configurable"
              description="Built-in API server and settings management"
              color="text-blue-500"
            />
            <FeatureCard
              icon={<Rocket className="h-8 w-8" />}
              title="Production Ready"
              description="Cross-platform builds and auto-updater support"
              color="text-purple-500"
            />
          </div>

          {settings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Current Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Theme:</strong> {settings.theme}
                </div>
                <div>
                  <strong>Auto Start:</strong>{' '}
                  {settings.autoStart ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Notifications:</strong>{' '}
                  {settings.notifications ? 'Enabled' : 'Disabled'}
                </div>
                <div>
                  <strong>Language:</strong> {settings.language}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-md p-6 text-center"
    >
      <div className={`${color} mb-4 flex justify-center`}>{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  )
}

export default App
