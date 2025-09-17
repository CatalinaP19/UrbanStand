// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares de seguridad y parseo
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para capturar IP real (útil para auditoría)
app.use((req, res, next) => {
  req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  next();
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB exitosamente');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Importar rutas
const authRoutes = require('./routes/auth');
const authEntidadRoutes = require('./routes/authEntidad');

// Rutas de vendedores
app.use('/api/auth', authRoutes);
app.use('/api/vendedores', authRoutes); // Mantener compatibilidad si ya usas esta ruta

// Rutas de entidades gubernamentales
app.use('/api/entidad', authEntidadRoutes.router);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'UrbanStand API funcionando correctamente! 🎉',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      vendedores: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      entidades: {
        register: 'POST /api/entidad/register',
        login: 'POST /api/entidad/login',
        profile: 'GET /api/entidad/profile',
        estadisticas: 'GET /api/entidad/estadisticas',
        reportes: 'POST /api/entidad/descargar-reporte'
      }
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    endpoints_disponibles: [
      'GET /',
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/auth/profile',
      'POST /api/entidad/register',
      'POST /api/entidad/login',
      'GET /api/entidad/profile',
      'GET /api/entidad/estadisticas',
      'POST /api/entidad/descargar-reporte'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 UrbanStand API: http://localhost:${PORT}`);
  console.log(`👥 Vendedores: http://localhost:${PORT}/api/auth`);
  console.log(`🏛️  Entidades: http://localhost:${PORT}/api/entidad`);
});