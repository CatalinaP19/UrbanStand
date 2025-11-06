import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

export default function ConfirmarEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verificando'); // verificando, exitoso, error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    confirmarEmail();
  }, []);

  const confirmarEmail = async () => {
    try {
      setStatus('verificando');
      setMensaje('Verificando tu email...');

      // Llama a tu API para confirmar el email
      const response = await apiService.confirmarEmail(token);
      
      setStatus('exitoso');
      setMensaje('¡Email confirmado exitosamente! Redirigiendo al login...');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Error al confirmar email:', error);
      setStatus('error');
      setMensaje(error.message || 'Error al confirmar el email. El enlace puede haber expirado.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        {status === 'verificando' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Verificando...</h2>
            <p style={{ color: '#666' }}>{mensaje}</p>
          </>
        )}

        {status === 'exitoso' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#28a745', marginBottom: '10px' }}>¡Confirmación Exitosa!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{mensaje}</p>
            <div style={{
              background: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '5px',
              padding: '15px',
              color: '#155724'
            }}>
              Tu cuenta ha sido activada correctamente.
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Error de Confirmación</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{mensaje}</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Ir al Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}