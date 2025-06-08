import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className="block py-2 px-4 hover:bg-gray-700"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/exams" className="block py-2 px-4 hover:bg-gray-700">
              Exams
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className="block py-2 px-4 hover:bg-gray-700"
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
