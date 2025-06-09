import React, { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import {
  Settings2,
  Bell,
  User,
  Zap,
  Palette,
  Type,
  Monitor,
  Moon,
  Sun,
  Save,
  Volume2,
  Shield,
  Database,
} from 'lucide-react'

const categories = [
  { id: 'General', label: 'General', icon: Settings2 },
  { id: 'Notifications', label: 'Notifications', icon: Bell },
  { id: 'Account', label: 'Account', icon: User },
  { id: 'Advanced', label: 'Advanced', icon: Zap },
]

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General')
  const { settings, setSettings } = useSettingsStore()

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Settings
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Customize your DevByteTest experience
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 rounded-xl p-6 h-fit">
            <h3 className="text-lg font-semibold mb-6 text-text-light dark:text-text-dark">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveTab(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === category.id
                          ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                          : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-background-light dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-background-secondary-light dark:bg-background-secondary-dark border border-slate-200 dark:border-slate-700 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              {(() => {
                const activeCategory = categories.find(
                  (cat) => cat.id === activeTab
                )
                const Icon = activeCategory?.icon || Settings2
                return (
                  <>
                    <Icon className="w-8 h-8 text-accent-primary" />
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                      {activeTab} Settings
                    </h2>
                  </>
                )
              })()}
            </div>

            {activeTab === 'General' && (
              <div className="space-y-8">
                {/* Theme Settings */}
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Palette className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Appearance
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-3">
                        Theme Preference
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor },
                        ].map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() =>
                              setSettings({ theme: value as 'light' | 'dark' })
                            }
                            className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-all duration-200 ${
                              settings.theme === value
                                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                                : 'border-slate-200 dark:border-slate-700 text-text-muted-light dark:text-text-muted-dark hover:border-accent-primary/50'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Type className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Display
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Font Size
                      </label>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="range"
                          min="12"
                          max="20"
                          value={settings.fontSize.toString()}
                          onChange={(value) =>
                            setSettings({ fontSize: parseInt(value) })
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-text-light dark:text-text-dark w-12">
                          {settings.fontSize}px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-8">
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <Bell className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Notification Preferences
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        title: 'Exam Reminders',
                        desc: 'Get notified before exams start',
                        enabled: true,
                      },
                      {
                        title: 'Results Available',
                        desc: 'Notify when exam results are ready',
                        enabled: true,
                      },
                      {
                        title: 'System Updates',
                        desc: 'Important platform announcements',
                        enabled: false,
                      },
                      {
                        title: 'Marketing Communications',
                        desc: 'Tips, tutorials, and new features',
                        enabled: false,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-background-secondary-light dark:bg-background-secondary-dark rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-text-light dark:text-text-dark">
                            {item.title}
                          </h4>
                          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            {item.desc}
                          </p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                            item.enabled
                              ? 'bg-live-indicator'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${
                              item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Volume2 className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Sound Settings
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-light dark:text-text-dark">
                      Enable notification sounds
                    </span>
                    <div className="w-12 h-6 rounded-full bg-live-indicator cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-6 mt-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Account' && (
              <div className="space-y-8">
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Profile Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          First Name
                        </label>
                        <Input
                          onChange={() => console.log('hello')}
                          type="text"
                          placeholder="Enter first name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Last Name
                        </label>
                        <Input
                          onChange={() => console.log('hello')}
                          type="text"
                          placeholder="Enter last name"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Email Address
                      </label>
                      <Input
                        onChange={() => console.log('hello')}
                        type="email"
                        placeholder="Enter email address"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Security
                    </h3>
                  </div>
                  <Button className="bg-red-50 text-red-500 border border-red-500 hover:bg-quiz-incorrect/10">
                    Change Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'Advanced' && (
              <div className="space-y-8">
                <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <Database className="w-6 h-6 text-accent-primary" />
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                      Data Management
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-quiz-pending/10 border border-quiz-pending/20 rounded-lg">
                      <h4 className="font-medium text-text-light dark:text-text-dark mb-2">
                        Export Data
                      </h4>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-3">
                        Download your exam history and results
                      </p>
                      <Button className="bg-orange-50 text-quiz-pending border border-quiz-pending hover:bg-quiz-pending/10">
                        Export Data
                      </Button>
                    </div>

                    <div className="p-4 bg-quiz-incorrect/10 border border-quiz-incorrect/20 rounded-lg">
                      <h4 className="font-medium text-text-light dark:text-text-dark mb-2">
                        Delete Account
                      </h4>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-3">
                        Permanently delete your account and all associated data
                      </p>
                      <Button className="bg-red-50 text-quiz-incorrect border border-quiz-incorrect hover:bg-quiz-incorrect/10">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
