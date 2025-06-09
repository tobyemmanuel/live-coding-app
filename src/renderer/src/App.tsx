import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppRoutes } from '@/routes'
import { SplashScreen } from '@/components/SplashScreen'
// import { apiService } from '@/services/apiService';
import { useSettingsStore } from '@/stores/settingsStore'
import type { AppSettings } from '@/types/settings'

const queryClient = new QueryClient()

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [appVersion, setAppVersion] = useState('')
  const [platform, setPlatform] = useState('')
  const { setSettings } = useSettingsStore()

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
      // const appSettings = await apiService.getSettings();
      // setSettings(appSettings);
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Set default settings
      setSettings({
        theme: 'light',
        fontSize: 16,
      })
    }
    setShowSplash(false)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatePresence>
          {showSplash ? (
            <SplashScreen onLoadingComplete={handleLoadingComplete} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-screen bg-background-light dark:bg-background-dark"
            >
              <div className="flex-1 overflow-auto">
                <AppRoutes />
              </div>
              <footer className="sticky bottom-0 z-50 border-t-2 bg-white px-6 py-3 border-white/40 text-sm flex justify-around items-center w-full">
                <div className="text-center text-gray-600 font-medium flex-1">
                  Powered by ITRTW
                </div>
                <div className="text-gray-500">
                  <span>Version: {appVersion}</span> |{' '}
                  <span>Platform: {platform}</span>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}

export default App
