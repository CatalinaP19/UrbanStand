import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Eye, Phone, MessageCircle, Star, Navigation, Zap, Clock, ShoppingCart } from 'lucide-react';

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
  const routingControlRef = useRef(null);

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

  const filteredVendedores = vendedores.filter(v => 
    v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startTracking = (vendor) => {
    setTrackingVendor(vendor);
    setIsTracking(true);
    setSelectedVendor(vendor);
    
    // Crear la ruta con leaflet-routing-machine
    if (leafletMapRef.current && window.L && window.L.Routing) {
      // Remover ruta anterior si existe
      if (routingControlRef.current) {
        leafletMapRef.current.removeControl(routingControlRef.current);
      }

      // Crear nueva ruta
      const routingControl = window.L.Routing.control({
        waypoints: [
          window.L.latLng(userLocation.lat, userLocation.lng),
          window.L.latLng(vendor.ubicacion.lat, vendor.ubicacion.lng)
        ],
        fitSelectedRoutes: true,
        collapsible: true,
        autoRoute: true,
        waypointMode: 'snap',
        showAlternatives: true,
        altLineOptions: {
          styles: [
            {color: 'black', opacity: 0.15, weight: 9},
            {color: 'white', opacity: 0.8, weight: 6},
            {color: '#10b981', opacity: 0.5, weight: 2}
          ]
        },
        lineOptions: {
          styles: [{color: '#3b82f6', opacity: 0.8, weight: 6}]
        },
        createMarker: function(i, waypoint, n) {
          let icon;
          if (i === 0) {
            // Marcador de inicio (usuario)
            icon = window.L.divIcon({
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
          } else {
            // Marcador de destino (vendedor)
            icon = window.L.divIcon({
              className: 'custom-vendor-marker',
              html: `
                <div style="position: relative;">
                  <div style="
                    width: 40px;
                    height: 40px;
                    background-color: #10b981;
                    border: 3px solid white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    animation: bounce 1s infinite;
                  ">
                    ${vendor.avatar}
                  </div>
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
                </div>
                <style>
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                  }
                </style>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 40]
            });
          }
          
          const marker = window.L.marker(waypoint.latLng, {
            icon: icon,
            draggable: false
          });
          
          if (i === n - 1) {
            marker.bindPopup(`
              <div style="font-family: system-ui, sans-serif; min-width: 150px;">
                <strong style="font-size: 14px;">${vendor.nombre}</strong><br/>
                <span style="color: #6b7280;">${vendor.producto}</span><br/>
                <span style="color: #10b981; font-weight: 500;">${vendor.precio}</span>
              </div>
            `);
          }
          
          return marker;
        }
      }).addTo(leafletMapRef.current);

      routingControlRef.current = routingControl;

      // Ajustar vista para mostrar toda la ruta
      routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        console.log(`Distancia: ${(summary.totalDistance / 1000).toFixed(2)} km`);
        console.log(`Tiempo estimado: ${Math.round(summary.totalTime / 60)} minutos`);
      });
    }
  };

  const stopTracking = () => {
    setTrackingVendor(null);
    setIsTracking(false);
    
    // Remover la ruta del mapa
    if (routingControlRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    
    // Restaurar marcadores normales
    if (leafletMapRef.current && window.L) {
      updateVendorMarkers(leafletMapRef.current);
    }
  };

  // Inicializar Leaflet
  useEffect(() => {
    const loadLeaflet = () => {
      // Cargar CSS de Leaflet
      const linkLeaflet = document.createElement('link');
      linkLeaflet.rel = 'stylesheet';
      linkLeaflet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkLeaflet);

      // Cargar CSS de Leaflet Routing Machine
      const linkRouting = document.createElement('link');
      linkRouting.rel = 'stylesheet';
      linkRouting.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
      document.head.appendChild(linkRouting);

      // Cargar JS de Leaflet
      const scriptLeaflet = document.createElement('script');
      scriptLeaflet.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      scriptLeaflet.async = true;
      scriptLeaflet.onload = () => {
        // Cargar JS de Leaflet Routing Machine después de Leaflet
        const scriptRouting = document.createElement('script');
        scriptRouting.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
        scriptRouting.async = true;
        scriptRouting.onload = initMap;
        document.head.appendChild(scriptRouting);
      };
      document.head.appendChild(scriptLeaflet);
    };

    const initMap = () => {
      if (!mapRef.current || !window.L) return;

      // Inicializar mapa con opciones personalizadas
      const map = window.L.map(mapRef.current, {
        zoomControl: true,
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

    if (window.L && window.L.Routing) {
      initMap();
    } else {
      loadLeaflet();
    }

    return () => {
      if (routingControlRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeControl(routingControlRef.current);
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian los filtros
  useEffect(() => {
    if (leafletMapRef.current && window.L && !isTracking) {
      updateVendorMarkers(leafletMapRef.current);
    }
  }, [searchTerm]);

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

      marker.on('click', (e) => {
        const event = e.originalEvent || e;
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        
        setSelectedVendor(prevVendor => 
          prevVendor?.id === vendor.id ? null : vendor
        );
        
        if (!marker.isPopupOpen()) {
          marker.openPopup();
        }
      });
      
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
    });
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f3f4f6'
    }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', width: '100%', height: '100%', gap: '0' }}>
          
          {/* Mapa */}
          <div style={{ position: 'relative', height: '100%' }}>
            <div 
              ref={mapRef} 
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Controles del mapa */}
            {isTracking && (
              <div style={{
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
                zIndex: 1000
              }}>
                <Zap size={20} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  Rastreando ruta de {trackingVendor?.nombre} vendedor de {trackingVendor?.producto}
                </span>
                <button 
                  onClick={stopTracking}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Finalizar seguimiento
                </button>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div style={{
            background: 'white',
            borderLeft: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}>
            
            {/* Header del panel */}
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                Lista de vendedores
              </h2>
              
              {/* Buscador */}
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Busca por producto o nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
            </div>

            {/* Lista de vendedores */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {filteredVendedores.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVendor(prevVendor => 
                      prevVendor?.id === vendor.id ? null : vendor
                    );
                  }}
                  style={{
                    background: selectedVendor?.id === vendor.id ? '#f0fdf4' : 'white',
                    border: `2px solid ${selectedVendor?.id === vendor.id ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: vendor.activo ? '#10b981' : '#6b7280',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {vendor.avatar}
                      </div>
                      {vendor.activo && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '14px',
                          height: '14px',
                          background: '#10b981',
                          border: '2px solid white',
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>

                    {/* Información */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {vendor.nombre}
                        </h3>
                        {vendor.activo && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#10b981',
                            background: '#d1fae5',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            EN LÍNEA
                          </span>
                        )}
                      </div>
                      
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {vendor.producto}
                      </p>
                      
                      {/* Rating y distancia */}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ color: '#1f2937', fontWeight: '500' }}>{vendor.rating}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Navigation size={14} style={{ color: '#6b7280' }} />
                          <span style={{ color: '#6b7280' }}>{vendor.distancia}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} style={{ color: '#6b7280' }} />
                          <span style={{ color: '#6b7280' }}>{vendor.tiempoEstimado}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {selectedVendor?.id === vendor.id && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      {/* Productos */}
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
                          Productos disponibles:
                        </h4>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                          {vendor.productos.join(' • ')}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                          {vendor.precio}
                        </div>
                      </div>

                      {/* Botón de rastrear */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startTracking(vendor);
                        }}
                        disabled={!vendor.activo}
                        style={{
                          width: '100%',
                          background: vendor.activo ? '#10b981' : '#d1d5db',
                          color: 'white',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '8px',
                          cursor: vendor.activo ? 'pointer' : 'not-allowed',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'background 0.2s'
                        }}
                      >
                        <Zap size={14} />
                        {trackingVendor?.id === vendor.id ? 'Rastreando...' : 'Rastrear'}
                      </button>
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
}