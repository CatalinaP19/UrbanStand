import React, { useEffect, useState, useRef } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({
  isLoggedIn,
  userRole,
  userData,
  onLogout
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const ignoreScrollUntilRef = useRef(0)
  const openScrollYRef = useRef(0)
  const navRef = useRef(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .navbar {
        background: #faf3e0;
        backdrop-filter: blur(10px);
        padding: 0.75rem 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 2000;
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
        font-size: 24px;
        font-weight: bold;
        color: #f97316;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .navbar-logo img {
        height: 36px;
        width: auto;
      }

      .navbar-nav {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      .navbar-link {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        color: #374151;
        text-decoration: none;
        padding: 0.4rem 0.75rem;
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

      /* Toggle button (hidden on desktop) */
      .navbar-toggle {
        display: none;
        background: transparent;
        border: 2px solid #f97316;
        color: #f97316;
        padding: 0.4rem 0.6rem;
        border-radius: 0.5rem;
        cursor: pointer;
      }

      @media (max-width: 768px) {
        .navbar {
          padding: 1rem;
        }
        .navbar-content { flex-wrap: wrap; position: relative; }
        .navbar-toggle { display: inline-flex; align-items: center; justify-content: center; }
        /* Backdrop deshabilitado */
        .navbar-backdrop { display: none !important; }
        /* Animated mobile menu (sin parpadeos) */
        .navbar-nav {
          width: 100%;
          display: block;
          position: absolute;
          left: 0; right: 0; top: calc(100% + 0.25rem);
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          gap: 0.5rem;
          transform: translateY(-6px);
          transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
          will-change: opacity, transform;
        }
        .navbar.open .navbar-nav {
          display: block;
          margin-top: 0;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
          background: rgba(255,255,255,0.94);
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 0.5rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }
        .navbar.open .navbar-nav > * { display: block; margin-bottom: 0.25rem; }
        .navbar.open .navbar-nav .navbar-link,
        .navbar.open .navbar-nav .navbar-button {
          width: 100%;
          text-align: left;
          justify-content: flex-start;
        }
        .navbar.open .navbar-nav .navbar-link + .navbar-link { margin-top: 0.15rem; }
        .navbar.open .navbar-nav .navbar-button { margin-top: 0.35rem; }
        .navbar-link { font-size: 0.9rem; padding: 0.4rem 0.8rem; }
        .navbar-user-info { display: none; }
        .navbar-actions { gap: 0.5rem; }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Lock body scroll when menu is open (mobile UX)
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.dataset.prevOverflow = prev
      document.body.style.overflow = 'hidden'
    } else {
      if (document.body.dataset.prevOverflow !== undefined) {
        document.body.style.overflow = document.body.dataset.prevOverflow
        delete document.body.dataset.prevOverflow
      } else {
        document.body.style.overflow = ''
      }
    }
  }, [menuOpen])

  // Cerrar menú en cambios de ruta
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false)
      // Notificar a componentes (Leaflet) para recálculo de layout
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Nota: No cerramos el menú en scroll para evitar parpadeo cuando se abre a media página.

  // Cerrar menú al hacer click fuera de la navbar
  useEffect(() => {
    const onDocPointer = (e) => {
      if (!menuOpen) return
      if (Date.now() < ignoreScrollUntilRef.current) return
      const root = navRef.current
      if (root && !root.contains(e.target)) {
        setMenuOpen(false)
        setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
      }
    }
    document.addEventListener('mousedown', onDocPointer)
    document.addEventListener('touchstart', onDocPointer, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onDocPointer)
      document.removeEventListener('touchstart', onDocPointer)
    }
  }, [menuOpen])

  // Función para scroll suave a secciones dentro de UrbanStand
  const scrollToSection = (sectionId) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const target = document.querySelector(sectionId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    } else {
      const target = document.querySelector(sectionId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Obtener inicial del usuario para avatar
  const getUserInitial = () => {
    if (userData?.firstName) return userData.firstName.charAt(0).toUpperCase()
    if (userData?.nomEnti) return userData.nomEnti.charAt(0).toUpperCase()
    return userRole ? userRole.charAt(0).toUpperCase() : 'U'
  }

  const getUserName = () => {
    if (userData?.firstName && userData?.lastName) return `${userData.firstName} ${userData.lastName}`
    if (userData?.nomEnti) return userData.nomEnti
    if (userData?.email) return userData.email.split('@')[0]
    return 'Usuario'
  }

  const getAvatarImage = () => {
    const g = (userData?.genero || '').toString().toLowerCase()
    if (g.includes('fem')) return '/img/PerfilFemale.png'
    if (g.includes('masc')) return '/img/PerfilMale.png'
    return null
  }

  return (
    <nav ref={navRef} className={`navbar ${menuOpen ? 'open' : ''}`}>
      {/* Mobile backdrop */}
      <div
        className="navbar-backdrop"
        onClick={() => {
          setMenuOpen(false)
          setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
        }}
      />

      <div className="navbar-content">
        {/* Logo */}
        <div
          className="navbar-logo"
          onClick={() => { setMenuOpen(false); navigate('/') }}
        >
          <img src="../img/logo.png" alt="logo" />
          UrbanStand
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => {
            const willOpen = !menuOpen
            if (willOpen) {
              openScrollYRef.current = window.scrollY
              ignoreScrollUntilRef.current = Date.now() + 300
              setMenuOpen(true)
              setTimeout(() => window.dispatchEvent(new Event('resize')), 80)
            } else {
              setMenuOpen(false)
              // Esperar a que termine la animación de cierre para evitar parpadeos
              setTimeout(() => window.dispatchEvent(new Event('resize')), 300)
            }
          }}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className="navbar-nav">
          {!isLoggedIn ? (
            // Botones para usuarios no logueados
            <>
              <button
                className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => scrollToSection('#inicio')}
              >
                Inicio
              </button>

              <button
                className="navbar-link"
                onClick={() => scrollToSection('.map-section')}
              >
                Explora
              </button>

              <button
                className="navbar-link"
                onClick={() => scrollToSection('.testimonial-section')}
              >
                Testimonios
              </button>

              <button
                className="navbar-link"
                onClick={() => scrollToSection('.benefits-section')}
              >
                Beneficios
              </button>

              <button
                className="navbar-button navbar-button-secondary"
                onClick={() => navigate('/login')}
              >
                Ingresar
              </button>
              <button
                className="navbar-button navbar-button-primary"
                onClick={() => navigate('/register-roles')}
              >
                Registrarse
              </button>
            </>
          ) : (
            // Usuario logueado
            <>
              <div className="navbar-user">
                {getAvatarImage() ? (
                  <img src={getAvatarImage()} alt="avatar" className="navbar-user-avatar" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="navbar-user-avatar">
                    {getUserInitial()}
                  </div>
                )}
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