import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

export default function SolicitarRestablecimiento() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('vendedor');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setMensaje('❌ Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);
    setMensaje('Enviando correo...');

    try {
      await apiService.solicitarRecuperacion(email, tipoUsuario);
      setMensaje('✅ Te hemos enviado un correo con las instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.');
      setEmail('');
      
      // Opcional: redirigir al login después de 5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      console.error('Error al solicitar restablecimiento:', error);
      
      // Mensaje genérico por seguridad (no revelar si el email existe)
      if (error.message?.includes('no encontrado') || error.message?.includes('not found')) {
        setMensaje('✅ Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.');
      } else {
        setMensaje(error.message || '❌ Error al enviar el correo. Por favor intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#faf3e0',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '10px', textAlign: 'center' }}>
          🔑 Recuperar Contraseña
        </h2>
        <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center', fontSize: '14px' }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Tipo de Usuario
            </label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="vendedor">Vendedor</option>
              <option value="entidad">Entidad</option>
            </select>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              background: isSubmitting ? '#faf3e0' : '#9a1e22',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              marginBottom: '15px'
            }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              background: 'transparent',
              color: '#9a1e22',
              border: '2px solid #9a1e22',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.target.style.background = '#9a1e22';
                e.target.style.color = 'white';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#9a1e22';
            }}
          >
            Volver al Login
          </button>

          {mensaje && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: '5px',
              background: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${mensaje.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
              color: mensaje.includes('✅') ? '#155724' : '#721c24',
              textAlign: 'center',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}