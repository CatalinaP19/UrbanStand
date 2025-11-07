import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'; // ✅ Agregar useSearchParams
import apiService from '../services/apiService';

export default function RestablecerPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ Ahora está importado
  const tipoUsuario = searchParams.get('tipo') || 'vendedor';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (password.length < 8) {
      setMensaje('❌ La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setMensaje('❌ Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    setMensaje('Procesando...');

    try {
      // ✅ Ahora pasa el tipoUsuario al backend
      await apiService.restablecerPassword(token, password, tipoUsuario);
      setMensaje('✅ Contraseña actualizada exitosamente. Redirigiendo al login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      setMensaje(error.message || '❌ Error al restablecer la contraseña. El enlace puede haber expirado.');
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
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
          🔐 Restablecer Contraseña
        </h2>
        <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center', fontSize: '14px' }}>
          Ingresa tu nueva contraseña para <strong>{tipoUsuario === 'entidad' ? 'Entidad' : 'Vendedor'}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Nueva Contraseña
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
              Confirmar Contraseña
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              placeholder="Repite la contraseña"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPasswordVisible}
                onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isSubmitting}
                style={{ marginRight: '8px' }}
              />
              <span style={{ color: '#666', fontSize: '14px' }}>Mostrar contraseñas</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              background: isSubmitting ? '#ccc' : '#f5576c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {isSubmitting ? 'Procesando...' : 'Cambiar Contraseña'}
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
              fontSize: '14px'
            }}>
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}