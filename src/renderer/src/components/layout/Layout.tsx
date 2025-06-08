import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

import { Outlet } from 'react-router-dom'

export const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="flex">
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
