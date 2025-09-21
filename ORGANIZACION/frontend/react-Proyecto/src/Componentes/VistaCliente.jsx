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
  };

  const stopTracking = () => {
    setTrackingVendor(null);
    setIsTracking(false);
  };

  useEffect(() => {
    let interval;
    if (isTracking && trackingVendor) {
      interval = setInterval(() => {
        // Simular movimiento del vendedor
        setTrackingVendor(prev => ({
          ...prev,
          ubicacion: {
            lat: prev.ubicacion.lat + (Math.random() - 0.5) * 0.0001,
            lng: prev.ubicacion.lng + (Math.random() - 0.5) * 0.0001
          }
        }));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isTracking, trackingVendor]);

  const MapComponent = () => (
    <div ref={mapRef} className="vista-cliente-map">
      {/* Efectos de fondo animados */}
      <div className="vista-cliente-map-bg" />
      
      {/* Ondas de radar cuando está rastreando */}
      {isTracking && (
        <div className="vista-cliente-radar-container">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`vista-cliente-radar-ring vista-cliente-radar-ring-${i}`}
            />
          ))}
        </div>
      )}

      {/* Vendedores en el mapa */}
      {filteredVendedores.map((vendor, index) => {
        const isSelected = selectedVendor?.id === vendor.id;
        const isBeingTracked = trackingVendor?.id === vendor.id;
        
        return (
          <div
            key={vendor.id}
            onClick={() => setSelectedVendor(vendor)}
            className={`vista-cliente-vendor-pin ${isSelected ? 'selected' : ''} ${isBeingTracked ? 'tracking' : ''}`}
            style={{
              top: `${20 + index * 15}%`,
              left: `${30 + index * 12}%`
            }}
          >
            {/* Aura del vendedor */}
            <div className={`vista-cliente-vendor-aura ${vendor.activo ? 'active' : 'inactive'}`} />
            
            {/* Pin del vendedor */}
            <div className={`vista-cliente-pin ${vendor.activo ? 'active' : 'inactive'}`}>
              <span className="vista-cliente-pin-emoji">{vendor.avatar}</span>
            </div>

            {/* Indicador de estado */}
            {vendor.activo && <div className="vista-cliente-status-indicator" />}
          </div>
        );
      })}

      {/* Ubicación del usuario */}
      <div className="vista-cliente-user-location">
        <div className="vista-cliente-user-pin" />
        <div className="vista-cliente-user-ring" />
      </div>
    </div>
  );

  return (
    <div className="vista-cliente-container">
      {/* Header */}
      <div className="vista-cliente-header">
        <div className="vista-cliente-header-content">
         <div className="vista-cliente-header-flex">
            
          {/* Botón de regreso */}
          <button
            onClick={onBackToRoles}
            className="back-button"
          >
            ← Volver a selección de roles
          </button>

            <h1 className="vista-cliente-title">Vendedores Bogotá</h1>
            <div className="vista-cliente-nav-buttons">
              <button className="vista-cliente-nav-button-active">Mapa</button>
              <button className="vista-cliente-nav-button">Vendedores</button>
            </div>
          </div>
        </div>
      </div>

      <div className="vista-cliente-main">
        <div className="vista-cliente-grid">
          
          {/* Mapa */}
          <div className="vista-cliente-map-container">
            <MapComponent />
            
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
                  placeholder="Buscar por producto..."
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
                  onClick={() => setSelectedVendor(vendor)}
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

                        <button className="vista-cliente-action-button call">
                          <Phone size={14} />
                          Llamar
                        </button>

                        <button className="vista-cliente-action-button whatsapp">
                          <MessageCircle size={14} />
                          WhatsApp
                        </button>

                        <button className="vista-cliente-action-button order">
                          <ShoppingCart size={14} />
                          Pedir
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
