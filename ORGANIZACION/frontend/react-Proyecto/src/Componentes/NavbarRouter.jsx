import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavbarRouter() {
  return (
    <nav className="navbar" style={{
      background: '#faf3e0',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div className="navbar-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <NavLink to="/" className="navbar-logo" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#f97316',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <img src="../img/logo.png" alt="logo" style={{ height: 36 }} />
          UrbanStand
        </NavLink>

        <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={linkStyle}>Inicio</NavLink>
          <NavLink to="/chat" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={linkStyle}>Chat</NavLink>
          <NavLink to="/vendedor" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={linkStyle}>Vendedor</NavLink>
          <NavLink to="/entidades" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={linkStyle}>Entidades</NavLink>
          <NavLink to="/cliente" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} style={linkStyle}>Cliente</NavLink>
        </div>

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <NavLink to="/login" className="navbar-button navbar-button-secondary" style={buttonSecondary}>Ingresar</NavLink>
          <NavLink to="/register-roles" className="navbar-button navbar-button-primary" style={buttonPrimary}>Registrarse</NavLink>
        </div>
      </div>
    </nav>
  )
}

const linkStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 500,
  color: '#374151',
  textDecoration: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.5rem'
}

const buttonSecondary = {
  border: '2px solid #f97316',
  color: '#f97316',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  textDecoration: 'none'
}

const buttonPrimary = {
  border: '2px solid #f97316',
  background: '#f97316',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  textDecoration: 'none'
}
