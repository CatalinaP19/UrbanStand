import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContex'

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, getUserRole, isLoading } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras carga el contexto de autenticación
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#faf3e0',
        }}
      >
        <div
          style={{
            fontSize: '1.25rem',
            color: '#9a1e22',
            fontWeight: '600',
          }}
        >
          Cargando...
        </div>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated() || !user) {
    // Guardar la ubicación intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verificar roles permitidos
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = getUserRole()

    if (!allowedRoles.includes(userRole)) {
      // Redirigir al dashboard correspondiente según el rol
      const roleDashboards = {
        vendedor: '/vendedor',
        entidad: '/entidades',
        cliente: '/cliente',
      }

      const dashboard = roleDashboards[userRole] || '/'
      return <Navigate to={dashboard} replace />
    }
  }

  return children
}

export default PrivateRoute
