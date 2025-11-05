import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContex'
import { useEffect, useState } from 'react'

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, getUserRole, validateToken } = useAuth()
  const location = useLocation()
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Validar token en el servidor
        const valid = await validateToken()
        setIsValid(valid)
      } catch (error) {
        console.error('Error validando token:', error)
        setIsValid(false)
      } finally {
        setIsValidating(false)
      }
    }

    checkAuth()
  }, [validateToken])


  // Mostrar loading mientras valida
  if (isValidating) {
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
          Validando acceso...
        </div>
      </div>
    )
  }

  // Si no está autenticado o el token no es válido, redirigir al login
  if (!isAuthenticated() || !isValid) {
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
