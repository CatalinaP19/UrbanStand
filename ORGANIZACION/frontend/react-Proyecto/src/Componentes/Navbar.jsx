import React, { useEffect } from 'react'

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  isLoggedIn, 
  userRole, 
  userData, 
  onLogout 
}) {

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .navbar {
        background: #faf3e0;
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
        width: 100%;
        box-sizing: border-box;
      }

      .navbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .navbar-logo {
        font-size: 28px;
        font-weight: bold;
        color: #f97316;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .navbar-logo img {
        height: 40px;
        width: auto;
      }

      .navbar-nav {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .navbar-link {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        color: #374151;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
      }

      .navbar-link:hover {
        background: rgba(249, 115, 22, 0.1);
        color: #f97316;
      }

      .navbar-link.active {
        background: #f97316;
        color: white;
      }

      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .navbar-button {
        border: 2px solid #f97316;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .navbar-button-secondary {
        background: transparent;
        color: #f97316;
      }

      .navbar-button-secondary:hover {
        background: #f97316;
        color: white;
      }

      .navbar-button-primary {
        background: #f97316;
        color: white;
      }

      .navbar-button-primary:hover {
        background: transparent;
        color: #f97316;
      }

      .navbar-user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
      }

      .navbar-user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #f97316;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.9rem;
      }

      .navbar-user-info {
        display: flex;
        flex-direction: column;
      }

      .navbar-user-name {
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        line-height: 1.2;
      }

      .navbar-user-role {
        font-size: 0.75rem;
        color: #6b7280;
        line-height: 1.2;
        text-transform: capitalize;
      }

      .navbar-logout {
        background: #dc2626;
        border: 2px solid #dc2626;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .navbar-logout:hover {
        background: transparent;
        color: #dc2626;
      }

      @media (max-width: 768px) {
        .navbar {
          padding: 1rem;
        }
        
        .navbar-nav {
          gap: 1rem;
        }
        
        .navbar-link {
          font-size: 0.9rem;
          padding: 0.4rem 0.8rem;
        }
        
        .navbar-user-info {
          display: none;
        }
        
        .navbar-actions {
          gap: 0.5rem;
        }
      }
    `
    
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Función para scroll suave a secciones dentro de UrbanStand
  const scrollToSection = (sectionId) => {
    if (currentView !== 'urbanstand') {
      setCurrentView('urbanstand')
      // Esperar a que se renderice la vista antes de hacer scroll
      setTimeout(() => {
        const target = document.querySelector(sectionId)
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    } else {
      const target = document.querySelector(sectionId)
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  // Obtener inicial del usuario para avatar
  const getUserInitial = () => {
    if (userData?.firstName) {
      return userData.firstName.charAt(0).toUpperCase()
    }
    if (userData?.nomEnti) {
      return userData.nomEnti.charAt(0).toUpperCase()
    }
    return userRole ? userRole.charAt(0).toUpperCase() : 'U'
  }

  // Obtener nombre del usuario
  const getUserName = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`
    }
    if (userData?.nomEnti) {
      return userData.nomEnti
    }
    return 'Usuario'
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo */}
        <div 
          className="navbar-logo"
          onClick={() => setCurrentView('urbanstand')}
        >
          <img src="../img/logo.png" alt="logo" />
          UrbanStand
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          {!isLoggedIn ? (
            // Navegación para usuarios no logueados
            <>
              <button
                className={`navbar-link ${currentView === 'urbanstand' ? 'active' : ''}`}
                onClick={() => scrollToSection('#inicio')}
              >
                Inicio
              </button>
              <button
                className="navbar-link"
                onClick={() => scrollToSection('#acerca')}
              >
                Acerca
              </button>
              <button
                className="navbar-link"
                onClick={() => scrollToSection('#funcionalidades')}
              >
                Funcionalidades
              </button>
            </>
          ) : (
            // Navegación para usuarios logueados
            <>
              <button
                className={`navbar-link ${currentView === 'urbanstand' ? 'active' : ''}`}
                onClick={() => setCurrentView('urbanstand')}
              >
                Inicio
              </button>
              <button
                className={`navbar-link ${currentView === 'chat' ? 'active' : ''}`}
                onClick={() => setCurrentView('chat')}
              >
                Chat
              </button>
              {userRole === 'vendedor' && (
                <button
                  className={`navbar-link ${currentView === 'vista1' ? 'active' : ''}`}
                  onClick={() => setCurrentView('vista1')}
                >
                  Mi Puesto
                </button>
              )}
              {userRole === 'entidad' && (
                <button
                  className={`navbar-link ${currentView === 'vista2' ? 'active' : ''}`}
                  onClick={() => setCurrentView('vista2')}
                >
                  Dashboard
                </button>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {!isLoggedIn ? (
            // Botones para usuarios no logueados
            <>
              <button
                className="navbar-button navbar-button-secondary"
                onClick={() => setCurrentView('login')}
              >
                Ingresar
              </button>
              <button
                className="navbar-button navbar-button-primary"
                onClick={() => setCurrentView('register_roles')}
              >
                Registrarse
              </button>
            </>
          ) : (
            // Usuario logueado
            <>
              <div className="navbar-user">
                <div className="navbar-user-avatar">
                  {getUserInitial()}
                </div>
                <div className="navbar-user-info">
                  <div className="navbar-user-name">
                    {getUserName()}
                  </div>
                  <div className="navbar-user-role">
                    {userRole}
                  </div>
                </div>
              </div>
              <button
                className="navbar-logout"
                onClick={onLogout}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}