import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };


    // Agregar token si existe
    const token = options.token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`🔄 ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, config);

      // Detectar tipo de contenido
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (response.status === 204) {
        data = null;
      } else if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (_) {
          data = null; // cuerpo vacío o JSON inválido
        }
      } else {
        // No-JSON: intenta texto
        try {
          const text = await response.text();
          data = text || null;
        } catch (_) {
          data = null;
        }
      }

      if (!response.ok) {
        // Mejor extracción de mensaje de error
        const msg = (data && (data.message || data.error || data.msg)) || `HTTP ${response.status}`;
        throw new Error(msg);
      }

      console.log(`✅ ${options.method || 'GET'} ${url} - Success`);
      return data;

    } catch (error) {
      console.error(`❌ ${options.method || 'GET'} ${url} - Error:`, error);
      throw error;
    }
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  saveAuth(token, userType = 'vendedor') {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    return token; // ✅ Retorna el token
  }

  vendedor = {
    register: (data) => this.post(API_CONFIG.VENDEDOR.REGISTER, data),
    login: (data) => this.post(API_CONFIG.VENDEDOR.LOGIN, data),
    profile: (token) => this.request(API_CONFIG.VENDEDOR.PROFILE, { headers: { Authorization: `Bearer ${token}` } }),
  };

  entidad = {
    register: (data) => this.post(API_CONFIG.ENTIDAD.REGISTER, data),
    login: (data) => this.post(API_CONFIG.ENTIDAD.LOGIN, data),
    profile: (token) => this.request(API_CONFIG.ENTIDAD.PROFILE, { headers: { Authorization: `Bearer ${token}` } }),
    estadisticas: (params) => this.get(API_CONFIG.ENTIDAD.ESTADISTICAS, params),
    descargarReporte: (params) => this.download(API_CONFIG.ENTIDAD.REPORTES, params),
  };

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async download(endpoint, data) {
    return this.post(endpoint, data);
  }
}

const apiService = new ApiService();
export default apiService;
