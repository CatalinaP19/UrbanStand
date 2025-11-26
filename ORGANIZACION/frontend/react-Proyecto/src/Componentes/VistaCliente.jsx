import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Eye, Phone, MessageCircle, Star, Navigation, Zap, Clock, ShoppingCart } from 'lucide-react';

export default function VistaCliente ({ alVolverARoles }) {
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [estaRastreando, setEstaRastreando] = useState(false);
  const [vendedorRastreado, setVendedorRastreado] = useState(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState({ lat: 4.6097, lng: -74.0817 });
  const [calificacionesVendedor, setCalificacionesVendedor] = useState({});
  const [calificacionHover, setCalificacionHover] = useState({});
  const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);
  const refMapa = useRef(null);
  const refMapaLeaflet = useRef(null);
  const refMarcadores = useRef([]);
  const refCirculos = useRef([]);
  const refControlRuta = useRef(null);

  useEffect(() => {
    const manejarRedimension = () => setAnchoVentana(window.innerWidth);
    window.addEventListener('resize', manejarRedimension);
    return () => window.removeEventListener('resize', manejarRedimension);
  }, []);

  const esPantallaPequena = anchoVentana <= 768;
  const esPantallaMovil = anchoVentana <= 480;

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

  const vendedoresFiltrados = vendedores.filter(v => 
    v.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    v.producto.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const manejarCalificacion = (idVendedor, calificacion) => {
    setCalificacionesVendedor(previo => ({
      ...previo,
      [idVendedor]: calificacion
    }));
  };

  const iniciarRastreo = (vendedor) => {
    setVendedorRastreado(vendedor);
    setEstaRastreando(true);
    setVendedorSeleccionado(vendedor);
    
    if (refMapaLeaflet.current && window.L && window.L.Routing) {
      if (refControlRuta.current) {
        refMapaLeaflet.current.removeControl(refControlRuta.current);
      }

      const controlRuta = window.L.Routing.control({
        waypoints: [
          window.L.latLng(ubicacionUsuario.lat, ubicacionUsuario.lng),
          window.L.latLng(vendedor.ubicacion.lat, vendedor.ubicacion.lng)
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
          let icono;
          if (i === 0) {
            icono = window.L.divIcon({
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
            icono = window.L.divIcon({
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
                    ${vendedor.avatar}
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
          
          const marcador = window.L.marker(waypoint.latLng, {
            icon: icono,
            draggable: false
          });
          
          if (i === n - 1) {
            marcador.bindPopup(`
              <div style="font-family: system-ui, sans-serif; min-width: 150px;">
                <strong style="font-size: 14px;">${vendedor.nombre}</strong><br/>
                <span style="color: #6b7280;">${vendedor.producto}</span><br/>
                <span style="color: #10b981; font-weight: 500;">${vendedor.precio}</span>
              </div>
            `);
          }
          
          return marcador;
        }
      }).addTo(refMapaLeaflet.current);

      refControlRuta.current = controlRuta;

      controlRuta.on('routesfound', function(e) {
        const rutas = e.routes;
        const resumen = rutas[0].summary;
        console.log(`Distancia: ${(resumen.totalDistance / 1000).toFixed(2)} km`);
        console.log(`Tiempo estimado: ${Math.round(resumen.totalTime / 60)} minutos`);
      });
    }
  };

  const detenerRastreo = () => {
    setVendedorRastreado(null);
    setEstaRastreando(false);
    
    if (refControlRuta.current && refMapaLeaflet.current) {
      refMapaLeaflet.current.removeControl(refControlRuta.current);
      refControlRuta.current = null;
    }
    
    if (refMapaLeaflet.current && window.L) {
      actualizarMarcadoresVendedor(refMapaLeaflet.current);
    }
  };

  useEffect(() => {
    const cargarLeaflet = () => {
      const linkLeaflet = document.createElement('link');
      linkLeaflet.rel = 'stylesheet';
      linkLeaflet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkLeaflet);

      const linkRutas = document.createElement('link');
      linkRutas.rel = 'stylesheet';
      linkRutas.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
      document.head.appendChild(linkRutas);

      const scriptLeaflet = document.createElement('script');
      scriptLeaflet.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      scriptLeaflet.async = true;
      scriptLeaflet.onload = () => {
        const scriptRutas = document.createElement('script');
        scriptRutas.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
        scriptRutas.async = true;
        scriptRutas.onload = inicializarMapa;
        document.head.appendChild(scriptRutas);
      };
      document.head.appendChild(scriptLeaflet);
    };

    const inicializarMapa = () => {
      if (!refMapa.current || !window.L) return;

      const mapa = window.L.map(refMapa.current, {
        zoomControl: true,
        tap: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true
      }).setView([ubicacionUsuario.lat, ubicacionUsuario.lng], 15);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapa);

      const contenedor = mapa.getContainer();
      contenedor.style.cursor = 'default';
      contenedor.style.pointerEvents = 'auto';
      
      window.L.DomEvent.disableClickPropagation(contenedor);
      window.L.DomEvent.disableScrollPropagation(contenedor);

      refMapaLeaflet.current = mapa;

      const iconoUsuario = window.L.divIcon({
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

      window.L.marker([ubicacionUsuario.lat, ubicacionUsuario.lng], { icon: iconoUsuario })
        .addTo(mapa)
        .bindPopup('Tu ubicación');

      window.L.circle([ubicacionUsuario.lat, ubicacionUsuario.lng], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        radius: 50
      }).addTo(mapa);

      actualizarMarcadoresVendedor(mapa);
    };

    if (window.L && window.L.Routing) {
      inicializarMapa();
    } else {
      cargarLeaflet();
    }

    return () => {
      if (refControlRuta.current && refMapaLeaflet.current) {
        refMapaLeaflet.current.removeControl(refControlRuta.current);
      }
      if (refMapaLeaflet.current) {
        refMapaLeaflet.current.remove();
        refMapaLeaflet.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refMapaLeaflet.current && window.L && !estaRastreando) {
      actualizarMarcadoresVendedor(refMapaLeaflet.current);
    }
  }, [terminoBusqueda]);

  const actualizarMarcadoresVendedor = (mapa) => {
    refMarcadores.current.forEach(marcador => mapa.removeLayer(marcador));
    refCirculos.current.forEach(circulo => mapa.removeLayer(circulo));
    refMarcadores.current = [];
    refCirculos.current = [];

    vendedoresFiltrados.forEach((vendedor) => {
      const iconoVendedor = window.L.divIcon({
        className: 'custom-vendor-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 40px;
              height: 40px;
              background-color: ${vendedor.activo ? '#10b981' : '#6b7280'};
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${vendedor.avatar}
            </div>
            ${vendedor.activo ? `
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

      const marcador = window.L.marker([vendedor.ubicacion.lat, vendedor.ubicacion.lng], { 
        icon: iconoVendedor,
        riseOnHover: true
      });

      marcador
        .addTo(mapa)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 150px;">
            <strong style="font-size: 14px;">${vendedor.nombre}</strong><br/>
            <span style="color: #6b7280;">${vendedor.producto}</span><br/>
            <span style="color: #10b981; font-weight: 500;">${vendedor.precio}</span>
          </div>
        `);

      marcador.on('click', (e) => {
        const evento = e.originalEvent || e;
        if (evento) {
          evento.stopPropagation();
          evento.preventDefault();
        }
        
        setVendedorSeleccionado(vendedorPrevio => 
          vendedorPrevio?.id === vendedor.id ? null : vendedor
        );
        
        if (!marcador.isPopupOpen()) {
          marcador.openPopup();
        }
      });
      
      marcador.on('popupopen', () => {
        const popup = marcador.getPopup();
        if (popup) {
          const elementoPopup = popup.getElement();
          if (elementoPopup) {
            elementoPopup.style.pointerEvents = 'auto';
            elementoPopup.addEventListener('click', (e) => {
              e.stopPropagation();
            });
          }
        }
      });

      refMarcadores.current.push(marcador);
    });
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f3f4f6',
      padding: esPantallaMovil ? '3px' : esPantallaPequena ? '7px' : '15px',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: esPantallaPequena ? '1fr' : '1fr 400px', 
          width: '100%', 
          height: esPantallaPequena ? 'auto' : '100%', 
          gap: esPantallaMovil ? '3px' : esPantallaPequena ? '7px' : '0' 
        }}>
          
          <div style={{ 
            position: 'relative', 
            height: esPantallaPequena ? (esPantallaMovil ? '45vh' : '50vh') : '100%',
            minHeight: esPantallaMovil ? '350px' : esPantallaPequena ? '400px' : '400px',
            order: esPantallaPequena ? 2 : 0
          }}>
            <div 
              ref={refMapa} 
              style={{ 
                width: '100%', 
                height: '100%',
                borderRadius: esPantallaPequena ? '12px' : '0'
              }}
            />
            
            {estaRastreando && (
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
                  Rastreando ruta de {vendedorRastreado?.nombre} vendedor de {vendedorRastreado?.producto}
                </span>
                <button 
                  onClick={detenerRastreo}
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

          <div style={{
            background: 'white',
            borderLeft: esPantallaPequena ? 'none' : '1px solid #e5e7eb',
            borderRadius: esPantallaPequena ? '12px' : '0',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            minHeight: '400px',
            order: esPantallaPequena ? 1 : 0
          }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                Lista de vendedores
              </h2>
              
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
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
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

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {vendedoresFiltrados.map((vendedor) => (
                <div
                  key={vendedor.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setVendedorSeleccionado(vendedorPrevio => 
                      vendedorPrevio?.id === vendedor.id ? null : vendedor
                    );
                  }}
                  style={{
                    background: vendedorSeleccionado?.id === vendedor.id ? '#f0fdf4' : 'white',
                    border: `2px solid ${vendedorSeleccionado?.id === vendedor.id ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: vendedor.activo ? '#10b981' : '#6b7280',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {vendedor.avatar}
                      </div>
                      {vendedor.activo && (
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

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {vendedor.nombre}
                        </h3>
                        {vendedor.activo && (
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
                        {vendedor.producto}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ color: '#1f2937', fontWeight: '500' }}>{vendedor.rating}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Navigation size={14} style={{ color: '#6b7280' }} />
                          <span style={{ color: '#6b7280' }}>{vendedor.distancia}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} style={{ color: '#6b7280' }} />
                          <span style={{ color: '#6b7280' }}>{vendedor.tiempoEstimado}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {vendedorSeleccionado?.id === vendedor.id && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
                          Productos disponibles:
                        </h4>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                          {vendedor.productos.join(' • ')}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                          {vendedor.precio}
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                          Califica este vendedor:
                        </h4>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          {[1, 2, 3, 4, 5].map((estrella) => (
                            <Star
                              key={estrella}
                              size={24}
                              style={{
                                color: '#fbbf24',
                                fill: (calificacionHover[vendedor.id] || calificacionesVendedor[vendedor.id] || 0) >= estrella ? '#fbbf24' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={() => setCalificacionHover(previo => ({ ...previo, [vendedor.id]: estrella }))}
                              onMouseLeave={() => setCalificacionHover(previo => ({ ...previo, [vendedor.id]: 0 }))}
                              onClick={(e) => {
                                e.stopPropagation();
                                manejarCalificacion(vendedor.id, estrella);
                              }}
                            />
                          ))}
                          {calificacionesVendedor[vendedor.id] && (
                            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                              {calificacionesVendedor[vendedor.id]}.0
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          iniciarRastreo(vendedor);
                        }}
                        disabled={!vendedor.activo}
                        style={{
                          width: '100%',
                          background: vendedor.activo ? '#10b981' : '#d1d5db',
                          color: 'white',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '8px',
                          cursor: vendedor.activo ? 'pointer' : 'not-allowed',
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
                        {vendedorRastreado?.id === vendedor.id ? 'Rastreando...' : 'Rastrear'}
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