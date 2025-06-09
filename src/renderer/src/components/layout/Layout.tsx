import React from 'react'
import Header from './Header'

import { Outlet } from 'react-router-dom'

export const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
