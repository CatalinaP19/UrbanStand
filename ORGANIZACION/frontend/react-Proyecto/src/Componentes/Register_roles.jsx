import React, { useEffect, useState } from 'react'
import Register from '../Login/Register';
import RegistroEntidades from './RegistroEntidades';

export default function Register_roles() {
  const [currentView, setCurrentView] = useState('roles') // Estado agregado

  // Simula función para ir al inicio
  const goHome = () => {
    console.log("Volver al inicio");
  }

  // Función para manejar la selección de rol
  const handleRoleSelect = (role) => {
    console.log(`Rol seleccionado: ${role}`);
    alert(`Has seleccionado: ${role}`);
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .register-container {
        width: 100vw;
        height: 100vh;
        background: #faf3e0;
        font-family: system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }

      .register-header {
        background: #faf3e0;
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 50;
      }

      .register-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .register-home-button {
        background: #9a1e22;
        border: 2px solid #9a1e22;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .register-home-button:hover {
        background: transparent;
        color: #9a1e22;
      }

      .register-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        min-height: calc(100vh - 80px);
      }

      .register-box {
        width: 100%;
        max-width: 32rem;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .register-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
        color: #9a1e22;
      }

      .register-subtitle {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 2rem;
        text-align: center;
        color: #374151;
      }

      .register-buttons-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .register-role-button {
        border: 2px solid #ea580c;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background: transparent;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        transition: all 0.2s ease;
        width: 100%;
        color: #ea580c;
        text-align: center;
      }

      .register-role-button:hover {
        background: #ea580c;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
      }

      .register-role-button:active {
        transform: translateY(0);
      }

      .logo {
        font-size: 28px;
        font-weight: bold;
        color: #f97316;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .role-description {
        font-size: 0.9rem;
        color: #6b7280;
        margin-top: 0.5rem;
        text-align: center;
      }

      .back-button {
        background: #6b7280;
        border: 2px solid #6b7280;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        margin-bottom: 1rem;
      }

      .back-button:hover {
        background: transparent;
        color: #6b7280;
      }

      @media (max-width: 768px) {
        .register-content {
          padding: 1rem;
        }
        
        .register-box {
          padding: 1.5rem;
        }
        
        .register-title {
          font-size: 1.5rem;
        }
        
        .register-subtitle {
          font-size: 1rem;
        }
      }
    `
    
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Función para renderizar la vista de selección de roles
  const renderRoleSelection = () => (
    <div className="register-content">
      <div className="register-box">
        <h1 className="register-title">¡Regístrate!</h1>
        <h3 className="register-subtitle">¿Qué rol cumples?</h3>
        
        <div className="register-buttons-container">
          <button 
            onClick={() => setCurrentView('register')}
            className="register-role-button"
          >
            Vendedor
          </button>

          <button 
            type="button" 
            onClick={() => handleRoleSelect('Vendedor')} 
            className="register-role-button"
          >
            Cliente
          </button>

          <button 
            type="button" 
            onClick={() => setCurrentView('registroEntidades')} 
            className="register-role-button"
          >
            Entidad
          </button>
        </div>
      </div>
    </div>
  )

  // Función para renderizar el formulario de registro con botón de regreso
  const renderRegisterForm = () => (
    <div className="register-content">
        <Register />

    </div>
  )


    const renderRegisterEntidadesForm = () => (
    <div className="register-content">
      <div className="register-box">
        <button 
          onClick={() => setCurrentView('roles')} 
          className="back-button"
        >
          ← Volver a selección de roles
        </button>
        <RegistroEntidades />
      </div>
    </div>
  )

  return (
    <div className="register-container">
      {/* Header */}
      <header className="register-header">
        <div className="register-header-content">
          <div className="logo">
            <img className="logo-img" src="../img/logo.png" alt="logo" />
            UrbanStand
          </div>
        </div>
      </header>

      {/* Contenido dinámico basado en currentView */}
      {currentView === 'roles' ? renderRoleSelection() : renderRegisterForm()}
      
      {currentView === 'roles' ? renderRoleSelection() : renderRegisterEntidadesForm()}
    </div>
  )
}
