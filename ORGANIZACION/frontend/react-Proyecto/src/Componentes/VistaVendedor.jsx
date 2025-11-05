import React, { useState, useEffect } from 'react';
import { MapPin, Bell, MessageCircle, X, Send, User, BarChart3, Edit3, Package } from 'lucide-react';
import apiService from '../services/apiService';

const VistaVendedor = ({ vendedorData = null }) => {
  // Cargar usuario actual desde localStorage si no llega por props
  const storedUser = (() => {
    try {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('urbanstand_current_user') || 'null');
      }
    } catch (_) { /* ignore */ }
    return null;
  })();

  // Garantizar datos por defecto cuando se usa la ruta directa
  const initialVendedor = vendedorData ?? {
    nombre: storedUser?.firstName || 'Vendedor',
    tipoVendedor: 'Vendedor',
    descripcion: 'Bienvenido a tu panel. Gestiona tu puesto y productos.',
    genero: storedUser?.genero || ''
  };

  const [vendedor, setVendedor] = useState(initialVendedor);

  const [isChatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Juan', text: 'Hola, ¿cómo puedo ayudarte?', isOwn: false },
    { id: 2, sender: 'Cliente', text: 'Hola, quiero ver tus productos', isOwn: true }
  ]);

  // Inicializar mapa
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
  }, []);

  // Hidratar desde localStorage/API si no vino por props
  useEffect(() => {
    if (vendedorData) return; // ya viene por props

    const loadFromLocal = () => {
      try {
        const raw = localStorage.getItem('urbanstand_current_user');
        if (!raw) return false;
        const cu = JSON.parse(raw);
        if (!cu) return false;
        setVendedor(prev => ({
          ...prev,
          nombre: cu.firstName || prev.nombre,
          genero: cu.genero || prev.genero,
        }));
        return Boolean(cu.firstName || cu.genero);
      } catch (_) { return false; }
    };

    // 1) Intento inmediato localStorage
    const okNow = loadFromLocal();
    if (okNow) return;

    // 2) Reintento corto (por si la navegación fue muy rápida tras el login)
    const t = setTimeout(() => {
      const okLater = loadFromLocal();
      if (!okLater) {
        // 2b) Fallback: leer primer usuario guardado en 'urbanstand_users'
        try {
          const all = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
          const keys = Object.keys(all || {});
          if (keys.length > 0) {
            const u = all[keys[0]] || {};
            if (u.firstName || u.genero) {
              setVendedor(prev => ({
                ...prev,
                nombre: u.firstName || prev.nombre,
                genero: u.genero || prev.genero,
              }));
              // también sincroniza current_user para próximas veces
              localStorage.setItem('urbanstand_current_user', JSON.stringify({
                role: 'vendedor',
                firstName: u.firstName,
                lastName: u.lastName,
                genero: u.genero,
              }));
              return; // evitar ir directo a API si ya tenemos datos
            }
          }
        } catch (_) { /* ignore */ }
        // 3) Fallback: cargar desde API
        (async () => {
          try {
            // ✅ Obtener el token con validación
            const token = localStorage.getItem('token');

            if (!token) {
              // Sin token, ya se cargó desde localStorage o props
              return;
            }

            const profileResponse = await apiService.vendedor.profile(token);
            const profile = profileResponse?.vendedor || profileResponse;

            const first = profile?.firstName || profile?.nombre || '';
            const last = profile?.lastName || profile?.apellido || '';
            const genero = profile?.genero || profile?.gender || '';
            const nombre = first || 'Vendedor';

            setVendedor(prev => ({ ...prev, nombre, genero }));

            try {
              localStorage.setItem('urbanstand_current_user', JSON.stringify({
                role: 'vendedor',
                email: profile?.email,
                firstName: first,
                lastName: last,
                genero,
              }));
            } catch (_) { /* ignore */ }
          } catch (err) {
            console.error('Error cargando perfil desde API:', err);
          }
        })();
      }
    }, 150);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initMap = () => {
    if (typeof window !== 'undefined' && window.L) {
      const mapElement = document.getElementById('vendor-map');
      if (!mapElement) return;

      const map = window.L.map('vendor-map', {
        center: [4.6097, -74.0817], // Bogotá
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: ' OpenStreetMap contributors'
      }).addTo(map);

      // Mi ubicación (vendedor)
      const myLocation = window.L.marker([4.6097, -74.0817], {
        icon: window.L.divIcon({
          className: 'custom-marker my-location',
          html: '<div style="background: var(--primary); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
      }).addTo(map);

      myLocation.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <h4 style="color: var(--primary); margin-bottom: 8px;">${vendedor.nombre}</h4>
          <p style="margin-bottom: 8px; color: #666; font-size: 12px;">${vendedor.descripcion}</p>
          <div style="font-size: 11px; color: #999;"> Mi ubicación actual</div>
        </div>
      `);

      // Otros vendedores cercanos
      const otherVendors = [
        [4.6150, -74.0750, "María López", "Frutas y verduras frescas"],
        [4.6050, -74.0900, "Carlos Pérez", "Empanadas y jugos naturales"],
        [4.6200, -74.0800, "Ana García", "Productos artesanales"],
        [4.6000, -74.0850, "Luis Torres", "Dulces típicos"],
        [4.6180, -74.0720, "Rosa Martín", "Ropa y accesorios"]
      ];

      otherVendors.forEach(([lat, lng, name, description]) => {
        const marker = window.L.marker([lat, lng], {
          icon: window.L.divIcon({
            className: 'custom-marker other-vendor',
            html: '<div style="background: var(--secondary); width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(map);

        marker.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <h4 style="color: var(--secondary); margin-bottom: 8px;">${name}</h4>
            <p style="margin-bottom: 10px; color: #666; font-size: 12px;">${description}</p>
            <button style="background: var(--accent); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
              Enviar mensaje
            </button>
          </div>
        `);
      });

      // Clientes potenciales (puntos de interés)
      const customerAreas = [
        [4.6120, -74.0780, "Zona Comercial", "Alto tráfico de clientes"],
        [4.6080, -74.0820, "Parque Central", "Familias y niños"],
        [4.6160, -74.0740, "Universidad", "Estudiantes y profesores"],
        [4.6040, -74.0880, "Terminal", "Viajeros y trabajadores"]
      ];

      customerAreas.forEach(([lat, lng, name, description]) => {
        const circle = window.L.circle([lat, lng], {
          color: 'var(--primary)',
          fillColor: 'var(--primary)',
          fillOpacity: 0.2,
          radius: 200
        }).addTo(map);

        circle.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <h4 style="color: var(--primary); margin-bottom: 8px;">${name}</h4>
            <p style="margin-bottom: 8px; color: #666; font-size: 12px;">${description}</p>
            <div style="font-size: 11px; color: var(--accent); font-weight: bold;"> Oportunidad de ventas</div>
          </div>
        `);
      });
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'Tú',
        text: message,
        isOwn: true
      }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getProfileImage = (genero) => {
    const g = (genero || '').toString().toLowerCase();
    if (g.includes('fem')) return '/img/PerfilFemale.png';
    if (g.includes('mas')) return '/img/PerfilMale.png';
    if (g.includes('otr')) return '/img/PerfilOther.png';
    // Por defecto Other si no hay género
    return '/img/PerfilOther.png';
  };

  // Imagen del perfil basada en género
  const vendorProfileImage = getProfileImage(vendedor.genero);

  return (
    <>
      <div className="container-fluid" style={{ padding: '0 var(--spacing-3xl)' }}>
        {/* Hero Section */}
      <section 
        className="hero" 
        style={{ 
          paddingBottom: 'var(--spacing-3xl)' 
        }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className="highlight">Panel de</span><br />
              {vendedor.nombre}
            </h1>
            <p>
              Gestiona tu negocio, conecta con clientes y optimiza tus ventas
            </p>
          </div>
          <div style={{ flex: '1', textAlign: 'center' }}>
            <img
              src="/img/vendedor.png"
              alt="Vendedor ambulante"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 'var(--spacing-2xl)',
        marginBottom: 'var(--spacing-3xl)'
      }}>
        {/* Map Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--surface)', // White background
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 2px 10px var(--shadow)'
          }}>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: 'var(--secondary)',
              fontSize: '1.25rem'
            }}>Mapa de Vendedores</h3>
            <p style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>Tu ubicación y vendedores cercanos</p>
          </div>

          <div style={{
            height: '450px',
            backgroundColor: '#f0f0f0',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 2px 12px var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div id="vendor-map" style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--radius-xl)'
            }}></div>
          </div>

          {/* Leyenda del mapa */}
          <div style={{
            backgroundColor: 'var(--surface)', // White background
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 2px 10px var(--shadow)'
          }}>
            <h4 style={{
              margin: '0 0 0.75rem 0',
              color: 'var(--secondary)',
              fontSize: '1rem'
            }}>Leyenda</h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}></div>
                <span>Tu ubicación</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--secondary)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}></div>
                <span>Otros vendedores</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '50%',
                  opacity: '0.3'
                }}></div>
                <span>Zonas con clientes potenciales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)'
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            boxShadow: '0 2px 10px var(--shadow)'
          }}>
            <img
              src={vendorProfileImage}
              alt={`Perfil de ${vendedor.nombre}`}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--spacing-lg)',
                objectFit: 'cover'
              }}
            />
            <h2 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.3rem'
            }}>{vendedor.nombre}</h2>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-secondary)',
              fontWeight: 'normal',
              fontSize: '0.9rem'
            }}>{vendedor.tipoVendedor}</h4>
            <p style={{
              margin: '0 0 var(--spacing-xl) 0',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: '1.4'
            }}>
              {vendedor.descripcion}
            </p>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <button style={{
                background: '#f0f0f0',
                border: 'none',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                transition: 'var(--transition-fast)'
              }}>
                <Edit3 size={14} />
                Editar perfil
              </button>
              <button style={{
                background: '#f0f0f0',
                border: 'none',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                transition: 'var(--transition-fast)'
              }}>
                <Package size={14} />
                Mis productos
              </button>
            </div>

            <button style={{
              background: '#f0f0f0',
              border: 'none',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--radius-xl)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              margin: '0 auto',
              transition: 'var(--transition-fast)'
            }}>
              <BarChart3 size={14} />
              Estadísticas
            </button>
          </div>

          {/* Stats Card */}
          <div style={{
            backgroundColor: 'var(--surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 2px 10px var(--shadow)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: 'var(--secondary)',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}>Resumen de Hoy</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-lg)',
              textAlign: 'center'
            }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 121, 1, 0.1)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                  marginBottom: '0.25rem'
                }}>12</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>Ventas</div>
              </div>

              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(8, 92, 82, 0.1)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--secondary)',
                  marginBottom: '0.25rem'
                }}>$85K</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>Ingresos</div>
              </div>

              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(154, 30, 34, 0.1)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--accent)',
                  marginBottom: '0.25rem'
                }}>8</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>Clientes</div>
              </div>

              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 121, 1, 0.1)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                  marginBottom: '0.25rem'
                }}>4.8</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)'
                }}>Rating</div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
          zIndex: 999
        }}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Box */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '320px',
          height: '450px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 4px 12px var(--shadow-hover)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000
        }}
        >
          {/* Chat Header */}
          <div style={{
            background: 'var(--accent)',
            color: '#fff',
            padding: '12px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <div style={{
                fontWeight: 'bold',
                fontSize: '14px'
              }}>Chat - Vendedores</div>
              <div style={{
                fontSize: '12px',
                opacity: '0.9'
              }}>Localidad Kennedy</div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: 'var(--background)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isOwn ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: msg.isOwn ? '#DCF8C6' : 'var(--surface)',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    marginBottom: '2px',
                    fontSize: '12px'
                  }}>
                    {msg.sender}:
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{
            display: 'flex',
            padding: '15px',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid #e0e0e0'
          }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: 'var(--radius-xl)',
                outline: 'none',
                fontSize: '14px',
                transition: 'all var(--transition-fast)'
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: '10px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--spacing-2xl)',
        backgroundColor: 'var(--secondary)',
        color: '#fff',
        marginTop: 'var(--spacing-3xl)'
      }}>
        <p style={{ margin: 0 }}>2025 UrbanStand. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default VistaVendedor;