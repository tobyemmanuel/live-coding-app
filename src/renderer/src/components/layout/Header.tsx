import React, { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../common/Button'
import { useNavigate, NavLink } from 'react-router-dom'
import { Settings, LogOut, User } from 'lucide-react'

const Header: React.FC = () => {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md shadow-md p-4 mb-3 flex justify-between items-center border border-white/40">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-indigo-700 tracking-wide">
        DevTestByte
      </h1>

      {/* Search */}
      <div className="flex-1 mx-6 max-w-md">
        <input
          type="text"
          placeholder="Search Schedule"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Navigation + User Controls */}
      <div className="flex items-center space-x-6">
        <nav>
          <ul className="flex space-x-4 text-sm font-medium text-gray-700">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded transition-colors duration-300 ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'
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
                  `px-3 py-2 rounded transition-colors duration-300 ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'
                  }`
                }
              >
                Exams
              </NavLink>
            </li>

          </ul>
        </nav>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 rounded-full bg-indigo-100 hover:bg-indigo-200 px-3 py-1 cursor-pointer select-none"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold text-lg">
                {initials}
              </div>
              <User className="w-5 h-5 text-indigo-700" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    navigate('/settings')
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-indigo-100 space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-indigo-100 space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
    </header>
  )
}

export default Header
