import React, { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'

const categories = ['General', 'Notifications', 'Account', 'Advanced']

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General')
  const { settings, setSettings } = useSettingsStore()

  return (
    <div className="flex min-h-[80vh] p-6 gap-6 bg-gray-50 rounded-xl shadow-inner">
      {/* Sidebar */}
      <aside className="w-64 bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Settings</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => setActiveTab(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === category
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{activeTab} Settings</h2>

        {activeTab === 'General' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={settings.theme}
                onChange={(e) => setSettings({ theme: e.target.value as 'light' | 'dark' })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                Font Size (px)
              </label>
              <Input
                // id="fontSize"
                type="number"
                value={settings.fontSize.toString()}
                onChange={(value) => setSettings({ fontSize: parseInt(value) })}
                className="w-full"
              />
            </div>

            <Button className="w-full">Save Settings</Button>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="text-gray-600 italic">Notification settings will go here.</div>
        )}

        {activeTab === 'Account' && (
          <div className="text-gray-600 italic">Account settings will go here.</div>
        )}

        {activeTab === 'Advanced' && (
          <div className="text-gray-600 italic">Advanced settings will go here.</div>
        )}
      </main>
    </div>
  )
}
