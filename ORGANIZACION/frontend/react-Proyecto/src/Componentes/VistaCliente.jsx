import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Eye, Phone, MessageCircle, Star, Navigation, Zap, Clock, ShoppingCart } from 'lucide-react';
import './VistaCliente.css';

export default function VistaCliente ({ onBackToRoles }) {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingVendor, setTrackingVendor] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 4.6097, lng: -74.0817 });
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);

  const vendedores = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      producto: 'Arepas',
      avatar: '🫓',
      ubicacion: { lat: 4.6118, lng: -74.0835 },
      rating: 4.8,
      distancia: '250m',
      tiempoEstimado: '3 min',
      activo: true,
      productos: ['Arepas de queso', 'Arepas mixtas', 'Buñuelos'],
      precio: '$3.000 - $8.000',
      telefono: '+57 300 123 4567'
    },
    {
      id: 2,
      nombre: 'Laura Gómez',
      producto: 'Limonada',
      avatar: '🍋',
      ubicacion: { lat: 4.6089, lng: -74.0798 },
      rating: 4.9,
      distancia: '180m',
      tiempoEstimado: '2 min',
      activo: true,
      productos: ['Limonada natural', 'Limonada cerezada', 'Jugos naturales'],
      precio: '$2.000 - $5.000',
      telefono: '+57 301 987 6543'
    },
    {
      id: 3,
      nombre: 'Lauran Súb',
      producto: 'Empanadas',
      avatar: '🥟',
      ubicacion: { lat: 4.6125, lng: -74.0801 },
      rating: 4.7,
      distancia: '320m',
      tiempoEstimado: '4 min',
      activo: true,
      productos: ['Empanadas de carne', 'Empanadas de pollo', 'Empanadas vegetarianas'],
      precio: '$1.500 - $3.000',
      telefono: '+57 302 456 7890'
    },
    {
      id: 4,
      nombre: 'Marcoa Oruna',
      producto: 'Frutas',
      avatar: '🍎',
      ubicacion: { lat: 4.6101, lng: -74.0789 },
      rating: 4.6,
      distancia: '420m',
      tiempoEstimado: '5 min',
      activo: false,
      productos: ['Frutas frescas', 'Ensaladas de frutas', 'Jugos'],
      precio: '$1.000 - $4.000',
      telefono: '+57 303 789 1234'
    }
  ];

  {/*Buscador*/}

  const filteredVendedores = vendedores.filter(v => 
    v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startTracking = (vendor) => {
    setTrackingVendor(vendor);
    setIsTracking(true);
    setSelectedVendor(vendor);
  };

  const stopTracking = () => {
    setTrackingVendor(null);
    setIsTracking(false);
  };

  useEffect(() => {
    let interval;
    if (isTracking && trackingVendor) {
      interval = setInterval(() => {
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isTracking, trackingVendor]);

  // Inicializar Leaflet
  useEffect(() => {
    const loadLeaflet = () => {
      // Cargar CSS de Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Cargar JS de Leaflet
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.L) return;

      // Inicializar mapa con opciones personalizadas
      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        tap: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      }).setView([userLocation.lat, userLocation.lng], 15);

      // Agregar capa de OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Deshabilitar propagación de eventos en el contenedor del mapa
      const container = map.getContainer();
      container.style.cursor = 'default';
      container.style.pointerEvents = 'auto';
      
      // Prevenir eventos de clic en el contenedor del mapa
      window.L.DomEvent.disableClickPropagation(container);
      window.L.DomEvent.disableScrollPropagation(container);

      leafletMapRef.current = map;

      // Marcador del usuario (punto azul)
      const userIcon = window.L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('Tu ubicación');

      // Círculo alrededor del usuario
      window.L.circle([userLocation.lat, userLocation.lng], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        radius: 50
      }).addTo(map);

      updateVendorMarkers(map);
    };

    if (window.L) {
      initMap();
    } else {
      loadLeaflet();
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []); // Solo ejecutar una vez al montar

  // Actualizar marcadores cuando cambian los filtros o el tracking
  useEffect(() => {
    if (leafletMapRef.current && window.L) {
      updateVendorMarkers(leafletMapRef.current);
    }
  }, [searchTerm, trackingVendor]);

  const updateVendorMarkers = (map) => {
    // Limpiar marcadores y círculos anteriores
    markersRef.current.forEach(marker => map.removeLayer(marker));
    circlesRef.current.forEach(circle => map.removeLayer(circle));
    markersRef.current = [];
    circlesRef.current = [];

    filteredVendedores.forEach((vendor) => {
      // Crear icono personalizado con emoji
      const vendorIcon = window.L.divIcon({
        className: 'custom-vendor-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 40px;
              height: 40px;
              background-color: ${vendor.activo ? '#10b981' : '#6b7280'};
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ${trackingVendor?.id === vendor.id ? 'animation: bounce 1s infinite;' : ''}
            ">
              ${vendor.avatar}
            </div>
            ${vendor.activo ? `
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                background-color: #10b981;
                border: 2px solid white;
                border-radius: 50%;
              "></div>
            ` : ''}
          </div>
          <style>
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          </style>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = window.L.marker([vendor.ubicacion.lat, vendor.ubicacion.lng], { 
        icon: vendorIcon,
        riseOnHover: true
      });

      marker
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 150px;">
            <strong style="font-size: 14px;">${vendor.nombre}</strong><br/>
            <span style="color: #6b7280;">${vendor.producto}</span><br/>
            <span style="color: #10b981; font-weight: 500;">${vendor.precio}</span>
          </div>
        `);

      // Manejador de eventos personalizado para el marcador
      marker.on('click', (e) => {
        const event = e.originalEvent || e;
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        
        // Actualizar el vendedor seleccionado
        setSelectedVendor(prevVendor => 
          prevVendor?.id === vendor.id ? null : vendor
        );
        
        // Abrir el popup si no está abierto
        if (!marker.isPopupOpen()) {
          marker.openPopup();
        }
      });
      
      // Prevenir cierre del popup al hacer clic en él
      marker.on('popupopen', () => {
        const popup = marker.getPopup();
        if (popup) {
          const popupElement = popup.getElement();
          if (popupElement) {
            popupElement.style.pointerEvents = 'auto';
            popupElement.addEventListener('click', (e) => {
              e.stopPropagation();
            });
          }
        }
      });

      markersRef.current.push(marker);

      // Círculo de radar si está siendo rastreado
      if (trackingVendor?.id === vendor.id) {
        const circle = window.L.circle([vendor.ubicacion.lat, vendor.ubicacion.lng], {
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.1,
          radius: 100
        }).addTo(map);
        circlesRef.current.push(circle);

        // Centrar mapa en el vendedor rastreado
        map.setView([vendor.ubicacion.lat, vendor.ubicacion.lng], 16);
      }
    });
  };

  const MapComponent = React.memo(({ onMarkerClick, trackingVendor, userLocation, filteredVendedores }) => {
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersRef = useRef([]);
    const circlesRef = useRef([]);

    useEffect(() => {
      if (!mapRef.current || !window.L) return;

      // Inicializar mapa
      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        tap: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      }).setView([userLocation.lat, userLocation.lng], 15);

      // Agregar capa de OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Configuración de eventos del mapa
      const container = map.getContainer();
      container.style.cursor = 'default';
      container.style.pointerEvents = 'auto';
      
      window.L.DomEvent.disableClickPropagation(container);
      window.L.DomEvent.disableScrollPropagation(container);

      leafletMapRef.current = map;

      // Función para actualizar marcadores
      const updateMarkers = () => {
        // Limpiar marcadores y círculos anteriores
        markersRef.current.forEach(marker => map.removeLayer(marker));
        circlesRef.current.forEach(circle => map.removeLayer(circle));
        markersRef.current = [];
        circlesRef.current = [];

        filteredVendedores.forEach((vendor) => {
          const vendorIcon = window.L.divIcon({
            className: 'custom-vendor-marker',
            html: `
              <div style="position: relative;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background-color: ${vendor.activo ? '#10b981' : '#6b7280'};
                  border: 3px solid white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  ${trackingVendor?.id === vendor.id ? 'animation: bounce 1s infinite;' : ''}
                ">
                  ${vendor.avatar}
                </div>
                ${vendor.activo ? `
                  <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background-color: #10b981;
                    border: 2px solid white;
                    border-radius: 50%;
                  "></div>
                ` : ''}
              </div>
              <style>
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
              </style>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
          });

          const marker = window.L.marker([vendor.ubicacion.lat, vendor.ubicacion.lng], { 
            icon: vendorIcon,
            riseOnHover: true
          });

          marker
            .addTo(map)
            .bindPopup(`
              <div style="font-family: system-ui, sans-serif; min-width: 150px;">
                <strong style="font-size: 14px;">${vendor.nombre}</strong><br/>
                <span style="color: #6b7280;">${vendor.producto}</span><br/>
                <span style="color: #10b981; font-weight: 500;">${vendor.precio}</span>
              </div>
            `);

          // Manejador de eventos del marcador
          marker.on('click', (e) => {
            if (e.originalEvent) {
              e.originalEvent.stopPropagation();
              e.originalEvent.preventDefault();
            }
            onMarkerClick(vendor);
          });

          markersRef.current.push(marker);

          // Círculo de radar si está siendo rastreado
          if (trackingVendor?.id === vendor.id) {
            const circle = window.L.circle([vendor.ubicacion.lat, vendor.ubicacion.lng], {
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.1,
              radius: 100
            }).addTo(map);
            circlesRef.current.push(circle);
            map.setView([vendor.ubicacion.lat, vendor.ubicacion.lng], 16);
          }
        });
      };

      // Inicializar marcadores
      updateMarkers();

      // Limpieza al desmontar
      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
      };
    }, [filteredVendedores, trackingVendor, userLocation, onMarkerClick]);

    return (
      <div 
        ref={mapRef} 
        className="vista-cliente-map" 
        style={{ width: '100%', height: '100%' }}
      />
    );
  });

  // Manejador de clic en marcador
  const handleMarkerClick = (vendor) => {
    setSelectedVendor(prevVendor => 
      prevVendor?.id === vendor.id ? null : vendor
    );
  };

  return (
    <div className="vista-cliente-container">

      <div className="vista-cliente-main">
        <div className="vista-cliente-grid">
          
          {/* Mapa */}
          <div className="vista-cliente-map-container">
            <MapComponent 
              onMarkerClick={handleMarkerClick}
              trackingVendor={trackingVendor}
              userLocation={userLocation}
              filteredVendedores={filteredVendedores}
            />
            
            {/* Controles del mapa */}
            {isTracking && (
              <div className="vista-cliente-tracking-control">
                <Zap size={20} style={{ color: '#10b981' }} />
                <span className="vista-cliente-tracking-text">
                  Rastreando a {trackingVendor?.nombre}
                </span>
                <button onClick={stopTracking} className="vista-cliente-stop-button">
                  Detener
                </button>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="vista-cliente-panel">
            
            {/* Header del panel */}
            <div className="vista-cliente-panel-header">
              <h2 className="vista-cliente-panel-title">Lista de vendedores</h2>
              
              {/* Buscador */}
              <div className="vista-cliente-search-container">
                <Search size={20} className="vista-cliente-search-icon" />
                <input
                  type="text"
                  placeholder="Busca por producto o nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="vista-cliente-search-input"
                />
              </div>
            </div>

            {/* Lista de vendedores */}
            <div className="vista-cliente-vendors-list">
              {filteredVendedores.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVendor(prevVendor => 
                      prevVendor?.id === vendor.id ? null : vendor
                    );
                  }}
                  className={`vista-cliente-vendor-card ${
                    selectedVendor?.id === vendor.id ? 'selected' : ''
                  }`}
                >
                  <div className="vista-cliente-vendor-info">
                    {/* Avatar */}
                    <div className="vista-cliente-vendor-avatar">
                      {vendor.avatar}
                      {vendor.activo && <div className="vista-cliente-vendor-status" />}
                    </div>

                    {/* Información */}
                    <div className="vista-cliente-vendor-details">
                      <div className="vista-cliente-vendor-header">
                        <h3 className="vista-cliente-vendor-name">{vendor.nombre}</h3>
                        {vendor.activo && (
                          <span className="vista-cliente-vendor-online">EN LÍNEA</span>
                        )}
                      </div>
                      
                      <p className="vista-cliente-vendor-product">{vendor.producto}</p>
                      
                      {/* Rating y distancia */}
                      <div className="vista-cliente-vendor-stats">
                        <div className="vista-cliente-vendor-stat">
                          <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span className="vista-cliente-vendor-rating">{vendor.rating}</span>
                        </div>
                        <div className="vista-cliente-vendor-stat">
                          <Navigation size={14} style={{ color: '#6b7280' }} />
                          <span className="vista-cliente-vendor-distance">{vendor.distancia}</span>
                        </div>
                        <div className="vista-cliente-vendor-stat">
                          <Clock size={14} style={{ color: '#6b7280' }} />
                          <span className="vista-cliente-vendor-time">{vendor.tiempoEstimado}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {selectedVendor?.id === vendor.id && (
                    <div className="vista-cliente-vendor-actions">
                      {/* Productos */}
                      <div className="vista-cliente-products-section">
                        <h4 className="vista-cliente-products-title">
                          Productos disponibles:
                        </h4>
                        <div className="vista-cliente-products-list">
                          {vendor.productos.join(' • ')}
                        </div>
                        <div className="vista-cliente-products-price">
                          {vendor.precio}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="vista-cliente-action-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startTracking(vendor);
                          }}
                          disabled={!vendor.activo}
                          className={`vista-cliente-action-button ${
                            vendor.activo ? 'track' : 'track-disabled'
                          }`}
                        >
                          <Zap size={14} />
                          {trackingVendor?.id === vendor.id ? 'Rastreando...' : 'Rastrear'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};