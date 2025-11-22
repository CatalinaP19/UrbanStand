import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Componentes/Breadcrumbs';


const UrbanStand = ({ onGoToLogin, onGoToRegister, onGoToVendorRegister, onGoToEntityRegister, onGoToClientView, onGoToEntityView }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [testimonialAvatar, setTestimonialAvatar] = useState('');
  const navigate = useNavigate();
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

 <style>{`
       /* ===== FOOTER STYLES - Agregar a tu archivo CSS existente ===== */

.footer {
  background: #005954;
  color: #e0e0e0;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px 30px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #fff;
}

.footer-logo .highlight {
  color: var(--primary);
}

.footer-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #ffffffff;
  margin-bottom: 20px;
}

.footer-social {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background:rgba(255, 255, 255, 0.38);
  transform: translateY(-3px);
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #ffffffff;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color:  rgba(255, 255, 255, 0.65);
  padding-left: 5px;
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contact li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  color: #ffffffff;
  font-size: 0.95rem;
}

.footer-contact li svg {
  color: rgba(255, 255, 255, 0.65);
  flex-shrink: 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-bottom p {
  margin: 0;
  color: #ffffffff;
  font-size: 0.9rem;
}

.footer-legal {
  display: flex;
  gap: 25px;
}

.footer-legal a {
  color: #ffffffff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-legal a:hover {
  color: rgba(255, 255, 255, 0.65);
}

/* ===== RESPONSIVE FOOTER ===== */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .footer-column {
    align-items: center;
  }

  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-social {
    justify-content: center;
  }

  .footer-links a:hover {
    padding-left: 0;
  }

  .footer-contact li {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .footer-legal {
    flex-wrap: wrap;
    justify-content: center;
  }
}
      `}</style>

      <main className="container">
        <Breadcrumbs />
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
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (onGoToClientView) {
                    onGoToClientView();
                  } else {
                    navigate('/cliente');
                  }
                }}
              >
                Acceder como...
              </button>
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
  <div className="footer-content">
    <div className="footer-grid">
      {/* Columna 1: Logo y descripción */}
      <div className="footer-column">
        <h3 className="footer-logo">
          <span className="highlight">Urban</span>Stand
        </h3>
        <p className="footer-description">
          La plataforma que conecta vendedores ambulantes, clientes y entidades 
          para una economía urbana más visible y segura.
        </p>
        <div className="footer-social">
          <a href="#" className="social-link" aria-label="Facebook">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
            </svg>
          </a>
          <a href="#" className="social-link" aria-label="Instagram">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
            </svg>
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
            </svg>
          </a>
          <a href="#" className="social-link" aria-label="LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Columna 2: Enlaces rápidos */}
      <div className="footer-column">
        <h4 className="footer-title">Enlaces Rápidos</h4>
        <ul className="footer-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#usuarios">Usuarios</a></li>
          <li><a href="#beneficios">Beneficios</a></li>
          <li><a href="#mapa">Mapa de Puestos</a></li>
          <li><a href="#testimonios">Testimonios</a></li>
        </ul>
      </div>

      {/* Columna 3: Contacto */}
      <div className="footer-column">
        <h4 className="footer-title">Contacto</h4>
        <ul className="footer-contact">
          <li>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
            <span>Bogotá, Colombia</span>
          </li>
          <li>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
            </svg>
            <span>contacto@urbanstand.co</span>
          </li>
          <li>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
            </svg>
            <span>+57 300 123 4567</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>&copy; 2025 UrbanStand. Todos los derechos reservados.</p>
    <div className="footer-legal">
      <a href="#">Términos de uso</a>
      <a href="#">Privacidad</a>

    </div>
  </div>
</footer>
    </>
  );
};

export default UrbanStand;