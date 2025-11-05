// models/Localidad.js
const mongoose = require('mongoose');

const LocalidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la localidad es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código de la localidad es requerido'],
    unique: true,
    trim: true,
    maxlength: [5, 'El código no puede exceder 5 caracteres']
  }
}, {
  timestamps: true,
  collection: 'localidades'
});

// Índices para optimizar búsquedas
LocalidadSchema.index({ nombre: 1 });
LocalidadSchema.index({ codigo: 1 });

// Método para obtener todas las localidades ordenadas
LocalidadSchema.statics.obtenerTodas = function() {
  return this.find().sort('nombre');
};

// Método para buscar por código
LocalidadSchema.statics.buscarPorCodigo = function(codigo) {
  return this.findOne({ codigo });
};

module.exports = mongoose.model('Localidad', LocalidadSchema);