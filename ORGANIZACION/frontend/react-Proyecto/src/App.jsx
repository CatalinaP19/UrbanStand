import React, { useState } from 'react'
import GlobalStylesProvider from './GlobalStylesProvider'

import UrbanStand from './Componentes/UrbanStand'
import Chat from './Componentes/ChatTemplate'
import Login from './Login/Login'

import Register_roles from './Componentes/Register_roles'
import VistaVendedor from './Componentes/VistaVendedor'
import RegistroEntidades from './Componentes/RegistroEntidades'
import VistaEntidades from './Componentes/VistaEntidades'

function App() {
  // Definimos el estado para controlar la vista actual
  const [currentView, setCurrentView] = useState('urbanstand')
  

  // Función que devuelve el componente según la vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'urbanstand':
        return <UrbanStand />
      case 'chat':
        return <Chat />
      case 'login':
        return <Login />
      case 'register_roles':
        return <Register_roles />
      case 'registroEntidades':
        return <RegistroEntidades />
      case 'vista1':
        return <VistaVendedor />
      case 'vista2':
        return <VistaEntidades />
      default:
        return <UrbanStand />
    }
  }

  return (
    <GlobalStylesProvider>
      <div className="app">
        {/* Botones de navegación */}
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
            onClick={() => setCurrentView('registroEntidades')}
            className={`btn ${currentView === 'registroEntidades' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ marginRight: 5, fontSize: 12, padding: '5px 10px' }}
          >
            Registro Entidades
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
            Vista
          </button>

          <button
            onClick={() => setCurrentView('vista2')}
            className={`btn ${currentView === 'vista2' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, padding: '5px 10px' }}
          >
            Vista Entidades
          </button>
        </div>

        {/* Renderizamos la vista actual */}
        {renderCurrentView()}
      </div>
    </GlobalStylesProvider>
  )
}

export default App
