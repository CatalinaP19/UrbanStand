import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register_roles({ 
  onRoleSelect,
  currentView = 'register_roles',
  setCurrentView = () => {},
  isLoggedIn = false,
  userRole = '',
  userData = null,
  onLogout = () => {}
}) {

  // Función para manejar la selección de rol
  const handleRoleSelect = (role) => {
    console.log(`Rol seleccionado: ${role}`);
    
    // Llamar a la función del padre para cambiar la vista
    if (onRoleSelect) {
      onRoleSelect(role);
    }
  }

  const navigate = useNavigate();

  // Navegación directa para roles específicos cuando no hay manejador del padre
  useEffect(() => {
    // No side-effects on mount
  }, []);

  // Reemplazamos el manejador para añadir navegación cuando rol === 'entidad'
  const originalHandleRoleSelect = handleRoleSelect;
  const enhancedHandleRoleSelect = (role) => {
    originalHandleRoleSelect(role);
    if (role === 'entidad') {
      navigate('/registro-entidades');
    }
  };

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

      /* Sin estilos locales para header/nav: usamos los estilos globales
         definidos en assets/GlobalStyles.css / GlobalStylesProvider.jsx */

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
      {/* Contenido de selección de roles */}
      <div className="register-content">
        <div className="register-box">
          <h1 className="register-title">¡Bienvenido!</h1>
          <h3 className="register-subtitle">Registrarme como...</h3>
          
          <div className="register-buttons-container">
            <button 
            type="button" 
              onClick={() => enhancedHandleRoleSelect('vendedor')}
              className="register-role-button"
            >
              Vendedor
            </button>

            <button 
              type="button" 
              onClick={() => enhancedHandleRoleSelect('cliente')} 
              className="register-role-button"
            >
              Cliente
            </button>

            <button 
              type="button" 
              onClick={() => enhancedHandleRoleSelect('entidad')} 
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