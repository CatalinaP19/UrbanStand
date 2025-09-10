// modelo/Vendedor.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VendedorSchema = new mongoose.Schema({
  // Información personal básica del vendedor
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    maxlength: [100, 'El apellido no puede exceder 100 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [150, 'El correo no puede exceder 150 caracteres'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  contrasenia: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  
  // Información de identificación
  tipo_documento: {
    type: String,
    required: [true, 'El tipo de documento es requerido'],
    enum: {
      values: ['CC', 'CE', 'TI', 'PA'],
      message: 'Tipo de documento debe ser: CC, CE, TI, o PA'
    },
    default: 'CC'
  },
  numero_documento: {
    type: String,
    required: [true, 'El número de documento es requerido'],
    unique: true,
    trim: true,
    maxlength: [20, 'El número de documento no puede exceder 20 caracteres']
  },
  numero_celular: {
    type: String,
    required: [true, 'El número de celular es requerido'],
    trim: true,
    maxlength: [15, 'El número de celular no puede exceder 15 caracteres']
  },
  
  // Información demográfica
  genero: {
    type: String,
    enum: {
      values: ['M', 'F', 'O'],
      message: 'Género debe ser: M (Masculino), F (Femenino), u O (Otro)'
    },
    required: [true, 'El género es requerido']
  },
  
  // Información laboral
  direccion_puesto_trabajo: {
    type: String,
    required: [true, 'La dirección del puesto de trabajo es requerida'],
    trim: true
  },
  categoria_producto: {
    type: String,
    required: [true, 'La categoría de producto es requerida'],
    enum: {
      values: [
        'comida_bebidas',
        'ropa_accesorios', 
        'electrodomesticos',
        'servicios',
        'frutas_verduras',
        'dulces_snacks',
        'artesanias',
        'otros'
      ],
      message: 'Categoría de producto no válida'
    }
  },
  
  // Estado y control
  estado_vendedor: {
    type: String,
    enum: {
      values: ['activo', 'inactivo', 'suspendido', 'eliminado'],
      message: 'Estado de vendedor no válido'
    },
    default: 'activo'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  
  // Ubicación en tiempo real
  ubicacion_actual: {
    latitud: {
      type: Number,
      min: [-90, 'Latitud debe estar entre -90 y 90'],
      max: [90, 'Latitud debe estar entre -90 y 90']
    },
    longitud: {
      type: Number,
      min: [-180, 'Longitud debe estar entre -180 y 180'],
      max: [180, 'Longitud debe estar entre -180 y 180']
    },
    ultima_actualizacion: {
      type: Date,
      default: Date.now
    }
  },
  
  // Referencias a otras entidades
  id_localidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localidad',
    required: false
  },
  id_entidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EntidadGubernamental',
    required: false
  }
}, {
  timestamps: true,
  collection: 'vendedores'
});

// Índices para optimizar consultas
VendedorSchema.index({ correo: 1 });
VendedorSchema.index({ numero_documento: 1 });
VendedorSchema.index({ estado_vendedor: 1 });
VendedorSchema.index({ categoria_producto: 1 });
VendedorSchema.index({ 
  "ubicacion_actual.latitud": 1, 
  "ubicacion_actual.longitud": 1 
});

// Middleware para encriptar contraseña antes de guardar
VendedorSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada o es nueva
  if (!this.isModified('contrasenia')) return next();
  
  try {
    // Hash de la contraseña(representa la contraseña como unica pasandola de un texto plano a una cadena alfa numerica)
    const salt = await bcrypt.genSalt(12);
    this.contrasenia = await bcrypt.hash(this.contrasenia, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
VendedorSchema.methods.compararContrasenia = async function(contrasenia) {
  return await bcrypt.compare(contrasenia, this.contrasenia);
};

// Método para actualizar ubicación
VendedorSchema.methods.actualizarUbicacion = function(latitud, longitud) {
  this.ubicacion_actual = {
    latitud,
    longitud,
    ultima_actualizacion: new Date()
  };
  return this.save();
};

// Método estático para encontrar vendedores cercanos
VendedorSchema.statics.encontrarCercanos = function(latitud, longitud, radioKm = 5) {
  // Convertir km a grados aproximadamente (1 grado ≈ 111 km)
  const radioGrados = radioKm / 111;
  
  return this.find({
    estado_vendedor: 'activo',
    'ubicacion_actual.latitud': { 
      $exists: true,
      $gte: latitud - radioGrados,
      $lte: latitud + radioGrados
    },
    'ubicacion_actual.longitud': { 
      $exists: true,
      $gte: longitud - radioGrados,
      $lte: longitud + radioGrados
    }
  }).select('-contrasenia');
};

// Método para obtener información pública del vendedor
VendedorSchema.methods.toPublicJSON = function() {
  const vendedor = this.toObject();
  delete vendedor.contrasenia;
  delete vendedor.__v;
  return vendedor;
};

module.exports = mongoose.model('Vendedor', VendedorSchema);