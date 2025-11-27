import React, { useState, useEffect } from 'react';
import { Bell, ShoppingCart, MapPin, Star, Clock, X } from 'lucide-react';

export default function SimuladorNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [animandoSalida, setAnimandoSalida] = useState([]);

  const notificacionesData = [
    {
      id: 1,
      avatar: '🫓',
      titulo: 'Juan Pérez',
      subtitulo: 'Vendedor de Arepas',
      mensaje: '¡Arepas recién hechas! Estoy cerca de tu ubicación 🔥',
      tiempo: 'ahora',
      icono: ShoppingCart,
      color: '#10b981'
    },
    {
      id: 2,
      avatar: '🍋',
      titulo: 'Laura Gómez',
      subtitulo: 'Vendedor de Limonada',
      mensaje: 'Limonada natural fresquita, perfecta para este calor ☀️',
      tiempo: '2 min',
      icono: MapPin,
      color: '#3b82f6'
    },
    {
      id: 3,
      avatar: '🥟',
      titulo: 'Nueva calificación',
      subtitulo: 'Lauran Súb',
      mensaje: 'Te ha enviado un agradecimiento por tu calificación de 5 estrellas ⭐',
      tiempo: '5 min',
      icono: Star,
      color: '#fbbf24'
    },
    {
      id: 4,
      avatar: '📍',
      titulo: 'Vendedor cercano',
      subtitulo: 'A 180m de ti',
      mensaje: 'Laura Gómez está muy cerca. ¡Aprovecha sus ofertas especiales!',
      tiempo: '8 min',
      icono: MapPin,
      color: '#ef4444'
    },
    {
      id: 5,
      avatar: '⏰',
      titulo: 'Recordatorio',
      subtitulo: 'Pedido pendiente',
      mensaje: 'No olvides calificar tu última compra con Juan Pérez',
      tiempo: '10 min',
      icono: Clock,
      color: '#8b5cf6'
    }
  ];

  useEffect(() => {
    notificacionesData.forEach((notif, index) => {
      setTimeout(() => {
        setNotificaciones(prev => [...prev, notif]);
        
        // Vibrar cuando aparece la notificación (si está disponible)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, index * 1500);
    });
  }, []);

  const eliminarNotificacion = (id) => {
    setAnimandoSalida(prev => [...prev, id]);
    setTimeout(() => {
      setNotificaciones(prev => prev.filter(n => n.id !== id));
      setAnimandoSalida(prev => prev.filter(nId => nId !== id));
    }, 300);
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efecto de fondo animado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '40px',
        textAlign: 'center',
        zIndex: 1
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '16px 32px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <Bell size={24} style={{ color: 'white' }} />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'white',
            margin: 0
          }}>
            Notificaciones
          </h1>
        </div>
      </div>

      {/* Contenedor de notificaciones */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '120px',
        position: 'relative',
        zIndex: 2
      }}>
        {notificaciones.map((notif, index) => {
          const Icono = notif.icono;
          const estaAnimandoSalida = animandoSalida.includes(notif.id);
          
          return (
            <div
              key={notif.id}
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.5)',
                animation: estaAnimandoSalida ? 'slideOut 0.3s ease-out forwards' : 'slideIn 0.4s ease-out',
                transformOrigin: 'top',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => eliminarNotificacion(notif.id)}
            >
              {/* Barra superior de colores */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: notif.color,
                borderRadius: '16px 16px 0 0'
              }} />

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {/* Avatar con icono */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                  }}>
                    {notif.avatar}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    background: notif.color,
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <Icono size={12} style={{ color: 'white' }} />
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        margin: 0,
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {notif.titulo}
                      </h3>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {notif.subtitulo}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#9ca3af',
                        whiteSpace: 'nowrap'
                      }}>
                        {notif.tiempo}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarNotificacion(notif.id);
                        }}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                        }}
                      >
                        <X size={14} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#374151',
                    margin: '8px 0 0 0',
                    lineHeight: '1.4'
                  }}>
                    {notif.mensaje}
                  </p>
                </div>
              </div>

              {/* Indicador de deslizar */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '16px',
                fontSize: '11px',
                color: '#9ca3af',
                fontStyle: 'italic',
                opacity: 0.6
              }}>
                Toca para descartar
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje cuando no hay notificaciones */}
      {notificaciones.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginTop: '40px',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <Bell size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <p style={{ fontSize: '18px', opacity: 0.8 }}>
            No hay notificaciones nuevas
          </p>
        </div>
      )}

      {/* Animaciones CSS */}
      <style>{`
        @keyframes slideIn {
          0% {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}