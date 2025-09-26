import React from 'react'
import { Outlet } from 'react-router-dom'
import GlobalStylesProvider from './GlobalStylesProvider'
import Navbar from './Componentes/Navbar'

export default function Layout() {
  return (
    <GlobalStylesProvider>
      <div className="app">
        <Navbar />
        <Outlet />
      </div>
    </GlobalStylesProvider>
  )
}
