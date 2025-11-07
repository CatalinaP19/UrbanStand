import API_CONFIG from '../config/api'

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Agregar token de autorización si existe
    const token = options.token || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      console.log(`🔄 ${options.method || 'GET'} ${url}`)

      const response = await fetch(url, config)
      const data = await this._parseResponse(response)

      if (!response.ok) {
        const errorMessage = this._extractErrorMessage(data, response.status)
        throw new Error(errorMessage)
      }

      console.log(`✅ ${options.method || 'GET'} ${url} - Success`)
      return data
    } catch (error) {
      console.error(`❌ ${options.method || 'GET'} ${url} - Error:`, error)
      throw error
    }
  }

  /**
   * Parsea la respuesta HTTP según su tipo de contenido
   */
  async _parseResponse(response) {
    const contentType = response.headers.get('content-type') || ''

    // Sin contenido
    if (response.status === 204) {
      return null
    }

    // Respuesta JSON
    if (contentType.includes('application/json')) {
      try {
        return await response.json()
      } catch {
        return null
      }
    }

    // Respuesta de texto
    try {
      const text = await response.text()
      return text || null
    } catch {
      return null
    }
  }

  /**
   * Extrae el mensaje de error de la respuesta
   */
  _extractErrorMessage(data, statusCode) {
    if (data && (data.message || data.error || data.msg)) {
      return data.message || data.error || data.msg
    }
    return `HTTP ${statusCode}`
  }

  /**
   * Método POST
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Método GET con parámetros de query
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url)
  }

  /**
   * Método para descargar archivos
   */
  async download(endpoint, data) {
    return this.post(endpoint, data)
  }

  /**
   * Guarda el token de autenticación
   */
  saveAuth(token, userType = 'vendedor') {
    localStorage.setItem('token', token)
    localStorage.setItem('userType', userType)
    return token
  }

  // ========================================
  // MÉTODOS DE AUTENTICACIÓN Y EMAIL
  // ========================================

  /**
   * Confirma el email del usuario con el token recibido
   */
  confirmarEmail(token) {
    return this.request(`${API_CONFIG.EMAIL.CONFIRMAR}/${token}`, {
      method: 'GET',
    })
  }

  /**
   * Reenvía el correo de confirmación
   */
  reenviarConfirmacion(email, tipoUsuario) {
    return this.post(API_CONFIG.EMAIL.REENVIAR, {
      email,
      tipoUsuario,
    })
  }

  /**
   * Solicita recuperación de contraseña (rutas separadas por tipo)
   */
  solicitarRecuperacion(email, tipoUsuario) {
    const endpoint =
      tipoUsuario === 'entidad'
        ? API_CONFIG.ENTIDAD.RECUPERAR
        : API_CONFIG.VENDEDOR.RECUPERAR

    return this.post(endpoint, { email })
  }

  /**
   * Restablece la contraseña con el token recibido (rutas separadas por tipo)
   */
  restablecerPassword(token, nuevaPassword, tipoUsuario) {
    const endpoint =
      tipoUsuario === 'entidad'
        ? API_CONFIG.ENTIDAD.RESTABLECER
        : API_CONFIG.VENDEDOR.RESTABLECER

    return this.post(endpoint, {
      token,
      nuevaPassword,
    })
  }

  // ========================================
  // ENDPOINTS DE VENDEDOR
  // ========================================

  vendedor = {
  /**
   * Registra un nuevo vendedor
   */
  register: (data) => this.post(API_CONFIG.VENDEDOR.REGISTER, data),

  /**
   * Inicia sesión de vendedor
   */
  login: (data) => this.post(API_CONFIG.VENDEDOR.LOGIN, data),

  /**
   * Obtiene el perfil del vendedor autenticado
   */
  profile: (token) =>
    this.request(API_CONFIG.VENDEDOR.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),
}

  // ========================================
  // ENDPOINTS DE ENTIDAD
  // ========================================

  entidad = {
  /**
   * Registra una nueva entidad
   */
  register: (data) => this.post(API_CONFIG.ENTIDAD.REGISTER, data),

  /**
   * Inicia sesión de entidad
   */
  login: (data) => this.post(API_CONFIG.ENTIDAD.LOGIN, data),

  /**
   * Obtiene el perfil de la entidad autenticada
   */
  profile: (token) =>
    this.request(API_CONFIG.ENTIDAD.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /**
   * Obtiene estadísticas de la entidad
   */
  estadisticas: (params) => this.get(API_CONFIG.ENTIDAD.ESTADISTICAS, params),

  /**
   * Descarga un reporte de la entidad
   */
  descargarReporte: (params) =>
    this.download(API_CONFIG.ENTIDAD.REPORTES, params),
}
}

export default new ApiService()