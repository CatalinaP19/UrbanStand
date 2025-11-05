// scripts/poblarLocalidades.js
require('dotenv').config();
const mongoose = require('mongoose');
const Localidad = require('../models/Localidad');

const localidadesBogota = [
  { nombre: 'Usaquén', codigo: '01' },
  { nombre: 'Chapinero', codigo: '02' },
  { nombre: 'Santa Fe', codigo: '03' },
  { nombre: 'San Cristóbal', codigo: '04' },
  { nombre: 'Usme', codigo: '05' },
  { nombre: 'Tunjuelito', codigo: '06' },
  { nombre: 'Bosa', codigo: '07' },
  { nombre: 'Kennedy', codigo: '08' },
  { nombre: 'Fontibón', codigo: '09' },
  { nombre: 'Engativá', codigo: '10' },
  { nombre: 'Suba', codigo: '11' },
  { nombre: 'Barrios Unidos', codigo: '12' },
  { nombre: 'Teusaquillo', codigo: '13' },
  { nombre: 'Los Mártires', codigo: '14' },
  { nombre: 'Antonio Nariño', codigo: '15' },
  { nombre: 'Puente Aranda', codigo: '16' },
  { nombre: 'La Candelaria', codigo: '17' },
  { nombre: 'Rafael Uribe Uribe', codigo: '18' },
  { nombre: 'Ciudad Bolívar', codigo: '19' },
  { nombre: 'Sumapaz', codigo: '20' }
];

async function poblarLocalidades() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección existente (opcional)
    await Localidad.deleteMany({});
    console.log('🗑️  Localidades anteriores eliminadas');

    // Insertar localidades
    const resultado = await Localidad.insertMany(localidadesBogota);
    console.log(`✅ ${resultado.length} localidades insertadas exitosamente`);

    // Mostrar las localidades insertadas
    console.log('\n📍 Localidades insertadas:');
    resultado.forEach(loc => {
      console.log(`   - ${loc.codigo}: ${loc.nombre} (ID: ${loc._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar localidades:', error);
    process.exit(1);
  }
}

// Ejecutar script
poblarLocalidades();