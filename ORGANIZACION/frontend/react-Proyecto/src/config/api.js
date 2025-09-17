// frontend/src/config/api.js
const API_CONFIG = {
  BASE_URL: 'http://localhost:3005', // Tu puerto del backend
  
  VENDEDOR: {
    REGISTER: '/api/auth/register/',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile'
  },
  
  ENTIDAD: {
    REGISTER: '/api/entidad/register/',
    LOGIN: '/api/entidad/login',
    PROFILE: '/api/entidad/profile',
    ESTADISTICAS: '/api/entidad/estadisticas',
    REPORTES: '/api/entidad/descargar-reporte'
  }
};

export default API_CONFIG;