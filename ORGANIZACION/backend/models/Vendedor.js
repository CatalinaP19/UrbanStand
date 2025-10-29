// modelo/Vendedor.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VendedorSchema = new mongoose.Schema({
  // Información personal básica del vendedor
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    maxlength: [100, 'El apellido no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [150, 'El correo no puede exceder 150 caracteres'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },

  // Información de identificación
  TypeDoc: {
    type: String,
    required: [true, 'El tipo de documento es requerido'],
    enum: {
      values: ['CC', 'CE', 'TI', 'PA'],
      message: 'Tipo de documento debe ser: CC, CE, TI, o PA'
    },
    default: 'CC'
  },
  numDoc: {
    type: String,
    required: [true, 'El número de documento es requerido'],
    unique: true,
    trim: true,
    maxlength: [10, 'El número de documento no puede exceder 10 caracteres']
  },
  NumTel: {
    type: String,
    required: [true, 'El número de celular es requerido'],
    trim: true,
    maxlength: [10, 'El número de celular no puede exceder 1 caracteres']
  },

  genero: {
    type: String,
    required: [true, 'El género es requerido'],
    set: function (valor) {
      // Normalizar a minúsculas
      const v = (valor || '').toLowerCase().trim();

      // Mapear variantes comunes
      if (v.includes('masc') || v === 'male' || v === 'm') return 'masculino';
      if (v.includes('fem') || v === 'female' || v === 'f') return 'femenino';
      if (v.includes('otr') || v === 'other' || v === 'o' || v === 'no binario') return 'otro';

      return v; // Si no coincide con nada, devolver el valor original
    },
    enum: {
      values: ['masculino', 'femenino', 'otro'],
      message: 'Género debe ser: masculino, femenino, u otro'
    }
  },

  // Información laboral
  direccion: {
    type: String,
    required: [true, 'La dirección del puesto de trabajo es requerida'],
    trim: true
  },
  rivi: {
    type: String,
    required: [true, 'La imagen del RIVI Y HEMI es requerida']
  },
  selectedProducts: [{
    type: String,
    required: true,
    enum: {
      values: [
        'Comidas preparadas',
        'Bebidas',
        'Confitería',
        'Frutas y verduras',
        'Productos textiles',
        'Calzado',
        'Bisutería y accesorios',
        'Juguetería',
        'Artículos de temporada',
        'Cigarrillos y tabaco',
        'Electrónicos y accesorios',
        'Arreglos florales',
        'Papelería y útiles escolares',
        'Productos varios (Para el hogar)',
        'S. Lustrado de calzado',
        'S. Reparación de calzado',
        'S. Reparación de celulares y electrónicos',
        'S. Ambulantes de aseo y apoyo',
        'Otros'
      ],
      message: 'Categoría de producto no válida'
    }
  }],

  // Estado y control
  vigencia: {
    type: String,
    enum: {
      values: ['activo', 'inactivo'],
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
    required: [true, 'La localidad es requerida']
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
VendedorSchema.index({ email: 1 });
VendedorSchema.index({ numDoc: 1 });
VendedorSchema.index({ vigencia: 1 });
VendedorSchema.index({ selectedProducts: 1 });
VendedorSchema.index({
  "ubicacion_actual.latitud": 1,
  "ubicacion_actual.longitud": 1
});

// Middleware para encriptar contraseña antes de guardar
VendedorSchema.pre('save', async function (next) {
  // Solo encriptar si la contraseña ha sido modificada o es nueva
  if (!this.isModified('password')) return next();

  try {
    // Hash de la contraseña(representa la contraseña como unica pasandola de un texto plano a una cadena alfa numerica)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
VendedorSchema.methods.compararContrasenia = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Método para actualizar ubicación
VendedorSchema.methods.actualizarUbicacion = function (latitud, longitud) {
  this.ubicacion_actual = {
    latitud,
    longitud,
    ultima_actualizacion: new Date()
  };
  return this.save();
};

// Método estático para encontrar vendedores cercanos
VendedorSchema.statics.encontrarCercanos = function (latitud, longitud, radioKm = 5) {
  // Convertir km a grados aproximadamente (1 grado ≈ 111 km)
  const radioGrados = radioKm / 111;

  return this.find({
    vigencia: 'activo',
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
  }).select('-password');
};

// Método para obtener información pública del vendedor
VendedorSchema.methods.toPublicJSON = function () {
  const vendedor = this.toObject();
  delete vendedor.password;
  delete vendedor.__v;
  return vendedor;
};

module.exports = mongoose.model('Vendedor', VendedorSchema);