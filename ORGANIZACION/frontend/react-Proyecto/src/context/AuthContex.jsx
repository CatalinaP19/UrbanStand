import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ CORRECTO
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('urbanstand_current_user')

        if (token && storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error cargando usuario:', error)
        // Limpiar directamente sin llamar logout
        localStorage.removeItem('token')
        localStorage.removeItem('urbanstand_current_user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, []) // Sin dependencias

  const validateToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) return false
  
      // Verificar expiración en cliente
      const tokenData = parseJWT(token)
      if (tokenData && tokenData.exp) {
        const now = Math.floor(Date.now() / 1000)
        if (tokenData.exp < now) {
          localStorage.removeItem('token')
          localStorage.removeItem('urbanstand_current_user')
          setUser(null)
          return false
        }
      }
  
      // Detectar tipo de usuario desde localStorage
      let userType = 'vendedor'
      try {
        const storedUser = localStorage.getItem('urbanstand_current_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          userType = userData.role || 'vendedor'
        }
      } catch (e) {
        console.error('Error leyendo rol de usuario:', e)
      }
      
      const endpoint = userType === 'entidad' 
        ? 'http://localhost:3005/api/entidad/validate'
        : 'http://localhost:3005/api/auth/validate'
  
      // Validar con el servidor
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) throw new Error('Token inválido')
  
      const result = await response.json()
      return result.valid === true
    } catch (error) {
      console.error('Error validando token:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('urbanstand_current_user')
      setUser(null)
      return false
    }
  }, [])

  // Parsear JWT (sin validar firma, solo para leer datos)
  const parseJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  const login = useCallback((token, userData) => {
    try {
      // Guardar token
      localStorage.setItem('token', token)

      // Guardar datos del usuario
      localStorage.setItem('urbanstand_current_user', JSON.stringify(userData))

      // Actualizar estado
      setUser(userData)

      return true
    } catch (error) {
      console.error('Error en login:', error)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    // Limpiar todo el localStorage relacionado con autenticación
    localStorage.removeItem('token')
    localStorage.removeItem('urbanstand_current_user')

    // Limpiar estado
    setUser(null)
  }, [])

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token')
    return !!token && !!user
  }, [user])

  const getUserRole = useCallback(() => {
    return user?.role || null
  }, [user])

  const updateUser = useCallback(
    (userData) => {
      try {
        const updatedUser = { ...user, ...userData }
        localStorage.setItem(
          'urbanstand_current_user',
          JSON.stringify(updatedUser)
        )
        setUser(updatedUser)
      } catch (error) {
        console.error('Error actualizando usuario:', error)
      }
    },
    [user]
  )

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    validateToken,
    updateUser,
    isLoading,
  }

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
