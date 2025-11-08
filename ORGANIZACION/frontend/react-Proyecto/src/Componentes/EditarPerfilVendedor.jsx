import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, X, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../Componentes/Breadcrumbs';


const EditarPerfilVendedor = () => {
  const navigate = useNavigate(); // ✅ 1. Movido al inicio (hooks primero)

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

  // ✅ 2. Extraída función helper fuera del useEffect
  const getProfileImageByGender = (genero) => {
    const g = (genero || '').toLowerCase();
    if (g.includes('fem')) return '/img/PerfilFemale.png';
    if (g.includes('mas')) return '/img/PerfilMale.png';
    return '/img/PerfilOther.png';
  };

  // Cargar datos del usuario actual
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('urbanstand_current_user') || '{}');
      const allUsers = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
      
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

      setProfileImage(getProfileImageByGender(userData.genero)); // ✅ 2. Usando función helper
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }, []); // ✅ 3. Agregada dependencia vacía explícita

  // Actualizar imagen cuando cambia el género
  useEffect(() => {
    if (formData.genero) {
      setProfileImage(getProfileImageByGender(formData.genero)); // ✅ 2. Usando función helper
    }
  }, [formData.genero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleClose = () => {
    navigate('/vendedor/perfil');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentUser = JSON.parse(localStorage.getItem('urbanstand_current_user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...formData
      };

      localStorage.setItem('urbanstand_current_user', JSON.stringify(updatedUser));

      const allUsers = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
      if (formData.email) {
        allUsers[formData.email] = updatedUser;
        localStorage.setItem('urbanstand_users', JSON.stringify(allUsers));
      }

      setSuccessMessage('✓ Perfil actualizado correctamente');
      
      setTimeout(() => {
        navigate('/vendedor/perfil');
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
    <div style={styles.container}>
      <Breadcrumbs />
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Editar Perfil</h2>
          <button
            onClick={handleClose}
            style={styles.closeButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={24} color="#666" />
          </button>
        </div>

        {/* Form Content */}
        <div style={styles.formContent}>
          {/* Foto de perfil */}
          <div style={styles.profileSection}>
            <div style={styles.avatarContainer}>
              <img
                src={profileImage}
                alt="Perfil"
                style={styles.avatar}
              />
              <div style={styles.cameraIcon}>
                <Camera size={20} color="white" />
              </div>
            </div>
            <p style={styles.imageHint}>
              La imagen cambia según el género seleccionado
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div style={styles.successMessage}>
              <AlertCircle size={18} />
              {successMessage}
            </div>
          )}

          {/* Error general */}
          {errors.submit && (
            <div style={styles.errorMessage}>
              <AlertCircle size={18} />
              {errors.submit}
            </div>
          )}

          {/* Información Personal */}
          <div style={styles.gridTwo}>
            <div>
              <label style={styles.label}>Nombre *</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    ...styles.input,
                    border: errors.firstName ? '2px solid #dc3545' : '1px solid #ddd'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.currentTarget.style.borderColor = errors.firstName ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.firstName && (
                <span style={styles.errorText}>{errors.firstName}</span>
              )}
            </div>

            <div>
              <label style={styles.label}>Apellido *</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    ...styles.input,
                    border: errors.lastName ? '2px solid #dc3545' : '1px solid #ddd'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.currentTarget.style.borderColor = errors.lastName ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.lastName && (
                <span style={styles.errorText}>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email y Teléfono */}
          <div style={styles.gridTwo}>
            <div>
              <label style={styles.label}>Email *</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly={true} // o disabled={true}
                  style={{
                    ...styles.input,
                    backgroundColor: '#f5f5f5', // opcional: para dar feedback visual
                    cursor: 'not-allowed', // opcional: cambia el cursor
                    opacity: 0.7
                  }}
                />
              </div>
            </div>

            <div>
              <label style={styles.label}>Teléfono</label>
              <div style={styles.inputWrapper}>
                <Phone size={18} style={styles.inputIcon} />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="3001234567"
                  style={{
                    ...styles.input,
                    border: errors.telefono ? '2px solid #dc3545' : '1px solid #ddd'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                  onBlur={(e) => e.currentTarget.style.borderColor = errors.telefono ? '#dc3545' : '#ddd'}
                />
              </div>
              {errors.telefono && (
                <span style={styles.errorText}>{errors.telefono}</span>
              )}
            </div>
          </div>

          {/* Género y Tipo de Vendedor */}
          <div style={styles.gridTwo}>
            <div>
              <label style={styles.label}>Género *</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  border: errors.genero ? '2px solid #dc3545' : '1px solid #ddd'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                onBlur={(e) => e.currentTarget.style.borderColor = errors.genero ? '#dc3545' : '#ddd'}
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.genero && (
                <span style={styles.errorText}>{errors.genero}</span>
              )}
            </div>

            <div>
              <label style={styles.label}>Tipo de Vendedor</label>
              <select
                name="tipoVendedor"
                value={formData.tipoVendedor}
                onChange={handleChange}
                style={styles.select}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
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
          <div>
            <label style={styles.label}>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Cuéntanos sobre tu negocio..."
              rows="3"
              style={styles.textarea}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            />
          </div>

          {/* Dirección */}
          <div>
            <label style={styles.label}>Dirección</label>
            <div style={styles.inputWrapper}>
              <MapPin size={18} style={{ ...styles.inputIcon, top: '12px' }} />
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Calle 123 #45-67"
                style={styles.input}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>
          </div>

          {/* Ciudad y Localidad */}
          <div style={styles.gridTwo}>
            <div>
              <label style={styles.label}>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                style={styles.inputSimple}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>

            <div>
              <label style={styles.label}>Localidad</label>
              <select
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
                style={styles.select}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FF7901'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
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
          <div style={styles.buttonContainer}>
            <button
              onClick={handleClose}
              style={styles.cancelButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                ...styles.saveButton,
                backgroundColor: isLoading ? '#ccc' : '#FF7901',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#E66A00';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#FF7901';
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

// ✅ 4. Estilos extraídos y organizados
const styles = {
  container: {
    minHeight: '100vh',
    background: '#faf3e0',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column', // Añadido para organizar el Breadcrumb
    alignItems: 'center',
    gap: '1rem' // Añadido para espaciar el Breadcrumb del card
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1
  },
  title: {
    margin: 0,
    color: '#085C52',
    fontSize: '1.5rem'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
  },
  formContent: {
    padding: '24px'
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px'
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '12px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #FF7901'
  },
  cameraIcon: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: '#FF7901',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  imageHint: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999'
  },
  input: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  inputSimple: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: '20px'
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.8rem',
    marginTop: '4px',
    display: 'block'
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  },
  cancelButton: {
    padding: '12px 24px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    color: '#666',
    borderRadius: '8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  saveButton: {
    padding: '12px 24px',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

export default EditarPerfilVendedor;