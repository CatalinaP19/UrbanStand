import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Bell,
  MessageCircle,
  X,
  Send,
  User,
  BarChart3,
  Edit3,
  Package,
  Navigation,
  Zap,
} from 'lucide-react'
import apiService from '../services/apiService'
import Breadcrumbs from '../Componentes/Breadcrumbs'

const VistaVendedor = ({ vendedorData = null }) => {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const leafletMapRef = useRef(null)
  const routingControlRef = useRef(null)

  // Cargar usuario actual desde localStorage si no llega por props
  const storedUser = (() => {
    try {
      if (typeof window !== 'undefined') {
        return JSON.parse(
          localStorage.getItem('urbanstand_current_user') || 'null'
        )
      }
    } catch (_) {
      /* ignore */
    }
    return null
  })()

  // Garantizar datos por defecto cuando se usa la ruta directa
  const initialVendedor = vendedorData ?? {
    nombre: storedUser?.firstName || 'Vendedor',
    tipoVendedor: 'Vendedor',
    descripcion: 'Bienvenido a tu panel. Gestiona tu puesto y productos.',
    genero: storedUser?.genero || '',
  }

  const [vendedor, setVendedor] = useState(initialVendedor)
  const [isChatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTracking, setIsTracking] = useState(false)
  const [trackingDestination, setTrackingDestination] = useState(null)
  const [vendorLocation] = useState([4.6097, -74.0817])
  const [localidad, setLocalidad] = useState(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [chatError, setChatError] = useState(null)
  const messagesEndRef = useRef(null)

  // Inicializar mapa con Leaflet Routing Machine
  useEffect(() => {
    const loadLeaflet = () => {
      // Cargar CSS de Leaflet
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const leafletCSS = document.createElement('link')
        leafletCSS.rel = 'stylesheet'
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(leafletCSS)
      }

      // Cargar CSS de Leaflet Routing Machine
      if (
        !document.querySelector('link[href*="leaflet-routing-machine.css"]')
      ) {
        const linkRouting = document.createElement('link')
        linkRouting.rel = 'stylesheet'
        linkRouting.href =
          'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css'
        document.head.appendChild(linkRouting)
      }

      // Cargar JS de Leaflet
      if (!window.L) {
        const scriptLeaflet = document.createElement('script')
        scriptLeaflet.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        scriptLeaflet.async = true
        scriptLeaflet.onload = () => {
          // Cargar JS de Leaflet Routing Machine después de Leaflet
          const scriptRouting = document.createElement('script')
          scriptRouting.src =
            'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js'
          scriptRouting.async = true
          scriptRouting.onload = () => {
            setTimeout(initMap, 100)
          }
          document.head.appendChild(scriptRouting)
        }
        document.head.appendChild(scriptLeaflet)
      } else if (window.L.Routing) {
        setTimeout(initMap, 100)
      } else {
        // Leaflet existe pero no Routing
        const scriptRouting = document.createElement('script')
        scriptRouting.src =
          'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js'
        scriptRouting.async = true
        scriptRouting.onload = () => {
          setTimeout(initMap, 100)
        }
        document.head.appendChild(scriptRouting)
      }
    }

    loadLeaflet()

    return () => {
      if (routingControlRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeControl(routingControlRef.current)
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  // Hidratar desde localStorage/API si no vino por props
  useEffect(() => {
    if (vendedorData) return // ya viene por props

    const loadFromLocal = () => {
      try {
        const raw = localStorage.getItem('urbanstand_current_user')
        if (!raw) return false
        const cu = JSON.parse(raw)
        if (!cu) return false
        setVendedor((prev) => ({
          ...prev,
          nombre: cu.firstName || prev.nombre,
          genero: cu.genero || prev.genero,
        }))
        return Boolean(cu.firstName || cu.genero)
      } catch (_) {
        return false
      }
    }

    // 1) Intento inmediato localStorage
    const okNow = loadFromLocal()
    if (okNow) return

    // 2) Reintento corto (por si la navegación fue muy rápida tras el login)
    const t = setTimeout(() => {
      const okLater = loadFromLocal()
      if (!okLater) {
        // 2b) Fallback: leer primer usuario guardado en 'urbanstand_users'
        try {
          const all = JSON.parse(
            localStorage.getItem('urbanstand_users') || '{}'
          )
          const keys = Object.keys(all || {})
          if (keys.length > 0) {
            const u = all[keys[0]] || {}
            if (u.firstName || u.genero) {
              setVendedor((prev) => ({
                ...prev,
                nombre: u.firstName || prev.nombre,
                genero: u.genero || prev.genero,
              }))
              // también sincroniza current_user para próximas veces
              localStorage.setItem(
                'urbanstand_current_user',
                JSON.stringify({
                  role: 'vendedor',
                  firstName: u.firstName,
                  lastName: u.lastName,
                  genero: u.genero,
                })
              )
              return // evitar ir directo a API si ya tenemos datos
            }
          }
        } catch (_) {
          /* ignore */
        }
        // 3) Fallback: cargar desde API
        ;(async () => {
          try {
            // Obtener el token con validación
            const token = localStorage.getItem('token')

            if (!token) {
              // Sin token, ya se cargó desde localStorage o props
              return
            }

            const profileResponse = await apiService.vendedor.profile(token)
            const profile = profileResponse?.vendedor || profileResponse

            const first = profile?.firstName || profile?.nombre || ''
            const last = profile?.lastName || profile?.apellido || ''
            const genero = profile?.genero || profile?.gender || ''
            const nombre = first || 'Vendedor'

            setVendedor((prev) => ({ ...prev, nombre, genero }))

            try {
              localStorage.setItem(
                'urbanstand_current_user',
                JSON.stringify({
                  role: 'vendedor',
                  email: profile?.email,
                  firstName: first,
                  lastName: last,
                  genero,
                })
              )
            } catch (_) {
              /* ignore */
            }
          } catch (err) {
            console.error('Error cargando perfil desde API:', err)
          }
        })()
      }
    }, 150)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initMap = () => {
    if (typeof window !== 'undefined' && window.L && !leafletMapRef.current) {
      const mapElement = document.getElementById('vendor-map')
      if (!mapElement) return

      const map = window.L.map('vendor-map', {
        center: vendorLocation,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      })

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      leafletMapRef.current = map

      // Mi ubicación (vendedor)
      const myLocation = window.L.marker(vendorLocation, {
        icon: window.L.divIcon({
          className: 'custom-marker my-location',
          html: '<div style="background: var(--primary); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      }).addTo(map)

      myLocation.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <h4 style="color: var(--primary); margin-bottom: 8px;">${vendedor.nombre}</h4>
          <p style="margin-bottom: 8px; color: #666; font-size: 12px;">${vendedor.descripcion}</p>
          <div style="font-size: 11px; color: #999;">📍 Mi ubicación actual</div>
        </div>
      `)

      // Otros vendedores cercanos
      const otherVendors = [
        [4.615, -74.075, 'María López', 'Frutas y verduras frescas'],
        [4.605, -74.09, 'Carlos Pérez', 'Empanadas y jugos naturales'],
        [4.62, -74.08, 'Ana García', 'Productos artesanales'],
        [4.6, -74.085, 'Luis Torres', 'Dulces típicos'],
        [4.618, -74.072, 'Rosa Martín', 'Ropa y accesorios'],
      ]

      otherVendors.forEach(([lat, lng, name, description]) => {
        const marker = window.L.marker([lat, lng], {
          icon: window.L.divIcon({
            className: 'custom-marker other-vendor',
            html: '<div style="background: var(--secondary); width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        }).addTo(map)

        marker.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <h4 style="color: var(--secondary); margin-bottom: 8px;">${name}</h4>
            <p style="margin-bottom: 10px; color: #666; font-size: 12px;">${description}</p>
            <button 
              onclick="window.createRouteToVendor(${lat}, ${lng}, '${name}')"
              style="background: var(--accent); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
              Ver ruta
            </button>
          </div>
        `)
      })

      // Clientes potenciales (puntos de interés)
      const customerAreas = [
        [4.612, -74.078, 'Zona Comercial', 'Alto tráfico de clientes'],
        [4.608, -74.082, 'Parque Central', 'Familias y niños'],
        [4.616, -74.074, 'Universidad', 'Estudiantes y profesores'],
        [4.604, -74.088, 'Terminal', 'Viajeros y trabajadores'],
      ]

      customerAreas.forEach(([lat, lng, name, description]) => {
        const circle = window.L.circle([lat, lng], {
          color: 'var(--primary)',
          fillColor: 'var(--primary)',
          fillOpacity: 0.2,
          radius: 200,
        }).addTo(map)

        circle.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <h4 style="color: var(--primary); margin-bottom: 8px;">${name}</h4>
            <p style="margin-bottom: 8px; color: #666; font-size: 12px;">${description}</p>
            <div style="font-size: 11px; color: var(--accent); font-weight: bold;">💡 Oportunidad de ventas</div>
            <button 
              onclick="window.createRouteToArea(${lat}, ${lng}, '${name}')"
              style="background: var(--primary); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 8px;">
              Ir a esta zona
            </button>
          </div>
        `)
      })
    }
  }

  // Función para crear ruta a un vendedor
  const createRouteToVendor = (lat, lng, name) => {
    if (leafletMapRef.current && window.L && window.L.Routing) {
      // Remover ruta anterior si existe
      if (routingControlRef.current) {
        leafletMapRef.current.removeControl(routingControlRef.current)
      }

      const routingControl = window.L.Routing.control({
        waypoints: [
          window.L.latLng(vendorLocation[0], vendorLocation[1]),
          window.L.latLng(lat, lng),
        ],
        fitSelectedRoutes: true,
        collapsible: true,
        autoRoute: true,
        waypointMode: 'snap',
        showAlternatives: true,
        altLineOptions: {
          styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: '#085c52', opacity: 0.5, weight: 2 },
          ],
        },
        lineOptions: {
          styles: [{ color: 'var(--accent)', opacity: 0.8, weight: 6 }],
        },
        createMarker: function (i, waypoint, n) {
          let icon
          if (i === 0) {
            icon = window.L.divIcon({
              className: 'custom-user-marker',
              html: `
                <div style="
                  width: 20px;
                  height: 20px;
                  background-color: var(--primary);
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })
          } else {
            icon = window.L.divIcon({
              className: 'custom-vendor-marker',
              html: `
                <div style="
                  width: 30px;
                  height: 30px;
                  background-color: var(--secondary);
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  animation: bounce 1s infinite;
                "></div>
                <style>
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                  }
                </style>
              `,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })
          }

          return window.L.marker(waypoint.latLng, {
            icon: icon,
            draggable: false,
          })
        },
      }).addTo(leafletMapRef.current)

      routingControlRef.current = routingControl
      setIsTracking(true)
      setTrackingDestination(name)

      // Mostrar información de la ruta
      routingControl.on('routesfound', function (e) {
        const routes = e.routes
        const summary = routes[0].summary
        console.log(`Ruta a ${name}:`)
        console.log(
          `Distancia: ${(summary.totalDistance / 1000).toFixed(2)} km`
        )
        console.log(
          `Tiempo estimado: ${Math.round(summary.totalTime / 60)} minutos`
        )
      })
    }
  }

  // Función para crear ruta a un área de clientes
  const createRouteToArea = (lat, lng, name) => {
    createRouteToVendor(lat, lng, name)
  }

  // Función para detener el seguimiento
  const stopTracking = () => {
    if (routingControlRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeControl(routingControlRef.current)
      routingControlRef.current = null
    }
    setIsTracking(false)
    setTrackingDestination(null)
  }

  // Hacer las funciones accesibles globalmente para los popups
  useEffect(() => {
    window.createRouteToVendor = createRouteToVendor
    window.createRouteToArea = createRouteToArea

    return () => {
      delete window.createRouteToVendor
      delete window.createRouteToArea
    }
  }, [])

  // Cargar localidad y conectar chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem('urbanstand_current_user') || 'null'
        )

        if (!currentUser || !currentUser.localidad) {
          setChatError(
            'No se pudo determinar tu localidad. Por favor actualiza tu perfil.'
          )
          return
        }

        const userLocalidad = currentUser.localidad.toLowerCase()
        setLocalidad(userLocalidad)

        socketService.connect('http://localhost:3006')

        socketService.joinRoom(
          userLocalidad,
          currentUser.email || 'vendedor',
          currentUser.firstName || 'Vendedor'
        )

        setIsLoadingMessages(true)
        const response = await fetch(
          `http://localhost:3006/api/messages/${userLocalidad}`
        )
        const historicalMessages = await response.json()
        setMessages(historicalMessages)
        setIsLoadingMessages(false)

        socketService.onMessage((newMessage) => {
          setMessages((prev) => [...prev, newMessage])
        })

        socketService.onError((error) => {
          console.error('Error del chat:', error)
          setChatError(error)
        })
      } catch (error) {
        console.error('Error al inicializar chat:', error)
        setChatError('Error al conectar con el chat')
      }
    }

    initializeChat()

    return () => {
      socketService.disconnect()
    }
  }, [])

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (message.trim() && localidad) {
      const currentUser = JSON.parse(
        localStorage.getItem('urbanstand_current_user') || '{}'
      )

      socketService.sendMessage({
        userId: currentUser.email || 'vendedor',
        userName: currentUser.firstName || 'Vendedor',
        avatar: '👤',
        text: message.trim(),
        localidad: localidad,
        chatRoom: 'general',
      })

      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const getProfileImage = (genero) => {
    const g = (genero || '').toString().toLowerCase()
    if (g.includes('fem')) return '/img/PerfilFemale.png'
    if (g.includes('mas')) return '/img/PerfilMale.png'
    if (g.includes('otr')) return '/img/PerfilOther.png'
    return '/img/PerfilOther.png'
  }

  const vendorProfileImage = getProfileImage(vendedor.genero)

  return (
    <>
      <div
        className="container-fluid"
        style={{ padding: '0 var(--spacing-3xl)' }}
      >
        <Breadcrumbs />
        {/* Hero Section */}
        <section
          className="hero"
          style={{
            paddingBottom: 'var(--spacing-3xl)',
          }}
        >
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                <span className="highlight">Panel de</span>
                <br />
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
        <main
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 'var(--spacing-2xl)',
            marginBottom: 'var(--spacing-3xl)',
          }}
        >
          {/* Map Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--surface)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 2px 10px var(--shadow)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 0.5rem 0',
                  color: 'var(--secondary)',
                  fontSize: '1.25rem',
                }}
              >
                Mapa de Vendedores
              </h3>
              <p
                style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                }}
              >
                Tu ubicación y vendedores cercanos
              </p>
            </div>

            <div
              style={{
                height: '450px',
                backgroundColor: '#f0f0f0',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 2px 12px var(--shadow)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                id="vendor-map"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-xl)',
                }}
              ></div>

              {/* Controles del mapa */}
              {isTracking && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 1000,
                  }}
                >
                  <Navigation size={20} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: '500', color: '#1f2937' }}>
                    Navegando hacia: {trackingDestination}
                  </span>
                  <button
                    onClick={stopTracking}
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Detener
                  </button>
                </div>
              )}
            </div>

            {/* Leyenda del mapa */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 2px 10px var(--shadow)',
              }}
            >
              <h4
                style={{
                  margin: '0 0 0.75rem 0',
                  color: 'var(--secondary)',
                  fontSize: '1rem',
                }}
              >
                Leyenda
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  ></div>
                  <span>Tu ubicación</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'var(--secondary)',
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  ></div>
                  <span>Otros vendedores</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '50%',
                      opacity: '0.3',
                    }}
                  ></div>
                  <span>Zonas con clientes potenciales</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xl)',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--surface)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                boxShadow: '0 2px 10px var(--shadow)',
              }}
            >
              <img
                src={vendorProfileImage}
                alt={`Perfil de ${vendedor.nombre}`}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--spacing-lg)',
                  objectFit: 'cover',
                }}
              />
              <h2
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.3rem',
                }}
              >
                {vendedor.nombre}
              </h2>
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--text-secondary)',
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                }}
              >
                {vendedor.tipoVendedor}
              </h4>
              <p
                style={{
                  margin: '0 0 var(--spacing-xl) 0',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                }}
              >
                {vendedor.descripcion}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 'var(--spacing-lg)',
                }}
              >
                <button
                  style={{
                    background: '#f0f0f0',
                    border: 'none',
                    padding: 'var(--spacing-xs) var(--spacing-md)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Edit3 size={14} />
                  Editar perfil
                </button>
                <button
                  style={{
                    background: '#f0f0f0',
                    border: 'none',
                    padding: 'var(--spacing-xs) var(--spacing-md)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Package size={14} />
                  Mis productos
                </button>
              </div>

              <button
                style={{
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
                  transition: 'var(--transition-fast)',
                }}
              >
                <BarChart3 size={14} />
                Estadísticas
              </button>
            </div>

            {/* Stats Card */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 2px 10px var(--shadow)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--secondary)',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                }}
              >
                Resumen de Hoy
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-lg)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 121, 1, 0.1)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    12
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Ventas
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(8, 92, 82, 0.1)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: 'var(--secondary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    $85K
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Ingresos
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(154, 30, 34, 0.1)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: 'var(--accent)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    8
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Clientes
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 121, 1, 0.1)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    4.8
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Rating
                  </div>
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
          zIndex: 999,
        }}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Box */}
      {isChatOpen && (
        <div
          style={{
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
            zIndex: 1000,
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '12px 15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                Chat - Vendedores
              </div>
              <div
                style={{
                  fontSize: '12px',
                  opacity: '0.9',
                }}
              >
                Localidad:{' '}
                {localidad
                  ? localidad.charAt(0).toUpperCase() + localidad.slice(1)
                  : 'Cargando...'}
              </div>
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
                lineHeight: '1',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {isLoadingMessages ? (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--text-secondary)',
              }}
            >
              Cargando mensajes...
            </div>
          ) : chatError ? (
            <div
              style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}
            >
              {chatError}
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--text-secondary)',
              }}
            >
              No hay mensajes aún. ¡Sé el primero en escribir!
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const currentUser = JSON.parse(
                  localStorage.getItem('urbanstand_current_user') || '{}'
                )
                const isOwn = msg.userId === (currentUser.email || 'vendedor')

                return (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-xl)',
                        backgroundColor: isOwn ? '#DCF8C6' : 'var(--surface)',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      {!isOwn && (
                        <div
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '2px',
                            fontSize: '12px',
                            color: 'var(--primary)',
                          }}
                        >
                          {msg.userName}
                        </div>
                      )}
                      <div>{msg.text}</div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-secondary)',
                          marginTop: '4px',
                          textAlign: 'right',
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}

          {/* Chat Input */}
          <div
            style={{
              display: 'flex',
              padding: '15px',
              backgroundColor: 'var(--surface)',
              borderTop: '1px solid #e0e0e0',
            }}
          >
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
                transition: 'all var(--transition-fast)',
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
                transition: 'all var(--transition-fast)',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          backgroundColor: 'var(--secondary)',
          color: '#fff',
          marginTop: 'var(--spacing-3xl)',
        }}
      >
        <p style={{ margin: 0 }}>
          © 2025 UrbanStand. Todos los derechos reservados.
        </p>
      </footer>
    </>
  )
}

export default VistaVendedor
