export interface AppSettings {
  theme: 'light' | 'dark'
  autoStart: boolean
  notifications: boolean
  language: string
  apiEndpoint: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

declare global {
  interface Window {
    electronAPI: {
      platform: string
      getAppVersion: () => Promise<string>
      getPlatform: () => Promise<string>
    }
  }
}
