import axios from 'axios'
import type { AppSettings, ApiResponse } from '../types'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const apiService = {
  async getSettings(): Promise<AppSettings> {
    const response = await api.get<ApiResponse<AppSettings>>('/settings')
    return response.data.data
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const response = await api.put<ApiResponse<AppSettings>>(
      '/settings',
      settings
    )
    return response.data.data
  },

  async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health')
      return true
    } catch {
      return false
    }
  },
}
