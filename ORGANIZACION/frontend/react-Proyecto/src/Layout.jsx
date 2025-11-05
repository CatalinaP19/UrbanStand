import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import GlobalStylesProvider from './GlobalStylesProvider'
import Navbar from './Componentes/Navbar'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [userData, setUserData] = useState(null)

  const readSession = () => {
    try {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('userType') || 'vendedor'
      const current = JSON.parse(localStorage.getItem('urbanstand_current_user') || 'null')
      setIsLoggedIn(Boolean(token) || Boolean(current))
      setUserRole(current?.role || role || null)
      setUserData(current || null)
    } catch (_) {
      setIsLoggedIn(false)
      setUserRole(null)
      setUserData(null)
    }
  }

  useEffect(() => {
    readSession()
    const onStorage = (e) => {
      if (!e || ['token','userType','urbanstand_current_user'].includes(e.key)) {
        readSession()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Releer sesión al cambiar de ruta (útil tras login en misma pestaña)
  useEffect(() => {
    readSession()
  }, [location.pathname])

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
      localStorage.removeItem('urbanstand_current_user')
    } catch (_) { /* ignore */ }
    readSession()
    navigate('/')
  }

  return (
    <GlobalStylesProvider>
      <div className="app">
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userData={userData}
          onLogout={handleLogout}
        />
        <Outlet />
      </div>
    </GlobalStylesProvider>
  )
}
