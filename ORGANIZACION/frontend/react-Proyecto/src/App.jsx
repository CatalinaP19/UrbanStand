import React from 'react'
import { useNavigate } from 'react-router-dom'
import UrbanStand from './Componentes/Urbanstand'

function App() {
  const navigate = useNavigate()

  const handleGoToLogin = () => navigate('/login')
  const handleGoToRegisterRoles = () => navigate('/register-roles')
  const handleGoToVendorRegister = () => navigate('/register')
  const handleGoToEntityRegister = () => navigate('/registro-entidades')
  const handleGoToClientView = () => navigate('/cliente')
  const handleGoToEntityView = () => navigate('/entidades')

  return (
    <div className="app">
      <UrbanStand
        onGoToLogin={handleGoToLogin}
        onGoToRegister={handleGoToRegisterRoles}
        onGoToVendorRegister={handleGoToVendorRegister}
        onGoToEntityRegister={handleGoToEntityRegister}
        onGoToClientView={handleGoToClientView}
        onGoToEntityView={handleGoToEntityView}
      />
    </div>
  )
}

export default App