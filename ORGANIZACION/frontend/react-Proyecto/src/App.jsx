import React, { useState } from 'react'
import GlobalStylesProvider from './GlobalStylesProvider'

import UrbanStand from './Componentes/UrbanStand'
import Chat from './Componentes/ChatTemplate'
import Login from './Login/Login'
import Register from './Login/Register'
import Register_roles from './Componentes/Register_roles'
import VistaVendedor from './Componentes/VistaVendedor'
import RegistroEntidades from './Componentes/RegistroEntidades'
import VistaEntidades from './Componentes/VistaEntidades'
import VistaCliente from './Componentes/VistaCliente'

function App() {
  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState('urbanstand')
  
  // Manejar selección de rol desde Register_roles
  const handleRoleSelection = (role) => {
    if (role === 'vendedor') {
      setCurrentView('register') // Registro de vendedor
    } else if (role === 'entidad') {
      setCurrentView('registroEntidades') // Registro de entidades
    } else if (role === 'cliente') {
      alert(`Has seleccionado: ${role}`)
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

  // Renderizar vistas según estado
  const renderCurrentView = () => {
    switch (currentView) {
      case 'urbanstand':
        return <UrbanStand />
      case 'chat':
        return <Chat />
      case 'login':
        return <Login />
      case 'register_roles':
        return <Register_roles onRoleSelect={handleRoleSelection} onLoginClick={handleGoToLogin} />
      case 'register':
        return <Register onBackToRoles={handleBackToRoles} onGoToLogin={handleGoToLogin} />
      case 'registroEntidades':
        return <RegistroEntidades onBackToRoles={handleBackToRoles} />
      case 'vista1':
        return <VistaVendedor />
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
        {/* Botones de navegación generales */}
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <button
            onClick={() => setCurrentView('urbanstand')}
            className={`btn ${currentView === 'urbanstand' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ marginRight: 5, fontSize: 12, padding: '5px 10px' }}
          >
            UrbanStand
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className={`btn ${currentView === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ marginRight: 5, fontSize: 12, padding: '5px 10px' }}
          >
            Chat
          </button>
          <button
            onClick={() => setCurrentView('login')}
            className={`btn ${currentView === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ marginRight: 5, fontSize: 12, padding: '5px 10px' }}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView('register_roles')}
            className={`btn ${currentView === 'register_roles' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ marginRight: 5, fontSize: 12, padding: '5px 10px' }}
          >
            ¿Qué rol cumples?
          </button>
          <button
            onClick={() => setCurrentView('vista1')}
            className={`btn ${currentView === 'vista1' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, padding: '5px 10px' }}
          >
            Vista Vendedor
          </button>
          <button
            onClick={() => setCurrentView('vista2')}
            className={`btn ${currentView === 'vista2' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, padding: '5px 10px' }}
          >
            Vista Entidades
          </button>

            <button
            onClick={() => setCurrentView('vista3')}
            className={`btn ${currentView === 'vista3' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, padding: '5px 10px' }}
          >
            Vista Clientes
          </button>
        </div>

        {/* Renderizamos la vista actual */}
        {renderCurrentView()}
      </div>
    </GlobalStylesProvider>
  )
}

export default App
