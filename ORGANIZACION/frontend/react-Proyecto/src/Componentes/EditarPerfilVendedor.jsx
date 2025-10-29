import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, X, AlertCircle } from 'lucide-react';

const EditarPerfilVendedor = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telefono: '',
    genero: '',
    tipoVendedor: '',
    descripcion: '',
    direccion: '',
    ciudad: 'Bogotá',
    localidad: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Cargar datos del usuario actual
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('urbanstand_current_user') || '{}');
      const allUsers = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
      
      // Buscar datos completos del usuario
      const userEmail = storedUser.email;
      const fullUserData = userEmail ? allUsers[userEmail] : null;
      
      const userData = fullUserData || storedUser;
      
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        telefono: userData.telefono || '',
        genero: userData.genero || '',
        tipoVendedor: userData.tipoVendedor || 'Vendedor Ambulante',
        descripcion: userData.descripcion || '',
        direccion: userData.direccion || '',
        ciudad: userData.ciudad || 'Bogotá',
        localidad: userData.localidad || ''
      });

      // Establecer imagen de perfil según género
      const genero = (userData.genero || '').toLowerCase();
      if (genero.includes('fem')) {
        setProfileImage('/img/PerfilFemale.png');
      } else if (genero.includes('mas')) {
        setProfileImage('/img/PerfilMale.png');
      } else {
        setProfileImage('/img/PerfilOther.png');
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }, []);

  // Actualizar imagen cuando cambia el género
  useEffect(() => {
    const genero = formData.genero.toLowerCase();
    if (genero.includes('fem')) {
      setProfileImage('/img/PerfilFemale.png');
    } else if (genero.includes('mas')) {
      setProfileImage('/img/PerfilMale.png');
    } else if (genero.includes('otr')) {
      setProfileImage('/img/PerfilOther.png');
    }
  }, [formData.genero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.telefono && !/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    if (!formData.genero) {
      newErrors.genero = 'Selecciona un género';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Simular guardado (aquí irían las llamadas a la API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar localStorage
      const currentUser = JSON.parse(localStorage.getItem('urbanstand_current_user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...formData
      };

      localStorage.setItem('urbanstand_current_user', JSON.stringify(updatedUser));

      // Actualizar también en urbanstand_users
      const allUsers = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
      if (formData.email) {
        allUsers[formData.email] = updatedUser;
        localStorage.setItem('urbanstand_users', JSON.stringify(allUsers));
      }

      setSuccessMessage('✓ Perfil actualizado correctamente');
      
      // Llamar callback si existe
      if (onSave) {
        onSave(updatedUser);
      }

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('Error guardando perfil:', error);
      setErrors({ submit: 'Error al guardar el perfil. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          <h2 style={{
            margin: 0,
            color: '#085C52',
            fontSize: '1.5rem'
          }}>Editar Perfil</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} color="#666" />
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '24px' }}>
          {/* Foto de perfil */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              position: 'relative',
              marginBottom: '12px'
            }}>
              <img
                src={profileImage}
                alt="Perfil"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #FF7901'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: '#FF7901',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <Camera size={20} color="white" />
              </div>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: '#666',
              margin: 0
            }}>La imagen cambia según el género seleccionado</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              {successMessage}
            </div>
          )}

          {/* Error general */}
          {errors.submit && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              {errors.submit}
            </div>
          )}

          {/* Información Personal */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Nombre *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: errors.firstName ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.target.style.borderColor = errors.firstName ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.firstName && (
                <span style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                  display: 'block'
                }}>{errors.firstName}</span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Apellido *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: errors.lastName ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.target.style.borderColor = errors.lastName ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.lastName && (
                <span style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                  display: 'block'
                }}>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email y Teléfono */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.email && (
                <span style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                  display: 'block'
                }}>{errors.email}</span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Teléfono
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="3001234567"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: errors.telefono ? '2px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.target.style.borderColor = errors.telefono ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.telefono && (
                <span style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                  display: 'block'
                }}>{errors.telefono}</span>
              )}
            </div>
          </div>

          {/* Género y Tipo de Vendedor */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Género *
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.genero ? '2px solid #dc3545' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                onBlur={(e) => e.target.style.borderColor = errors.genero ? '#dc3545' : '#ddd'}
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.genero && (
                <span style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                  display: 'block'
                }}>{errors.genero}</span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Tipo de Vendedor
              </label>
              <select
                name="tipoVendedor"
                value={formData.tipoVendedor}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              >
                <option value="Vendedor Ambulante">Vendedor Ambulante</option>
                <option value="Vendedor Estacionario">Vendedor Estacionario</option>
                <option value="Vendedor de Alimentos">Vendedor de Alimentos</option>
                <option value="Vendedor de Artesanías">Vendedor de Artesanías</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Cuéntanos sobre tu negocio..."
              rows="3"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF7901'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Dirección */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Dirección
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                color: '#999'
              }} />
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Calle 123 #45-67"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>

          {/* Ciudad y Localidad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Localidad
              </label>
              <select
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7901'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              >
                <option value="">Seleccionar...</option>
                <option value="Usaquén">Usaquén</option>
                <option value="Chapinero">Chapinero</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="San Cristóbal">San Cristóbal</option>
                <option value="Usme">Usme</option>
                <option value="Tunjuelito">Tunjuelito</option>
                <option value="Bosa">Bosa</option>
                <option value="Kennedy">Kennedy</option>
                <option value="Fontibón">Fontibón</option>
                <option value="Engativá">Engativá</option>
                <option value="Suba">Suba</option>
                <option value="Barrios Unidos">Barrios Unidos</option>
                <option value="Teusaquillo">Teusaquillo</option>
                <option value="Los Mártires">Los Mártires</option>
                <option value="Antonio Nariño">Antonio Nariño</option>
                <option value="Puente Aranda">Puente Aranda</option>
                <option value="La Candelaria">La Candelaria</option>
                <option value="Rafael Uribe Uribe">Rafael Uribe Uribe</option>
                <option value="Ciudad Bolívar">Ciudad Bolívar</option>
                <option value="Sumapaz">Sumapaz</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#666',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: isLoading ? '#ccc' : '#FF7901',
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#E66A00';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.backgroundColor = '#FF7901';
              }}
            >
              <Save size={18} />
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilVendedor;