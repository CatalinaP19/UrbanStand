// scripts/poblarVendedores.js
require('dotenv').config();
const mongoose = require('mongoose');
const Vendedor = require('../models/Vendedor');
const Localidad = require('../models/Localidad');

// Datos de ejemplo variados
const nombres = [
  'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofia',
  'Miguel', 'Valentina', 'Andrés', 'Camila', 'Felipe', 'Isabella', 'Santiago',
  'Mariana', 'Sebastián', 'Daniela', 'Alejandro', 'Gabriela', 'Mateo', 'Natalia',
  'David', 'Paula', 'Nicolás', 'Andrea', 'Jorge', 'Carolina', 'Luis', 'Juliana',
  'Ricardo', 'Marcela', 'Oscar', 'Paola', 'Héctor', 'Catalina', 'Raúl', 'Diana',
  'Fernando', 'Adriana', 'Gustavo', 'Claudia', 'Mauricio', 'Sandra', 'Roberto', 'Luisa'
];

const apellidos = [
  'García', 'Rodríguez', 'Martínez', 'Hernández', 'López', 'González', 'Pérez', 'Sánchez',
  'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales',
  'Reyes', 'Jiménez', 'Gutiérrez', 'Ruiz', 'Mendoza', 'Vargas', 'Castro', 'Ortiz',
  'Silva', 'Romero', 'Alvarez', 'Núñez', 'Medina', 'Guerrero', 'Rios', 'Herrera',
  'Aguilar', 'Vega', 'Moreno', 'Campos', 'Ramos', 'Delgado', 'Rojas', 'Castillo'
];

const productos = [
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
];

const generos = ['masculino', 'femenino', 'otro'];
const tiposDoc = ['CC', 'CE', 'TI', 'PA'];
const vigencias = ['activo', 'inactivo'];

// Función para generar número aleatorio
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para seleccionar elemento aleatorio
function randomItem(array) {
  return array[randomInt(0, array.length - 1)];
}

// Función para generar email único
function generarEmail(nombre, apellido, index) {
  const nombreLimpio = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const apellidoLimpio = apellido.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return `${nombreLimpio}.${apellidoLimpio}${index}@email.com`;
}

// Función para generar dirección realista de Bogotá
function generarDireccion() {
  const tipos = ['Calle', 'Carrera', 'Transversal', 'Diagonal'];
  const tipo = randomItem(tipos);
  const numero1 = randomInt(1, 200);
  const letra = String.fromCharCode(randomInt(65, 90)); // A-Z
  const numero2 = randomInt(1, 100);
  const numero3 = randomInt(1, 99);
  
  return `${tipo} ${numero1}${Math.random() > 0.7 ? letra : ''} #${numero2}-${numero3}`;
}

// Función para generar fecha aleatoria en el último año
function generarFechaAleatoria() {
  const ahora = new Date();
  const unAnoAtras = new Date(ahora.getFullYear() - 1, ahora.getMonth(), ahora.getDate());
  const diferencia = ahora.getTime() - unAnoAtras.getTime();
  const fechaAleatoria = new Date(unAnoAtras.getTime() + Math.random() * diferencia);
  return fechaAleatoria;
}

// Función principal para poblar vendedores
async function poblarVendedores(cantidad = 100) {
  try {
    console.log('🚀 Iniciando población de vendedores...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todas las localidades
    const localidades = await Localidad.find();
    if (localidades.length === 0) {
      console.error('❌ Error: No hay localidades en la base de datos.');
      console.log('💡 Ejecuta primero: npm run poblar-localidades\n');
      process.exit(1);
    }
    console.log(`📍 ${localidades.length} localidades encontradas\n`);

    // Limpiar vendedores existentes (opcional)
    const respuesta = process.argv.includes('--limpiar');
    if (respuesta) {
      await Vendedor.deleteMany({});
      console.log('🗑️  Vendedores anteriores eliminados\n');
    }

    const vendedoresExistentes = await Vendedor.countDocuments();
    console.log(`📊 Vendedores actuales en BD: ${vendedoresExistentes}\n`);

    // Generar vendedores
    console.log(`🔄 Generando ${cantidad} vendedores...\n`);
    
    const vendedoresCreados = [];
    const batchSize = 50; // Insertar en lotes de 50
    let exitosos = 0;
    let errores = 0;

    for (let i = 0; i < cantidad; i++) {
      try {
        const nombre = randomItem(nombres);
        const apellido = randomItem(apellidos);
        const genero = randomItem(generos);
        const localidad = randomItem(localidades);
        
        // Seleccionar 1-3 productos aleatorios
        const numProductos = randomInt(1, 3);
        const productosSeleccionados = [];
        for (let j = 0; j < numProductos; j++) {
          const producto = randomItem(productos);
          if (!productosSeleccionados.includes(producto)) {
            productosSeleccionados.push(producto);
          }
        }

        const vendedor = {
          firstName: nombre,
          lastName: apellido,
          email: generarEmail(nombre, apellido, vendedoresExistentes + i),
          password: 'Password123', // Contraseña por defecto para pruebas
          numDoc: String(1000000000 + randomInt(0, 999999999)).slice(0, 10),
          NumTel: `3${randomInt(100000000, 199999999)}`,
          TypeDoc: randomItem(tiposDoc),
          genero: genero,
          direccion: generarDireccion(),
          id_localidad: localidad._id,
          rivi: 'documento-ejemplo.pdf',
          vigencia: Math.random() > 0.2 ? 'activo' : 'inactivo', // 80% activos, 20% inactivos
          selectedProducts: productosSeleccionados,
          fecha_registro: generarFechaAleatoria()
        };

        vendedoresCreados.push(vendedor);

        // Insertar en lotes
        if (vendedoresCreados.length === batchSize || i === cantidad - 1) {
          try {
            await Vendedor.insertMany(vendedoresCreados, { ordered: false });
            exitosos += vendedoresCreados.length;
            console.log(`✅ Insertados ${exitosos}/${cantidad} vendedores`);
            vendedoresCreados.length = 0; // Limpiar array
          } catch (error) {
            if (error.code === 11000) {
              // Error de duplicados, contar cuántos se insertaron exitosamente
              const insertados = error.result?.nInserted || 0;
              exitosos += insertados;
              errores += vendedoresCreados.length - insertados;
              console.log(`⚠️  Algunos duplicados detectados (${insertados} insertados, ${vendedoresCreados.length - insertados} duplicados)`);
            } else {
              throw error;
            }
            vendedoresCreados.length = 0;
          }
        }

      } catch (error) {
        errores++;
        console.error(`❌ Error en vendedor ${i + 1}:`, error.message);
      }
    }

    console.log('\n📊 RESUMEN:');
    console.log(`✅ Vendedores insertados exitosamente: ${exitosos}`);
    console.log(`❌ Errores/Duplicados: ${errores}`);
    console.log(`📈 Total en BD ahora: ${await Vendedor.countDocuments()}\n`);

    // Mostrar estadísticas por localidad
    console.log('📍 DISTRIBUCIÓN POR LOCALIDAD:');
    for (const localidad of localidades) {
      const count = await Vendedor.countDocuments({ id_localidad: localidad._id });
      console.log(`   ${localidad.nombre}: ${count} vendedores`);
    }

    // Estadísticas por género
    console.log('\n👥 DISTRIBUCIÓN POR GÉNERO:');
    const porGenero = await Vendedor.aggregate([
      { $group: { _id: '$genero', count: { $sum: 1 } } }
    ]);
    porGenero.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} vendedores`);
    });

    // Estadísticas por vigencia
    console.log('\n📊 DISTRIBUCIÓN POR ESTADO:');
    const porVigencia = await Vendedor.aggregate([
      { $group: { _id: '$vigencia', count: { $sum: 1 } } }
    ]);
    porVigencia.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} vendedores`);
    });

    console.log('\n🎉 Población completada exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar script
const cantidad = parseInt(process.argv[2]) || 100;
console.log(`\n${'='.repeat(60)}`);
console.log(`  SCRIPT DE POBLACIÓN MASIVA DE VENDEDORES`);
console.log(`${'='.repeat(60)}\n`);
console.log(`📝 Cantidad a generar: ${cantidad} vendedores`);
console.log(`🗑️  Limpiar antes: ${process.argv.includes('--limpiar') ? 'SÍ' : 'NO'}\n`);

poblarVendedores(cantidad);