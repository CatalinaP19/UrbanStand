// routes/authEntidad.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const EntidadGubernamental = require('../models/EntidadGubernamental');
const Vendedor = require('../models/Vendedor');

const router = express.Router();
// Middleware para validar errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      details: errors.array()
    });
  }
  next();
};

// Middleware de autenticación JWT para entidades
const authenticateEntidadToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido',
      message: 'Debes incluir un token en el header Authorization: Bearer <token>'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_ENTIDAD || process.env.JWT_SECRET, (err, entidad) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido o expirado',
        message: 'El token proporcionado no es válido'
      });
    }
    // Verificar que es un token de entidad
    if (!entidad.entidadId) {
      return res.status(403).json({ 
        error: 'Token no válido para entidades',
        message: 'Este token no corresponde a una entidad gubernamental'
      });
    }
    req.entidad = entidad;
    next();
  });
};

// validacion direccion colombiana
const ValidateAddressEnti = (value) => {
  if (!value || typeof value !== 'string') {
    throw new Error('La dirección es requerida');
  }
  
  const direccion = value.trim();
  if (direccion.length < 5 || direccion.length > 200) {
    throw new Error('La dirección debe tener entre 5 y 200 caracteres');
  }
  
  // Regex para direcciones colombianas
  const direccionRegex = /^(Calle|Carrera|Transversal|Diagonal|Avenida|Autopista|Circunvalar|Av\.?|Kr\.?|Cr\.?|Cl\.?|Tv\.?|Dg\.?|Ac\.?|Ak\.?|Cra\.?)\s*\d+[A-Za-z]*(?:\s*(?:Bis|Sur|Norte|Este|Oeste|A|B|C))?\s*(?:#|No\.?|Nro\.?|N°)\s*\d+[A-Za-z]*(?:\s*[-–]\s*\d+[A-Za-z]*)?(?:\s*(?:Apt|Apto|Apartamento|Of|Oficina|Local|Int|Interior|Piso|Torre|Bloque|Casa|Lote)\s*[A-Za-z0-9]+)?/i;
  
  if (!direccionRegex.test(direccion)) {
    throw new Error('La dirección debe tener un formato válido para Colombia (ej: Calle 100 #15-55)');
  }
  
  return true;
};

// REGISTRO DE ENTIDAD GUBERNAMENTAL
router.post('/register', [
  // Validaciones
  body('nomEnti')
    .notEmpty()
    .withMessage('El nombre de la entidad es requerido')
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('tipoE')
    .isIn(['publica', 'privada', 'ong', 'universidad', 'otro'])
    .withMessage('Tipo de entidad debe ser: publica, privada, ong, universidad, u otro'),
    
  body('sector')
    .isIn(['comercio', 'investigacion', 'gubernamental', 'otro'])
    .withMessage('Sector debe ser: comercio, investigacion, gubernamental, u otro'),
    
  body('nit')
    .notEmpty()
    .withMessage('El NIT es requerido')
    .isLength({ min: 9, max: 15 })
    .withMessage('El NIT debe tener entre 9 y 15 caracteres'),
    
  body('emailE')
    .isEmail()
    .withMessage('Debe ser un correo institucional válido')
    .normalizeEmail(),
    
  body('NumTelE')
    .matches(/^3\d{9}$/)
    .withMessage('El número telefónico debe ser válido para Colombia (formato: 3XXXXXXXXX)'),
    
  body('direccionE')
    .notEmpty()
    .withMessage('La dirección de la sede principal es requerida')
    .custom(ValidateAddressEnti)
    .withMessage('La dirección debe ser válida para Colombia (ej: Calle 100 #15-55)'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número')
    
], handleValidationErrors, async (req, res) => {
  try {
    const {
      nomEnti, tipoE, sector, nit, emailE,
      NumTelE, direccionE, password
    } = req.body;

    // Verificar si ya existe una entidad con ese correo o NIT
    const entidadExistente = await EntidadGubernamental.findOne({
      $or: [
        { emailE },
        { nit }
      ]
    });

    if (entidadExistente) {
      return res.status(409).json({
        error: "Entidad ya registrada",
        message: entidadExistente.emailE === emailE 
          ? "Ya existe una entidad con este correo institucional"
          : "Ya existe una entidad con este NIT"
      });
    }

    // Crear nueva entidad
    const nuevaEntidad = new EntidadGubernamental({
      nomEnti,
      tipoE,
      sector,
      nit,
      emailE,
      NumTelE,
      direccionE,
      password, // Se encriptará automáticamente por el middleware pre('save')
      configuracion_reportes: {
        tipos_datos_autorizados: [
          'conteo_vendedores',
          'distribucion_genero',
          'distribucion_categorias',
          'actividad_por_zonas',
          'tendencias_temporales',
          'datos_demograficos_agregados'
        ]
      }
    });

    await nuevaEntidad.save();

    // Generar JWT token específico para entidades
    const token = jwt.sign(
      { 
        entidadId: nuevaEntidad._id,
        emailE: nuevaEntidad.emailE,
        nomEnti: nuevaEntidad.nomEnti,
        tipoE: nuevaEntidad.tipoE,
        sector: nuevaEntidad.sector,
        role: 'entidad'
      },
      process.env.JWT_SECRET_ENTIDAD || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    res.status(201).json({
      message: "Entidad registrada exitosamente",
      token,
      entidad: nuevaEntidad.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en registro de entidad:', error);
    
    // Error de duplicado de MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        error: "Datos duplicados",
        message: `Ya existe una entidad con este ${field === 'emailE' ? 'correo institucional' : 'NIT'}`
      });
    }
    
    res.status(500).json({
      error: "Error interno del servidor",
      message: "No se pudo registrar la entidad"
    });
  }
});

// LOGIN DE ENTIDAD GUBERNAMENTAL
router.post('/login', [
  body('emailE')
    .isEmail()
    .withMessage('Debe ser un correo institucional válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
], handleValidationErrors, async (req, res) => {
  try {
    const { emailE, password } = req.body;

    // Buscar entidad por correo
    const entidad = await EntidadGubernamental.findOne({ emailE });
    if (!entidad) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        message: "Correo o contraseña incorrectos"
      });
    }

    // Verificar si la entidad está activa
    if (entidad.estado_entidad === 'suspendida') {
      return res.status(403).json({
        error: "Cuenta suspendida",
        message: "Tu cuenta ha sido suspendida. Contacta al administrador."
      });
    }

    if (entidad.estado_entidad === 'eliminada') {
      return res.status(403).json({
        error: "Cuenta eliminada",
        message: "Esta cuenta ya no está disponible."
      });
    }

    // Verificar contraseña usando el método del modelo
    const esContrasenaValida = await entidad.compararContrasenia(password);
    if (!esContrasenaValida) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        message: "Correo o contraseña incorrectos"
      });
    }

    // Actualizar estado a activo si está inactivo
    if (entidad.estado_entidad === 'inactiva') {
      entidad.estado_entidad = 'activa';
      await entidad.save();
    }

    // Registrar acceso
    const ip = req.ip || req.connection.remoteAddress;
    await entidad.registrarAcceso(ip);

    // Generar JWT token
    const token = jwt.sign(
      { 
        entidadId: entidad._id,
        emailE: entidad.emailE,
        nomEnti: entidad.nomEnti,
        tipoE: entidad.tipoE,
        sector: entidad.sector,
        estado: entidad.estado,
        role: 'entidad'
      },
      process.env.JWT_SECRET_ENTIDAD || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    res.status(200).json({
      message: "Login exitoso",
      token,
      entidad: entidad.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en login de entidad:', error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: "No se pudo procesar el login"
    });
  }
});

// VALIDAR TOKEN DE ENTIDAD (RUTA PROTEGIDA)
router.get('/validate', authenticateEntidadToken, async (req, res) => {
  try {
    const entidad = await EntidadGubernamental.findById(req.entidad.entidadId)
      .select('estado_cuenta emailVerificado');

    if (!entidad) {
      return res.status(404).json({
        valid: false,
        message: 'Entidad no encontrada'
      });
    }

    if (entidad.estado_cuenta !== 'activo') {
      return res.status(403).json({
        valid: false,
        message: 'Cuenta inactiva o suspendida'
      });
    }

    res.json({
      valid: true,
      entidad: {
        id: entidad._id,
        role: 'entidad'
      }
    });
  } catch (error) {
    console.error('Error validando token:', error);
    res.status(500).json({
      valid: false,
      message: 'Error al validar token'
    });
  }
});

// OBTENER PERFIL DE ENTIDAD (RUTA PROTEGIDA)
router.get('/profile', authenticateEntidadToken, async (req, res) => {
  try {
    const entidad = await EntidadGubernamental.findById(req.entidad.entidadId)
      .select('-password');

    if (!entidad) {
      return res.status(404).json({ 
        error: 'Entidad no encontrada',
        message: 'La entidad asociada al token no existe'
      });
    }

    res.json({
      message: "Perfil obtenido exitosamente",
      entidad: entidad.toPublicJSON(),
      resumen_actividad: entidad.obtenerResumenActividad()
    });
  } catch (error) {
    console.error('Error obteniendo perfil de entidad:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el perfil'
    });
  }
});

// OBTENER ESTADÍSTICAS DE VENDEDORES (RUTA PROTEGIDA)
router.get('/estadisticas', authenticateEntidadToken, async (req, res) => {
  try {
    const { localidad, genero, categoria, fecha_inicio, fecha_fin } = req.query;

    // Construir filtros
    const filtros = {};
    if (localidad) filtros.localidad = localidad;
    if (genero) filtros.genero = genero;
    if (categoria) filtros.categoria = categoria;
    if (fecha_inicio) filtros.fechaInicio = fecha_inicio;
    if (fecha_fin) filtros.fechaFin = fecha_fin;

    // Obtener estadísticas agregadas (SIN datos personales)
    const estadisticas = await EntidadGubernamental.obtenerEstadisticasVendedores(filtros);

    // Estadísticas adicionales
    const totalVendedores = await Vendedor.countDocuments({ estado_vendedor: { $ne: 'eliminado' } });
    const vendedoresActivos = await Vendedor.countDocuments({ estado_vendedor: 'activo' });
    const vendedoresInactivos = await Vendedor.countDocuments({ estado_vendedor: 'inactivo' });

    // Distribución por categorías (agregada)
    const distribucionCategorias = await Vendedor.aggregate([
      { $match: { estado_vendedor: { $ne: 'eliminado' } } },
      { $group: { _id: '$categoria_producto', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Distribución por género (agregada)
    const distribucionGenero = await Vendedor.aggregate([
      { $match: { estado_vendedor: { $ne: 'eliminado' } } },
      { $group: { _id: '$genero', count: { $sum: 1 } } }
    ]);

    res.json({
      message: "Estadísticas obtenidas exitosamente",
      data: {
        resumen: {
          total_vendedores: totalVendedores,
          vendedores_activos: vendedoresActivos,
          vendedores_inactivos: vendedoresInactivos,
          tasa_actividad: totalVendedores > 0 ? Math.round((vendedoresActivos / totalVendedores) * 100) : 0
        },
        distribucion_categorias: distribucionCategorias,
        distribucion_genero: distribucionGenero,
        filtros_aplicados: filtros,
        fecha_consulta: new Date()
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas'
    });
  }
});

// DESCARGAR REPORTE (RUTA PROTEGIDA)
router.post('/descargar-reporte', authenticateEntidadToken, [
  body('tipo_reporte')
    .isIn(['estadisticas_generales', 'reporte_localidad', 'reporte_categorias', 'reporte_temporal'])
    .withMessage('Tipo de reporte no válido')
], handleValidationErrors, async (req, res) => {
  try {
    const { tipo_reporte, parametros = {} } = req.body;
    const entidadId = req.entidad.entidadId;

    // Registrar la descarga en el historial
    const entidad = await EntidadGubernamental.findById(entidadId);
    await entidad.registrarDescarga(tipo_reporte, parametros);

    // Generar los datos del reporte (SIN información personal)
    let datosReporte;
    switch (tipo_reporte) {
      case 'estadisticas_generales':
        datosReporte = await EntidadGubernamental.obtenerEstadisticasVendedores(parametros);
        break;
      case 'reporte_localidad':
        // Implementar según necesidades específicas
        datosReporte = await Vendedor.aggregate([
          { $match: { estado_vendedor: { $ne: 'eliminado' } } },
          { $group: { _id: '$id_localidad', count: { $sum: 1 } } },
          { $lookup: { from: 'localidades', localField: '_id', foreignField: '_id', as: 'localidad' } }
        ]);
        break;
      // Agregar más casos según necesidades
      default:
        datosReporte = [];
    }

    res.json({
      message: "Reporte generado exitosamente",
      tipo_reporte,
      datos: datosReporte,
      parametros,
      fecha_generacion: new Date(),
      nota: "Este reporte contiene únicamente datos estadísticos agregados, sin información personal de vendedores"
    });

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'No se pudo generar el reporte'
    });
  }
});

// ELIMINAR CUENTA DE ENTIDAD (RUTA PROTEGIDA)
router.delete('/eliminar-cuenta', authenticateEntidadToken, [
  body('confirmacion')
    .equals('ELIMINAR')
    .withMessage('Debes confirmar escribiendo "ELIMINAR"')
], handleValidationErrors, async (req, res) => {
  try {
    const entidadId = req.entidad.entidadId;

    // Marcar como eliminada en lugar de borrar completamente
    await EntidadGubernamental.findByIdAndUpdate(entidadId, {
      estado_entidad: 'eliminada',
      fecha_eliminacion: new Date()
    });

    res.json({
      message: "Cuenta eliminada exitosamente",
      nota: "Tu cuenta ha sido marcada como eliminada. Los datos estadísticos previos se mantienen para fines de análisis agregado."
    });

  } catch (error) {
    console.error('Error eliminando cuenta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar la cuenta'
    });
  }
});

// Exportar router y middleware
module.exports = { 
  router,
  authenticateEntidadToken
};