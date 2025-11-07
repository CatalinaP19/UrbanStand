import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditarPerfilVendedor = () => {  // ❌ CORREGIDO: había "() => { onClose, onSave }) => {"
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

  const navigate = useNavigate();

  // Función para cerrar el editor y volver al perfil
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
      
      // Redirigir después de guardar
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
    <div style={{
      minHeight: '100vh',
      background: '#faf3e0',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
            onClick={handleClose}  // ✅ CAMBIADO: ahora usa handleClose
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

        {/* Form Content - resto del código igual... */}
        <div style={{ padding: '24px' }}>
          {/* ... todo el formulario ... */}
          
          {/* Botones al final */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleClose}  // ✅ CAMBIADO: ahora usa handleClose
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