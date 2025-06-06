import { Router } from 'express'
import { getSettings, updateSettings } from '../database/db'

export const settingsRouter = Router()

// GET /api/settings
settingsRouter.get('/', async (req, res) => {
  try {
    const settings = await getSettings()
    res.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
    })
  }
})

// PUT /api/settings
settingsRouter.put('/', async (req, res) => {
  try {
    const updatedSettings = await updateSettings(req.body)
    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
    })
  }
})

// POST /api/settings/reset
settingsRouter.post('/reset', async (req, res) => {
  try {
    const defaultSettings = {
      theme: 'light' as const,
      autoStart: false,
      notifications: true,
      language: 'en',
      apiEndpoint: 'http://localhost:3001',
    }

    const resetSettings = await updateSettings(defaultSettings)
    res.json({
      success: true,
      data: resetSettings,
      message: 'Settings reset to defaults',
    })
  } catch (error) {
    console.error('Error resetting settings:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
    })
  }
})
