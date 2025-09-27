// modelo/EntidadGubernamental.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EntidadGubernamentalSchema = new mongoose.Schema({
  // Información básica de la entidad
  nomEnti: {
    type: String,
    required: [true, 'El nombre de la entidad es requerido'],
    trim: true,
    maxlength: [100, 'El nombre de la entidad no puede exceder 100 caracteres']
  },
  
  // Tipo de entidad
  tipoE: {
    type: String,
    required: [true, 'El tipo de entidad es requerido'],
    enum: {
      values: ['publica', 'privada', 'ong', 'universidad', 'otro'],
      message: 'Tipo de entidad debe ser: publica, privada, ong, universidad, u otro'
    }
  },

  // Sector al que pertenece
  sector: {
    type: String,
    required: [true, 'El sector es requerido'],
    enum: {
      values: ['comercio', 'investigacion', 'gubernamental', 'otro'],
      message: 'Sector debe ser: comercio, investigacion, gubernamental, u otro'
    }
  },

  // Información de identificación tributaria
  nit: {
    type: String,
    required: [true, 'El NIT es requerido'],
    unique: true,
    trim: true,
    maxlength: [15, 'El NIT no puede exceder 15 caracteres']
  },

  // Información de contacto
  emailE: {
    type: String,
    required: [true, 'El correo institucional es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [150, 'El correo no puede exceder 150 caracteres'],
    match: [/^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.(gov|edu|org|mil|gob)(\.[a-zA-Z]{2,3})?$/, 'Debe ser un correo institucional válido (.gov, .edu, .org, .mil, .gob)']
  },
  
  NumTelE: {
    type: String,
    required: [true, 'El número telefónico institucional es requerido'],
    trim: true,
    maxlength: [15, 'El número telefónico no puede exceder 15 caracteres'],
    match: [/^3\d{9}$/, 'El número telefónico debe ser válido para Colombia (formato: 3XXXXXXXXX)']
  },

  // Dirección de la sede principal
  direccionE: {
    type: String,
    required: [true, 'La dirección de la sede principal es requerida'],
    trim: true,
    maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    
  },

  // Credenciales de acceso
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    // Las validaciones adicionales (mayúsculas, números, etc.) se manejan en el frontend
  },

  // Control de estado y permisos
  estado_entidad: {
    type: String,
    enum: {
      values: ['activa', 'inactiva', 'suspendida', 'eliminada'],
      message: 'Estado de entidad no válido'
    },
    default: 'activa'
  },

  // Permisos y configuraciones
  permisos: {
    ver_estadisticas: {
      type: Boolean,
      default: true
    },
    descargar_reportes: {
      type: Boolean,
      default: true
    },
    acceso_tiempo_real: {
      type: Boolean,
      default: true
    }
  },

  // Configuraciones de reportes y estadísticas
  configuracion_reportes: {
    localidades_autorizadas: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Localidad'
    }],
    frecuencia_reportes: {
      type: String,
      enum: ['diario', 'semanal', 'mensual', 'bajo_demanda'],
      default: 'bajo_demanda'
    },
    tipos_datos_autorizados: [{
      type: String,
      enum: [
        'conteo_vendedores',
        'distribucion_genero',
        'distribucion_categorias',
        'actividad_por_zonas',
        'tendencias_temporales',
        'datos_demograficos_agregados'
      ]
    }]
  },

  // Auditoría y registro de actividad
  ultima_sesion: {
    fecha_acceso: {
      type: Date
    },
    ip_acceso: {
      type: String
    }
  },

  historial_descargas: [{
    fecha_descarga: {
      type: Date,
      default: Date.now
    },
    tipo_reporte: {
      type: String,
      enum: ['estadisticas_generales', 'reporte_localidad', 'reporte_categorias', 'reporte_temporal']
    },
    parametros_filtro: {
      localidad: String,
      fecha_inicio: Date,
      fecha_fin: Date,
      genero: String,
      categoria: String
    }
  }],

  // Timestamps
  fecha_registro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'entidades_gubernamentales'
});

// Índices para optimizar consultas
EntidadGubernamentalSchema.index({ emailE: 1 });
EntidadGubernamentalSchema.index({ nit: 1 });
EntidadGubernamentalSchema.index({ estado_entidad: 1 });
EntidadGubernamentalSchema.index({ tipoE: 1 });
EntidadGubernamentalSchema.index({ sector: 1 });

// Middleware para encriptar contraseña antes de guardar
EntidadGubernamentalSchema.pre('save', async function (next) {
  // Solo encriptar si la contraseña ha sido modificada o es nueva
  if (!this.isModified('password')) return next();

  try {
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
EntidadGubernamentalSchema.methods.compararContrasenia = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Método para registrar acceso
EntidadGubernamentalSchema.methods.registrarAcceso = function (ip) {
  this.ultima_sesion = {
    fecha_acceso: new Date(),
    ip_acceso: ip
  };
  return this.save();
};

// Método para registrar descarga de reporte
EntidadGubernamentalSchema.methods.registrarDescarga = function (tipoReporte, parametros = {}) {
  this.historial_descargas.push({
    tipo_reporte: tipoReporte,
    parametros_filtro: parametros
  });
  return this.save();
};

// Método estático para obtener estadísticas agregadas de vendedores
EntidadGubernamentalSchema.statics.obtenerEstadisticasVendedores = async function (filtros = {}) {
  const Vendedor = mongoose.model('Vendedor');
  
  // Construir pipeline de agregación
  const pipeline = [];
  
  // Filtros básicos
  const matchStage = {
    estado_vendedor: { $ne: 'eliminado' }
  };
  
  if (filtros.localidad) {
    matchStage.id_localidad = new mongoose.Types.ObjectId(filtros.localidad);
  }
  
  if (filtros.genero) {
    matchStage.genero = filtros.genero;
  }
  
  if (filtros.categoria) {
    matchStage.categoria_producto = filtros.categoria;
  }
  
  if (filtros.fechaInicio && filtros.fechaFin) {
    matchStage.fecha_registro = {
      $gte: new Date(filtros.fechaInicio),
      $lte: new Date(filtros.fechaFin)
    };
  }
  
  pipeline.push({ $match: matchStage });
  
  // Agregaciones para estadísticas
  pipeline.push({
    $group: {
      _id: null,
      total_vendedores: { $sum: 1 },
      vendedores_activos: {
        $sum: { $cond: [{ $eq: ['$estado_vendedor', 'activo'] }, 1, 0] }
      },
      vendedores_inactivos: {
        $sum: { $cond: [{ $eq: ['$estado_vendedor', 'inactivo'] }, 1, 0] }
      },
      distribucion_genero: {
        $push: '$genero'
      },
      categorias_productos: {
        $push: '$categoria_producto'
      }
    }
  });
  
  return Vendedor.aggregate(pipeline);
};

// Método para obtener información pública de la entidad (sin datos sensibles)
EntidadGubernamentalSchema.methods.toPublicJSON = function () {
  const entidad = this.toObject();
  delete entidad.password;
  delete entidad.historial_descargas;
  delete entidad.ultima_sesion;
  delete entidad.__v;
  return entidad;
};

// Método para obtener resumen de actividad
EntidadGubernamentalSchema.methods.obtenerResumenActividad = function () {
  const totalDescargas = this.historial_descargas.length;
  const descargasRecientes = this.historial_descargas.filter(
    descarga => descarga.fecha_descarga > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  return {
    total_descargas: totalDescargas,
    descargas_ultimo_mes: descargasRecientes,
    ultimo_acceso: this.ultima_sesion?.fecha_acceso || null,
    estado: this.estado_entidad,
    permisos_activos: this.permisos
  };
};

module.exports = mongoose.model('EntidadGubernamental', EntidadGubernamentalSchema);