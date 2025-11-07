const API_CONFIG = {
  BASE_URL: 'http://localhost:3005/api',
  
  VENDEDOR: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    RECUPERAR: '/vendedor/solicitar-recuperacion',     // ✅
    RESTABLECER: '/vendedor/restablecer-password',     // ✅
  },
  
  ENTIDAD: {
    REGISTER: '/entidad/register',
    LOGIN: '/entidad/login',
    PROFILE: '/entidad/profile',
    ESTADISTICAS: '/entidad/estadisticas',
    REPORTES: '/entidad/descargar-reporte',
    RECUPERAR: '/entidad/solicitar-recuperacion',      // ✅
    RESTABLECER: '/entidad/restablecer-password',      // ✅
  },
  
  EMAIL: {
    CONFIRMAR: '/auth/confirmar',
    REENVIAR: '/email/reenviar-confirmacion',
  }
};

export default API_CONFIG;