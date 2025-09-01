import React, { useState, useEffect } from 'react';

const UrbanStand = () => {
  // CSS en línea para evitar dependencia externa
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --primary: #ff7901;
        --secondary: #085c52;
        --accent: #9a1e22;
        --background: #faf3e0;
        --surface: #ffffff;
        --text-primary: #202124;
        --text-secondary: #5f6368;
        --border: #dadce0;
        --shadow: rgba(0, 0, 0, 0.1);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: var(--background);
        color: var(--text-primary);
        line-height: 1.6;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .header {
        background: var(--background);
        padding: 15px 0;
        box-shadow: 0 2px 10px var(--shadow);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
      }

      .logo {
        font-size: 28px;
        font-weight: bold;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .logo img {
        height: 40px;
        width: auto;
      }

      .nav-links {
        display: flex;
        gap: 30px;
        list-style: none;
      }

      .nav-links a {
        text-decoration: none;
        color: var(--text-primary);
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .nav-links a:hover {
        color: var(--accent);
      }

      .auth-buttons {
        display: flex;
        gap: 10px;
      }

      .btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        border: none;
        font-size: 14px;
      }

      .btn-primary:hover {
        background: transparent;
        color: var(--primary);
        transform: translateY(-2px);
      }

      .btn-primary {
        background: var(--primary);
        color: white;
        border: 2px solid var(--primary);
      }

      .btn-secondary:hover {
        background: transparent;
        color: var(--accent);
        border: 2px solid var(--accent);
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: var(--accent);
        color: white;
        border: 2px solid var(--accent);
      }

      .hero {
        padding: 60px 0;
      }

      .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: center;
      }

      .hero-text h1 {
        font-size: 42px;
        font-weight: bold;
        color: var(--text-primary);
        margin-bottom: 20px;
      }

      .hero-text .highlight {
        color: var(--accent);
      }

      .hero-text p {
        font-size: 18px;
        color: var(--text-secondary);
        margin-bottom: 30px;
        line-height: 1.8;
      }

      .hero-image {
        width: 100%;
        border-radius: 15px;
        box-shadow: 0 15px 35px var(--shadow);
        object-fit: cover;
        height: 350px;
      }

      .cta-button {
        background: var(--primary);
        color: white;
        padding: 15px 30px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 8px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
      }

      .cta-button:hover {
        background: var(--accent);
        transform: translateY(-2px);
      }

      .users-section {
        padding: 60px 0;
      }

      .section-title {
        text-align: center;
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 50px;
        color: var(--accent);
      }

      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 50px;
      }

      .user-card {
        background: var(--surface);
        padding: 40px 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 8px 25px var(--shadow);
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .user-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }

      .user-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: linear-gradient(45deg, var(--primary), #ff9533);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-card h3 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
        color: var(--text-primary);
      }

      .user-card p {
        color: var(--text-secondary);
        margin-bottom: 25px;
        line-height: 1.6;
      }

      .map-section {
        padding: 40px 0;
        text-align: center;
      }

      .map-container {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px var(--shadow);
        margin: 30px 0;
      }

      #map {
        height: 400px;
        width: 100%;
      }

      .map-login-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
      }

      .modal-content {
        background: var(--surface);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(1);
        transition: transform 0.3s ease;
      }

      .modal-content h3 {
        color: var(--primary);
        margin-bottom: 15px;
        font-size: 24px;
      }

      .modal-content p {
        color: var(--text-secondary);
        margin-bottom: 25px;
        line-height: 1.6;
      }

      .modal-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
      }

      .close-modal {
        background: transparent;
        border: 2px solid var(--border);
        color: var(--text-secondary);
      }

      .close-modal:hover {
        border-color: var(--primary);
        color: var(--primary);
      }

      .testimonial-section {
        background: linear-gradient(135deg, #fff5ec 0%, #ffe5d1 100%);
        padding: 60px 0;
        margin: 60px 0;
        border-radius: 25px;
        position: relative;
        overflow: hidden;
      }

      .testimonial-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f5b175 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ff7901" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        opacity: 0.3;

      }

      .testimonial {
        text-align: center;
        max-width: 700px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }

      .testimonial-header {
        margin-bottom: 40px;
      }

      .testimonial-title {
        font-size: 28px;
        font-weight: bold;
        color: var(--text-primary);
        margin-bottom: 10px;
      }

      .testimonial-subtitle {
        color: var(--text-secondary);
        font-size: 16px;
      }

      .testimonial-card {
        background: var(--surface);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(255, 121, 1, 0.1);
        border: 1px solid rgba(255, 121, 1, 0.1);
        position: relative;
      }

      .testimonial-card::before {
        content: '"';
        font-size: 80px;
        color: var(--primary);
        position: absolute;
        top: -10px;
        left: 30px;
        font-family: Georgia, serif;
        opacity: 0.3;
      }

      .testimonial-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto 25px;
        border: 4px solid var(--primary);
        box-shadow: 0 8px 25px rgba(255, 121, 1, 0.2);
        transition: transform 0.3s ease;
      }

      .testimonial-avatar:hover {
        transform: scale(1.05);
      }

      .testimonial-text {
        font-size: 22px;
        font-style: italic;
        color: var(--text-primary);
        margin-bottom: 25px;
        line-height: 1.6;
        font-weight: 500;
      }

      .testimonial-author {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
      }

      .author-info {
        text-align: left;
      }

      .author-name {
        font-weight: bold;
        color: var(--text-primary);
        font-size: 18px;
        margin-bottom: 5px;
      }

      .author-role {
        color: var(--primary);
        font-size: 14px;
        font-weight: 600;
      }

      .testimonial-rating {
        display: flex;
        gap: 5px;
        margin-bottom: 20px;
        justify-content: center;
      }

      .star {
        color: #ffd700;
        font-size: 24px;
      }

      .testimonial-stats {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid rgba(255, 121, 1, 0.2);
      }

      .stat-item {
        text-align: center;
      }

      .stat-number {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary);
        display: block;
      }

      .stat-label {
        font-size: 14px;
        color: var(--text-secondary);
        margin-top: 5px;
      }

      .benefits-section {
        padding: 60px 0;
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
      }

      .benefit-card {
        background: var(--surface);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 15px var(--shadow);
        transition: all 0.3s ease;
      }

      .benefit-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }

      .benefit-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 15px;
        color: var(--primary);
      }

      .benefit-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--text-primary);
        margin-bottom: 10px;
      }

      .benefit-number {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary);
      }

      .footer {
        background: var(--accent);
        color: var(--surface);
        padding: 0px 0 20px;
        margin-top: 60px;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
      }

 
      .footer-section p, .footer-section a {
        color: #ccc;
        text-decoration: none;
        line-height: 1.8;
      }

      .footer-section a:hover {
        color: var(--primary);
      }

      .footer-bottom {
        padding-top: 20px;
        text-align: center;
        color: #faf3e0;
      }

      @media (max-width: 768px) {
        .hero-content {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .hero-text h1 {
          font-size: 32px;
        }

        .nav-links {
          display: none;
        }

        .users-grid {
          grid-template-columns: 1fr;
        }

        .benefits-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 480px) {
        .benefits-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // También cargar Leaflet CSS si no está cargado
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    // Cargar Leaflet JS si no está cargado
    if (!window.L) {
      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      leafletJS.onload = () => {
        setTimeout(initMap, 100);
      };
      document.head.appendChild(leafletJS);
    } else {
      setTimeout(initMap, 100);
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [showMapModal, setShowMapModal] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [testimonialAvatar, setTestimonialAvatar] = useState('');

  const avatarImages = [
    "https://protoinfrastack.ivondy.com/media/vO8SMrOMuVyUDTYiuaTgSAbWYwAwTd7C3oCs.png",
    "https://protoinfrastack.ivondy.com/media/VdbygmIJK95vt1MRtSjawaXu6z430NAguXHX.png",
    "https://protoinfrastack.ivondy.com/media/D3Z7AsmYzOz3GLI5RcIFebTOEkz57HGoME1N.png",
    "https://protoinfrastack.ivondy.com/media/eN2hrChZ8w5oslLVcY8BbaGBUEbtKVXgHA3x.png",
    "https://protoinfrastack.ivondy.com/media/FWmYqHFeFaT99CCeMwwKvUsh6pG47p9eHRLE.png",
    "https://protoinfrastack.ivondy.com/media/F6AxsphXEQRziQ9cEdrofL1jgTjyDrivpM93.png"
  ];

  useEffect(() => {
    // Mostrar imagen aleatoria para el testimonial
    const randomIndex = Math.floor(Math.random() * avatarImages.length);
    setTestimonialAvatar(avatarImages[randomIndex]);

    // Inicializar mapa cuando el componente se monte
    initMap();
  }, []);

  const initMap = () => {
    // Verificar si Leaflet está disponible
    if (typeof window !== 'undefined' && window.L) {
      const map = window.L.map('map', {
        center: [4.6097, -74.0817], // Bogotá
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      });

      // Mapa base con estilo claro
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Algunos marcadores de ejemplo
      const vendors = [
        [4.6097, -74.0817, "Puesto Central", "Frutas y verduras frescas"],
        [4.6150, -74.0750, "Frutas Frescas", "Los mejores productos del día"],
        [4.6050, -74.0900, "Comida Rápida", "Empanadas y jugos naturales"],
        [4.6200, -74.0800, "Artesanías", "Productos hechos a mano"],
        [4.6000, -74.0850, "Dulces Típicos", "Postres tradicionales"],
        [4.6180, -74.0720, "Ropa Casual", "Prendas a buen precio"]
      ];

      vendors.forEach(([lat, lng, name, description]) => {
        const marker = window.L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center;">
              <h4 style="color: #ff7901; margin-bottom: 8px;">${name}</h4>
              <p style="margin-bottom: 10px; color: #666;">${description}</p>
              <button style="background: #ff7901; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                Ver más detalles
              </button>
            </div>
          `);
        
        // Interceptar clicks en marcadores
        marker.on('click', function() {
          if (!userInteracted) {
            setUserInteracted(true);
            setTimeout(() => {
              setShowMapModal(true);
            }, 100);
          }
        });
      });

      // Interceptar intentos de interacción con el mapa
      map.on('movestart', function() {
        if (!userInteracted) {
          setUserInteracted(true);
          map.stop();
          setShowMapModal(true);
        }
      });

      map.on('zoomstart', function() {
        if (!userInteracted) {
          setUserInteracted(true);
          setShowMapModal(true);
        }
      });

      // También interceptar clics en el mapa
      map.on('click', function() {
        if (!userInteracted) {
          setUserInteracted(true);
          setShowMapModal(true);
        }
      });
    }
  };

  const showLoginMessage = () => {
    alert('¡Próximamente! Esta funcionalidad estará disponible cuando implementemos el sistema de autenticación.');
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setUserInteracted(false);
  };

  const scrollToSection = (sectionId) => {
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="../img/logo.png" alt="logo" />
              UrbanStand
            </div>
            <nav>
              <ul className="nav-links">
                <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}>Inicio</a></li>
                <li><a href="#acerca" onClick={(e) => { e.preventDefault(); scrollToSection('#acerca'); }}>Acerca</a></li>
                <li><a href="#funcionalidades" onClick={(e) => { e.preventDefault(); scrollToSection('#funcionalidades'); }}>Funcionalidades</a></li>
              </ul>
            </nav>
            <div className="auth-buttons">
              <button className="btn btn-secondary" onClick={showLoginMessage}>Ingresar</button>
              <button className="btn btn-primary" onClick={showLoginMessage}>Registrarse</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        <section className="hero" id="inicio">
          <div className="hero-content">
            <div className="hero-text">
              <h1><span className="highlight">UrbanStand:</span><br />La plataforma que conecta vendedores, clientes y entidades</h1>
              <p>para una economía urbana más visible y segura</p>
              <a href="#usuarios" className="cta-button" onClick={(e) => { e.preventDefault(); scrollToSection('#usuarios'); }}>
                Comenzar →
              </a>
            </div>
            <div>
              <img className="hero-image" 
                   src="https://www.elnuevosiglo.com.co/sites/default/files/2023-10/RS3592_IMG-20230814-WA0095.jpg" 
                   alt="Vendedor ambulante atendiendo a un cliente" />
            </div>
          </div>
        </section>

        {/* User Types Section */}
        <section className="users-section" id="usuarios">
          <div className="users-grid">
            <article className="user-card">
              <div className="user-icon">
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0z"/>
                  <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6z"/>
                </svg>
              </div>
              <h3>Cliente</h3>
              <p>Buscar productos y puestos cercanos</p>
              <button className="btn btn-primary" onClick={showLoginMessage}>Acceder como...</button>
            </article>

            <article className="user-card">
              <div className="user-icon">
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z"/>
                </svg>
              </div>
              <h3>Vendedor</h3>
              <p>Visibilidad, alertas y seguridad</p>
              <button className="btn btn-primary" onClick={showLoginMessage}>Acceder como...</button>
            </article>

            <article className="user-card">
              <div className="user-icon">
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z"/>
                </svg>
              </div>
              <h3>Gobierno / Entidades</h3>
              <p>Estadísticas e informes para políticas públicas</p>
              <button className="btn btn-primary" onClick={showLoginMessage}>Acceder como...</button>
            </article>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2 className="section-title">Explora Nuestros Puestos</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '30px'}}>Descubre vendedores cercanos a tu ubicación</p>
          <div className="map-container">
            <div id="map"></div>
          </div>
        </section>

        {/* Map Login Modal */}
        {showMapModal && (
          <div className="map-login-modal show" onClick={(e) => e.target.className.includes('map-login-modal') && closeMapModal()}>
            <div className="modal-content">
              <h3>🔒 Funcionalidad Premium</h3>
              <p>Para explorar el mapa completamente, interactuar con los vendedores y acceder a todas las funcionalidades, necesitas iniciar sesión.</p>
              <div className="modal-buttons">
                <button className="btn btn-primary" onClick={showLoginMessage}>Iniciar Sesión</button>
                <button className="btn close-modal" onClick={closeMapModal}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* Testimonial Section */}
        <section className="testimonial-section">
          <div className="testimonial">
            <div className="testimonial-header">
              <h2 className="testimonial-title">Testimonios</h2>
              <p className="testimonial-subtitle">Lo que dicen nuestros usuarios</p>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              
              <img className="testimonial-avatar" src={testimonialAvatar} alt="Avatar del usuario" />
              
              <div className="testimonial-text">Gracias a UrbanStand aumenté mis ventas en un 30%</div>
              
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Javier Rodríguez</div>
                  <div className="author-role">Vendedor ambulante</div>
                </div>
              </div>
              
              <div className="testimonial-stats">
                <div className="stat-item">
                  <span className="stat-number">+30%</span>
                  <div className="stat-label">Aumento en ventas</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2 años</span>
                  <div className="stat-label">Usando UrbanStand</div>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <div className="stat-label">Clientes atendidos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2 className="section-title">Beneficios</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976z"/>
              </svg>
              <div className="benefit-title">Visibilidad de puestos</div>
              <div className="benefit-number">1,245</div>
            </div>

            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92z"/>
              </svg>
              <div className="benefit-title">Alertas de seguridad</div>
              <div className="benefit-number">3,210</div>
            </div>

            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/>
              </svg>
              <div className="benefit-title">Estadísticas confiables</div>
              <div className="benefit-number">20</div>
            </div>

            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z"/>
              </svg>
              <div className="benefit-title">Conexión entre vendedores y clientes</div>
              <div className="benefit-number">∞</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
          <div className="footer-bottom">
            <p>&copy; 2024 UrbanStand. Todos los derechos reservados.</p>
          </div>
      </footer>
    </>
  );
};

export default UrbanStand;