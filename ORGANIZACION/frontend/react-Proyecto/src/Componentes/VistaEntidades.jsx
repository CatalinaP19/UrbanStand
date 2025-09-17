import React, { useEffect } from 'react'



export default function VistaEntidades() {
  // Simula función para ir al inicio
  const goHome = () => {
    console.log("Volver al inicio");
  }

    // Simula función para enviar formulario
  const handleSubmit = () => {
    console.log("Formulario enviado");
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
        text-align: left;
        color: #9a1e22;
      }

      .register-subtitle {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 2rem;
        text-align: center;
        color: #9a1e22;
      }

      .register-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin: 1rem;
      }


      .register-submit-button {
        border: 2px solid #ea580c;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        background: transparent;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.2s ease;
        width: 100%;
        color: #ea580c;
      }

      .register-submit-button:hover {
        background: #9a1e22;
        color: white;
        border-color: #9a1e22;
      }

      .logo {
        font-size: 28px;
        font-weight: bold;
        color: #f97316;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .imagen-texto {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

    .imagen-texto img{
      width: 10rem;
      height: auto;
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
          <button onClick={goHome} className="register-home-button">
            Volver al inicio
          </button>
        </div>
      </header>

      {/* Register Container */}
      <div className="register-content">
        <div className="register-box">
            <div className='imagen-texto'>
          <h1 className="register-title">Monitoreo de vendedores informales en la ciudad</h1>
          <img className='img-VistaE'src='../img/Img-VistaEntidades.jpg' alt='Imagén de vendedor ambulante' />
          </div>
        </div>
      </div>
    </div>
  )
}

