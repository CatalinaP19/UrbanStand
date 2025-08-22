const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urbanstand', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('Intentando conectar a MongoDB...');

mongoose.connection.on('connected', () => {
  console.log('✅ Conectado a MongoDB exitosamente');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Error conectando a MongoDB:', err);
});

// =================== MODELOS DE BASE DE DATOS ===================

const vendedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasenia: { type: String, required: true },
  numero_documento: { type: String, required: true, unique: true },
  numero_celular: { type: String },
  tipo_documento: { type: String, enum: ['CC', 'CE', 'PP'], default: 'CC' },
  categoria_producto: { type: String },
  estado_vendedor: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  fecha_registro: { type: Date, default: Date.now },
  genero: { type: String, enum: ['M', 'F', 'O'] },
  id_localidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Localidad' },
  ubicacion: {
    latitud: Number,
    longitud: Number,
    ultima_actualizacion: { type: Date, default: Date.now }
  }
});

const localidadSchema = new mongoose.Schema({
  nombre_localidad: { type: String, required: true }
});

const mensajeSchema = new mongoose.Schema({
  id_emisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', required: true },
  id_receptor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', required: true },
  contenido: { type: String, required: true },
  fecha_envio: { type: Date, default: Date.now },
  estado_mensaje: { type: String, enum: ['enviado', 'entregado', 'leido'], default: 'enviado' }
});

const notificacionSchema = new mongoose.Schema({
  id_receptor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor', required: true },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_leida: { type: Date },
  estado_notificacion: { type: String, enum: ['enviada', 'leida'], default: 'enviada' },
  tipo_notificacion: { type: String, enum: ['alerta', 'info', 'mensaje'], default: 'info' }
});

// Crear los modelos
const Vendedor = mongoose.model('Vendedor', vendedorSchema);
const Localidad = mongoose.model('Localidad', localidadSchema);
const Mensaje = mongoose.model('Mensaje', mensajeSchema);
const Notificacion = mongoose.model('Notificacion', notificacionSchema);

// =================== MIDDLEWARE DE AUTENTICACIÓN ===================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'mi-clave-super-secreta-123', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// =================== RUTAS DE PRUEBA ===================

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 UrbanStand Backend funcionando correctamente!',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/vendors/nearby',
      'PUT /api/vendors/location',
      'GET /api/notifications',
      'POST /api/notifications'
    ]
  });
});

// =================== RUTAS DE AUTENTICACIÓN ===================

// Registro de vendedor
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Intento de registro:', req.body.correo);
    
    const { nombre, apellido, correo, contrasenia, numero_documento, numero_celular, tipo_documento } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !correo || !contrasenia || !numero_documento) {
      return res.status(400).json({ 
        error: 'Todos los campos obligatorios deben ser completados' 
      });
    }

    // Verificar si el usuario ya existe
    const existingVendedor = await Vendedor.findOne({ 
      $or: [{ correo }, { numero_documento }] 
    });

    if (existingVendedor) {
      return res.status(400).json({ 
        error: 'Ya existe un vendedor con ese correo o documento' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    // Crear nuevo vendedor
    const nuevoVendedor = new Vendedor({
      nombre,
      apellido,
      correo,
      contrasenia: hashedPassword,
      numero_documento,
      numero_celular,
      tipo_documento
    });

    await nuevoVendedor.save();
    console.log('✅ Vendedor registrado exitosamente:', correo);

    // Generar token
    const token = jwt.sign(
      { id: nuevoVendedor._id, correo: nuevoVendedor.correo },
      process.env.JWT_SECRET || 'mi-clave-super-secreta-123',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Vendedor registrado exitosamente',
      token,
      vendedor: {
        id: nuevoVendedor._id,
        nombre: nuevoVendedor.nombre,
        apellido: nuevoVendedor.apellido,
        correo: nuevoVendedor.correo
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicio de sesión
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔑 Intento de login:', req.body.correo);
    
    const { correo, contrasenia } = req.body;

    if (!correo || !contrasenia) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    // Buscar vendedor
    const vendedor = await Vendedor.findOne({ correo });
    if (!vendedor) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasenia, vendedor.contrasenia);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso:', correo);

    // Generar token
    const token = jwt.sign(
      { id: vendedor._id, correo: vendedor.correo },
      process.env.JWT_SECRET || 'mi-clave-super-secreta-123',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      vendedor: {
        id: vendedor._id,
        nombre: vendedor.nombre,
        apellido: vendedor.apellido,
        correo: vendedor.correo
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener perfil del usuario autenticado
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.user.id).select('-contrasenia');
    res.json({ vendedor });
  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== RUTAS DE VENDEDORES ===================

// Obtener vendedores cercanos
app.get('/api/vendors/nearby', authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius en metros

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }

    // Buscar vendedores dentro del radio especificado
    const vendedoresCercanos = await Vendedor.find({
      'ubicacion.latitud': { $exists: true },
      'ubicacion.longitud': { $exists: true },
      estado_vendedor: 'activo',
      _id: { $ne: req.user.id } // Excluir al usuario actual
    }).select('nombre apellido categoria_producto ubicacion');

    // Filtrar por distancia
    const vendedoresFiltrados = vendedoresCercanos.filter(vendedor => {
      if (!vendedor.ubicacion.latitud || !vendedor.ubicacion.longitud) return false;
      
      const distancia = calcularDistancia(
        parseFloat(lat),
        parseFloat(lng),
        vendedor.ubicacion.latitud,
        vendedor.ubicacion.longitud
      );
      return distancia <= radius;
    });

    console.log(`📍 Encontrados ${vendedoresFiltrados.length} vendedores cercanos`);
    res.json({ vendedores: vendedoresFiltrados });
  } catch (error) {
    console.error('❌ Error buscando vendedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar ubicación del vendedor
app.put('/api/vendors/location', authenticateToken, async (req, res) => {
  try {
    const { latitud, longitud } = req.body;

    if (!latitud || !longitud) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }

    await Vendedor.findByIdAndUpdate(req.user.id, {
      ubicacion: {
        latitud,
        longitud,
        ultima_actualizacion: new Date()
      }
    });

    console.log('📍 Ubicación actualizada para usuario:', req.user.id);
    res.json({ message: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    console.error('❌ Error actualizando ubicación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== RUTAS DE NOTIFICACIONES ===================

// Obtener notificaciones del usuario
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({ 
      id_receptor: req.user.id 
    }).sort({ fecha_creacion: -1 });

    res.json({ notificaciones });
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear notificación
app.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { titulo, contenido, tipo_notificacion = 'info' } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Título y contenido son requeridos' });
    }

    const nuevaNotificacion = new Notificacion({
      id_receptor: req.user.id,
      titulo,
      contenido,
      tipo_notificacion
    });

    await nuevaNotificacion.save();
    console.log('🔔 Notificación creada para:', req.user.id);

    res.status(201).json({ 
      message: 'Notificación creada exitosamente',
      notificacion: nuevaNotificacion
    });
  } catch (error) {
    console.error('❌ Error creando notificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Marcar notificación como leída
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await Notificacion.findByIdAndUpdate(req.params.id, {
      estado_notificacion: 'leida',
      fecha_leida: new Date()
    });

    res.json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('❌ Error marcando notificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// =================== FUNCIONES AUXILIARES ===================

// Función para calcular distancia entre dos puntos (fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distancia en metros
}

// =================== MANEJO DE ERRORES ===================

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`
  });
});

// Middleware para manejar errores globales
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: 'Algo salió mal en el servidor'
  });
});

// =================== INICIAR SERVIDOR ===================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor UrbanStand ejecutándose en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📋 Documentación: http://localhost:${PORT}/`);
});

module.exports = app;