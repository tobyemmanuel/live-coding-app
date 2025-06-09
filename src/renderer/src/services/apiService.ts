import type { AppSettings } from '@/types/settings';

export const apiService = {
  async getSettings(): Promise<AppSettings> {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const settings = await response.json();
      return settings.data;
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  },
};