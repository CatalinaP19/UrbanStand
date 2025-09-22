import React, { useState } from 'react'
import GlobalStylesProvider from './GlobalStylesProvider'

import UrbanStand from './Componentes/Urbanstand'
import Login from './Login/Login'
import Register from './Login/Register'
import RegistroEntidades from './Componentes/RegistroEntidades'
import Navbar from './Componentes/Navbar'
import Chat from './Componentes/ChatTemplate'
import Register_roles from './Componentes/Register_roles'
import VistaVendedor from './Componentes/VistaVendedor'
import VistaEntidades from './Componentes/VistaEntidades'
import VistaCliente from './Componentes/VistaCliente'

function App() {
  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState('urbanstand')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null) // 'vendedor', 'entidad', 'cliente'
  const [userData, setUserData] = useState(null) // datos del usuario logueado

  // Manejar selección de rol desde Register_roles
  const handleRoleSelection = (role) => {
    if (role === 'vendedor') {
      setCurrentView('register') // Registro de vendedor
    } else if (role === 'entidad') {
      setCurrentView('registroEntidades') // Registro de entidades
    } else if (role === 'cliente') {
      // Cliente no requiere registro ni login: ir directo a la vista cliente
      setCurrentView('vista3')
    }
  }

  // Volver a selección de roles
  const handleBackToRoles = () => {
    setCurrentView('register_roles')
  }

  // Ir a la vista de login
  const handleGoToLogin = () => {
    setCurrentView('login');
  }

  // Función para manejar login exitoso
  const handleSuccessfulLogin = (role, data) => {
    setIsLoggedIn(true)
    setUserRole(role)
    setUserData(data)

    // Redirigir según el rol
    if (role === 'vendedor') {
      setCurrentView('vista1')
    } else if (role === 'entidad') {
      setCurrentView('vista2')
    }
  }

  // Función para manejar logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setUserData(null)
    setCurrentView('urbanstand')
  }

  // Renderizar vistas según estado
  const renderCurrentView = () => {
    switch (currentView) {
      case 'urbanstand':
        return <UrbanStand
          onGoToLogin={handleGoToLogin}
          onGoToRegister={() => setCurrentView('register_roles')}
          onGoToVendorRegister={() => setCurrentView('register')}
          onGoToEntityRegister={() => setCurrentView('registroEntidades')}
          onGoToEntityView={() => setCurrentView('vista2')}
          onGoToClientView={() => {
            // Cliente no requiere login: solo navegar a la vista cliente
            setCurrentView('vista3');
          }}
        />
      case 'login':
        return <Login
          onSuccessfulLogin={handleSuccessfulLogin}
          onGoToRegister={() => setCurrentView('register_roles')}
        />
      case 'register':
        return <Register onBackToRoles={handleBackToRoles} onSuccessfulLogin={handleSuccessfulLogin} onGoToLogin={handleGoToLogin} />
      case 'registroEntidades':
        return <RegistroEntidades onBackToRoles={handleBackToRoles} onSuccessfulLogin={handleSuccessfulLogin} onGoToLogin={handleGoToLogin} />
      case 'chat':
        return <Chat />
      case 'register_roles':
        return (
          <Register_roles
            onRoleSelect={handleRoleSelection}
            currentView={currentView}
            setCurrentView={setCurrentView}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            userData={userData}
            onLogout={handleLogout}
          />
        )
      case 'vista1':
        return (
          <VistaVendedor
            vendedorData={{
              nombre: `${userData?.firstName ?? 'Vendedor'} ${userData?.lastName ?? ''}`.trim(),
              tipoVendedor: 'Vendedor',
              descripcion: 'Bienvenido a tu panel. Gestiona tu puesto y productos.',
              genero: userData?.genero || ''
            }}
            userData={userData}
          />
        )
      case 'vista2':
        return <VistaEntidades />
      case 'vista3':
        return <VistaCliente />
      default:
        return <UrbanStand />
    }
  }

 return (
  <GlobalStylesProvider>
    <div className="app">
      {/* Mostrar Navbar solo en ciertas vistas */}
      {!['register_roles'].includes(currentView) && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userData={userData}
          onLogout={handleLogout}
        />
      )}

      {/* Renderizar la vista actual */}
      {renderCurrentView()}
    </div>
  </GlobalStylesProvider>
)
}

export default App