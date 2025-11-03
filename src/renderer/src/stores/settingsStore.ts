import { create } from 'zustand';
import { AppSettings } from '@/types/settings';

interface SettingsState {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: { theme: 'light', fontSize: 16 },
  setSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),
}));