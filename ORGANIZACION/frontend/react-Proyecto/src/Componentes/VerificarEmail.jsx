import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';

export default function VerificarEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  
  // Obtener datos del registro (email y tipo de usuario)
  const email = location.state?.email || '';
  const tipoUsuario = location.state?.tipoUsuario || 'vendedor';
  const nombre = location.state?.nombre || '';

  const handleReenviarEmail = async () => {
    if (!email) {
      setMessage('No se encontró el correo electrónico. Por favor regístrate nuevamente.');
      return;
    }

    try {
      setIsResending(true);
      setMessage('Reenviando email...');
      
      await apiService.reenviarConfirmacion(email, tipoUsuario);
      
      setMessage('✅ Email reenviado exitosamente. Revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error reenviando email:', error);
      setMessage('❌ Error al reenviar el email. Intenta nuevamente en unos momentos.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVolverLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f3f3',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '50px 40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        textAlign: 'center'
      }}>
        {/* Icono de email */}
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 30px',
          background: '#9a1e22',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '50px'
        }}>
          📧
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#333',
          marginBottom: '15px'
        }}>
          ¡Verifica tu correo electrónico!
        </h1>

        {/* Saludo personalizado */}
        {nombre && (
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '25px'
          }}>
            Hola <strong>{nombre}</strong> 👋
          </p>
        )}

        {/* Mensaje principal */}
        <p style={{
          fontSize: '16px',
          color: '#555',
          lineHeight: '1.6',
          marginBottom: '10px'
        }}>
          Hemos enviado un correo de confirmación a:
        </p>
        
        <p style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#ea580c',
          marginBottom: '25px',
          wordBreak: 'break-all'
        }}>
          {email}
        </p>

        {/* Instrucciones */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '25px',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '15px',
            color: '#333',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            📝 Instrucciones:
          </p>
          <ol style={{
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8',
            paddingLeft: '20px',
            margin: 0
          }}>
            <li>Revisa tu bandeja de entrada</li>
            <li>Busca el email de <strong>UrbanStand</strong></li>
            <li>Haz clic en el botón "Confirmar mi Email"</li>
            <li>¡Listo! Ya podrás iniciar sesión</li>
          </ol>
        </div>

        {/* Advertencia */}
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ea580c',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '25px',
          textAlign: 'left'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#856404',
            margin: 0,
            lineHeight: '1.6'
          }}>
            ⚠️ <strong>Importante:</strong> El enlace de confirmación expira en <strong>24 horas</strong>.
            Si no verificas tu email, no podrás iniciar sesión.
          </p>
        </div>

        {/* Consejo */}
        <p style={{
          fontSize: '13px',
          color: '#999',
          marginBottom: '25px',
          fontStyle: 'italic'
        }}>
          💡 Si no encuentras el email, revisa tu carpeta de SPAM o correo no deseado
        </p>

        {/* Botones */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <button
            onClick={handleReenviarEmail}
            disabled={isResending}
            style={{
              width: '100%',
              padding: '14px',
              background: isResending ? '#f3f3f3' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isResending ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              if (!isResending) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isResending) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {isResending ? '📧 Reenviando...' : '📧 Reenviar correo de confirmación'}
          </button>

          <button
            onClick={handleVolverLogin}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              color: '#9a1e22',
              border: '2px solid #9a1e22',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#9a1e22';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#9a1e22';
            }}
          >
            Ir a Iniciar Sesión
          </button>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}