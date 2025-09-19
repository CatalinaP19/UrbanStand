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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`🔄 ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
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
  }

  // APIs para vendedores
  vendedor = {
    register: (data) => this.post(API_CONFIG.VENDEDOR.REGISTER, data),
    login: (data) => this.post(API_CONFIG.VENDEDOR.LOGIN, data),
    profile: () => this.request(API_CONFIG.VENDEDOR.PROFILE),
  };

  // APIs para entidades
  entidad = {
    register: (data) => this.post(API_CONFIG.ENTIDAD.REGISTER, data),
    login: (data) => this.post(API_CONFIG.ENTIDAD.LOGIN, data),
    profile: () => this.request(API_CONFIG.ENTIDAD.PROFILE),
  };
}

const apiService = new ApiService();
export default apiService;
