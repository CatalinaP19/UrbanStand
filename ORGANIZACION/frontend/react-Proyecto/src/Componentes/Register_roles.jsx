import React, { useEffect } from 'react'

export default function Register_roles({ onRoleSelect }) {

  // Función para manejar la selección de rol
  const handleRoleSelect = (role) => {
    console.log(`Rol seleccionado: ${role}`);
    
    // Llamar a la función del padre para cambiar la vista
    if (onRoleSelect) {
      onRoleSelect(role);
    }
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

      {/* Contenido de selección de roles */}
      <div className="register-content">
        <div className="register-box">
          <h1 className="register-title">¡Regístrate!</h1>
          <h3 className="register-subtitle">¿Qué rol cumples?</h3>
          
          <div className="register-buttons-container">
            <button 
              onClick={() => handleRoleSelect('vendedor')}
              className="register-role-button"
            >
              Vendedor
            </button>

            <button 
              type="button" 
              onClick={() => handleRoleSelect('cliente')} 
              className="register-role-button"
            >
              Cliente
            </button>

            <button 
              type="button" 
              onClick={() => handleRoleSelect('entidad')} 
              className="register-role-button"
            >
              Entidad
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}