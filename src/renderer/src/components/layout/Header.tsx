import React, { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../common/Button'
import { useNavigate, NavLink } from 'react-router-dom'
import { Settings, LogOut, User, Search, Code, Bell } from 'lucide-react'

const Header: React.FC = () => {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setUser(null)
    navigate('/login')
  }

  // Get user initials fallback to 'U'
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-live-typing rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              DevByteTest
            </h1>
            <div className="hidden md:flex items-center space-x-2 ml-4">
              <div className="w-2 h-2 bg-live-indicator rounded-full animate-pulse"></div>
              <span className="text-xs text-live-indicator font-medium">Live</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 mx-8 max-w-md">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-105' : ''}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
              <input
                type="text"
                placeholder="Search exams, challenges..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-background-secondary-light dark:bg-background-secondary-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-all duration-200"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Navigation + User Controls */}
          <div className="flex items-center space-x-6">
            {/* Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-2">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive 
                          ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                          : 'text-text-muted-light dark:text-text-muted-dark hover:bg-background-secondary-light dark:hover:bg-background-secondary-dark hover:text-text-light dark:hover:text-text-dark'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/exams"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive 
                          ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                          : 'text-text-muted-light dark:text-text-muted-dark hover:bg-background-secondary-light dark:hover:bg-background-secondary-dark hover:text-text-light dark:hover:text-text-dark'
                      }`
                    }
                  >
                    Exams
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* Notifications */}
            {user && (
              <button title='notifications' className="relative p-2 rounded-lg hover:bg-background-secondary-light dark:hover:bg-background-secondary-dark transition-colors">
                <Bell className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-quiz-pending rounded-full"></div>
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 rounded-xl bg-background-secondary-light dark:bg-background-secondary-dark hover:bg-accent-primary/10 dark:hover:bg-accent-primary/10 px-4 py-2 transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-accent-primary/30"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-white flex items-center justify-center font-semibold text-sm">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-text-light dark:text-text-dark">
                      {user.name?.split(' ')[0]}
                    </p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                      {user.email}
                    </p>
                  </div>
                  <User className={`w-4 h-4 text-text-muted-light dark:text-text-muted-dark transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background-light dark:bg-background-secondary-dark rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="font-medium text-text-light dark:text-text-dark">{user.name}</p>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          navigate('/settings')
                        }}
                        className="flex items-center w-full px-4 py-3 text-text-light dark:text-text-dark hover:bg-background-secondary-light dark:hover:bg-background-dark transition-colors space-x-3"
                      >
                        <Settings className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-quiz-incorrect hover:bg-quiz-incorrect/10 transition-colors space-x-3"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header