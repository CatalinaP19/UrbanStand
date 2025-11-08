import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Package, Edit3, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Componentes/Breadcrumbs';


export default function PerfilVendedor() {
  const [vendedor, setVendedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      // Primero intentamos cargar desde localStorage
      const storedUser = JSON.parse(localStorage.getItem('urbanstand_current_user') || '{}');
      
      if (storedUser && storedUser.email) {
        // Si encontramos datos en localStorage, los usamos
        console.log('Cargando perfil desde localStorage');
        setVendedor({
          ...storedUser,
          // Aseguramos que los campos requeridos tengan valores por defecto
          nombre: storedUser.firstName || 'Usuario',
          apellido: storedUser.lastName || '',
          email: storedUser.email || '',
          telefono: storedUser.telefono || 'No especificado',
          genero: storedUser.genero || 'No especificado',
          tipoVendedor: storedUser.tipoVendedor || 'Vendedor',
          descripcion: storedUser.descripcion || 'Sin descripción',
          direccion: storedUser.direccion || 'No especificada',
          ciudad: storedUser.ciudad || 'Bogotá',
          localidad: storedUser.localidad || 'No especificada'
        });
        return;
      }

      // Si no hay datos en localStorage, intentamos con la API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:3005/api/vendedor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result = await response.json();
      
      if (result.success && result.vendedor) {
        setVendedor(result.vendedor);
        // Guardamos los datos en localStorage para futuras cargas
        localStorage.setItem('urbanstand_current_user', JSON.stringify(result.vendedor));
      } else {
        throw new Error('No se pudo cargar el perfil');
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      // No mostramos alerta aquí para no molestar al usuario
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = (genero) => {
    const g = (genero || '').toString().toLowerCase();
    if (g.includes('fem')) return '/img/PerfilFemale.png';
    if (g.includes('mas')) return '/img/PerfilMale.png';
    if (g.includes('otr')) return '/img/PerfilOther.png';
    return '/img/PerfilOther.png';
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/vendedor');
  };

  const handleEdit = () => {
    navigate('/vendedor/editar-perfil');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingText}>Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (!vendedor) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <div style={styles.errorText}>No se pudo cargar el perfil</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Breadcrumbs />
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
          <h1 style={styles.title}>Mi Perfil</h1>
          <button 
            style={styles.editButton} 
            onClick={handleEdit}
          >
            <Edit3 size={18} />
            <span>Editar Perfil</span>
          </button>
        </div>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          {/* Avatar Section */}
          <div style={styles.avatarSection}>
            <img
              src={getProfileImage(vendedor.genero)}
              alt="Avatar"
              style={styles.avatar}
            />
            <div style={styles.nameSection}>
              <h2 style={styles.name}>
                {vendedor.firstName} {vendedor.lastName}
              </h2>
              <div style={styles.statusBadge}>
                {vendedor.vigencia === 'activo' ? (
                  <>
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ ...styles.statusText, color: '#10b981' }}>Activo</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} color="#ef4444" />
                    <span style={{ ...styles.statusText, color: '#ef4444' }}>Inactivo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div style={styles.infoGrid}>
            {/* Email */}
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <Mail size={18} color="#f97316" />
                <span>Correo Electrónico</span>
              </div>
              <div style={styles.infoValue}>{vendedor.email}</div>
            </div>

            {/* Phone */}
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <Phone size={18} color="#f97316" />
                <span>Número de Celular</span>
              </div>
              <div style={styles.infoValue}>{vendedor.NumTel}</div>
            </div>

            {/* Address */}
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <MapPin size={18} color="#f97316" />
                <span>Dirección del Puesto</span>
              </div>
              <div style={styles.infoValue}>{vendedor.direccion}</div>
            </div>

            {/* Gender */}
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <User size={18} color="#f97316" />
                <span>Género</span>
              </div>
              <div style={styles.infoValue}>
                {vendedor.genero.charAt(0).toUpperCase() + vendedor.genero.slice(1)}
              </div>
            </div>

            {/* Locality */}
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <MapPin size={18} color="#f97316" />
                <span>Localidad</span>
              </div>
              <div style={styles.infoValue}>
                {vendedor.id_localidad?.nombre || 'No especificada'}
              </div>
            </div>

            {/* Products - Full Width */}
            <div style={{ ...styles.infoItem, gridColumn: '1 / -1' }}>
              <div style={styles.infoLabel}>
                <Package size={18} color="#f97316" />
                <span>Categorías de Productos</span>
              </div>
              <div style={styles.productsContainer}>
                {vendedor.selectedProducts && vendedor.selectedProducts.length > 0 ? (
                  vendedor.selectedProducts.map((producto, index) => (
                    <span key={index} style={styles.productTag}>
                      {producto}
                    </span>
                  ))
                ) : (
                  <div style={styles.noProducts}>No hay productos registrados</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#faf3e0',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#9a1e22',
    margin: 0,
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f97316',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  editActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  profileCard: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '2px solid #f3f4f6',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #f97316',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    background: '#f3f4f6',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  statusText: {
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#1f2937',
    padding: '0.75rem',
    background: '#f9fafb',
    borderRadius: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #f97316',
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #f97316',
    borderRadius: '0.5rem',
    outline: 'none',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  productsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  productsEditContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  checkboxLabel: {
    color: '#1f2937',
  },
  productTag: {
    padding: '0.5rem 1rem',
    background: '#f97316',
    color: 'white',
    borderRadius: '2rem',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  noProducts: {
    color: '#6b7280',
    fontStyle: 'italic',
    padding: '0.75rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  loadingText: {
    fontSize: '1.25rem',
    color: '#9a1e22',
    fontWeight: '600',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  errorText: {
    fontSize: '1.25rem',
    color: '#ef4444',
    fontWeight: '600',
  },
};