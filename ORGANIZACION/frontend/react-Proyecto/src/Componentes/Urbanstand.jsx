import React, { useState, useEffect } from 'react';

const UrbanStand = ({ onGoToLogin, onGoToRegister, onGoToVendorRegister, onGoToEntityRegister, onGoToClientView, onGoToEntityView }) => {
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
    // Cargar Leaflet CSS si no está cargado
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

    // Mostrar imagen aleatoria para el testimonial
    const randomIndex = Math.floor(Math.random() * avatarImages.length);
    setTestimonialAvatar(avatarImages[randomIndex]);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.__urbanstandMap) {
        window.__urbanstandMap.invalidateSize(false);
      }
    };
    window.addEventListener('resize', onResize);
  
    // Observer de visibilidad del elemento del mapa
    let observer = null;
    const el = document.getElementById('map');
    if (el && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && window.__urbanstandMap) {
            setTimeout(() => window.__urbanstandMap.invalidateSize(false), 50);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    }
  
    return () => {
      window.removeEventListener('resize', onResize);
      if (observer) observer.disconnect();
    };
  }, []);

  const initMap = () => {
    if (typeof window !== 'undefined' && window.L) {
      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      const map = window.L.map('map', {
        center: [4.6097, -74.0817], // Bogotá
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      });
      // Exponer referencia global y asegurar recálculo de tamaño inicial
      window.__urbanstandMap = map;
      setTimeout(() => map.invalidateSize(false), 100);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: ' OpenStreetMap contributors'
      }).addTo(map);

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
              <h4 style="color: var(--primary); margin-bottom: 8px;">${name}</h4>
              <p style="margin-bottom: 10px; color: #666;">${description}</p>
              <button style="background: var(--primary); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                Ver más detalles
              </button>
            </div>
          `);

        marker.on('click', function () {
          if (!userInteracted) {
            setUserInteracted(true);
            setTimeout(() => setShowMapModal(true), 100);
          }
        });
      });

      map.on('movestart', function () {
        if (!userInteracted) {
          setUserInteracted(true);
          map.stop();
          setShowMapModal(true);
        }
      });

      map.on('zoomstart', function () {
        if (!userInteracted) {
          setUserInteracted(true);
          setShowMapModal(true);
        }
      });

      map.on('click', function () {
        if (!userInteracted) {
          setUserInteracted(true);
          setShowMapModal(true);
        }
      });
    }
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
                  <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0z" />
                  <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6z" />
                </svg>
              </div>
              <h3>Cliente</h3>
              <p>Buscar productos y puestos cercanos</p>
              <button className="btn btn-primary" onClick={onGoToClientView}>Acceder como...</button>
            </article>

            <article className="user-card">
              <div className="user-icon">
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
                </svg>
              </div>
              <h3>Vendedor</h3>
              <p>Visibilidad, alertas y seguridad</p>
              <button className="btn btn-primary" onClick={onGoToVendorRegister}>Acceder como...</button>
            </article>

            <article className="user-card">
              <div className="user-icon">
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
                </svg>
              </div>
              <h3>Gobierno / Entidades</h3>
              <p>Estadísticas e informes para políticas públicas</p>
              <button className="btn btn-primary" onClick={onGoToEntityRegister}>Acceder como...</button>
            </article>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section">
          <h2 className="section-title">Explora Nuestros Puestos</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Descubre vendedores cercanos a tu ubicación</p>
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
                <button className="btn btn-primary" onClick={onGoToLogin}>Iniciar Sesión</button>
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
                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976z" />
              </svg>
              <div className="benefit-title">Visibilidad de puestos</div>
              <div className="benefit-number">1,245</div>
            </div>

            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92z" />
              </svg>
              <div className="benefit-title">Alertas de seguridad</div>
              <div className="benefit-number">3,210</div>
            </div>

            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z" />
              </svg>
              <div className="benefit-title">Estadísticas confiables</div>
              <div className="benefit-number">20</div>
            </div>

            <div className="benefit-card">
              <svg className="benefit-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4m13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276Z" />
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
          <p>&copy; 2025 UrbanStand. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default UrbanStand;