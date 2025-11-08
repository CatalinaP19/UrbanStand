// controllers/dashboardController.js
const Vendedor = require('../models/Vendedor');
const Localidad = require('../models/Localidad');

// Obtener estadísticas del dashboard
exports.obtenerEstadisticasDashboard = async (req, res) => {
  try {
    console.log('📊 Solicitando estadísticas del dashboard...');

    // 1. RESUMEN GENERAL
    const activos = await Vendedor.countDocuments({ vigencia: 'activo' });
    const inactivos = await Vendedor.countDocuments({ vigencia: 'inactivo' });
    const total = activos + inactivos;

    console.log(`✅ Total vendedores: ${total} (Activos: ${activos}, Inactivos: ${inactivos})`);

    // Calcular crecimiento
    const crecimiento = total > 0 
      ? Math.round(((activos - inactivos) / total) * 100) 
      : 0;

    // 2. VENDEDORES POR LOCALIDAD
    const vendedoresPorLocalidad = await Vendedor.aggregate([
      {
        $lookup: {
          from: 'localidades', // ⚠️ Verifica que este sea el nombre correcto
          localField: 'id_localidad',
          foreignField: '_id',
          as: 'localidad'
        }
      },
      { 
        $unwind: { 
          path: '$localidad', 
          preserveNullAndEmptyArrays: true 
        } 
      },
      {
        $group: {
          _id: '$localidad.nombre',
          activos: {
            $sum: { $cond: [{ $eq: ['$vigencia', 'activo'] }, 1, 0] }
          },
          inactivos: {
            $sum: { $cond: [{ $eq: ['$vigencia', 'inactivo'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    console.log(`📍 Vendedores por localidad: ${vendedoresPorLocalidad.length} localidades`);

    // 3. VENDEDORES POR GÉNERO
    const vendedoresPorGenero = await Vendedor.aggregate([
      { $match: { vigencia: 'activo' } },
      {
        $group: {
          _id: '$genero',
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    console.log(`👥 Vendedores por género:`, vendedoresPorGenero);

    // 4. TABLA DETALLADA
    const tablaDetallada = await Vendedor.aggregate([
      {
        $lookup: {
          from: 'localidades',
          localField: 'id_localidad',
          foreignField: '_id',
          as: 'localidad'
        }
      },
      { 
        $unwind: { 
          path: '$localidad', 
          preserveNullAndEmptyArrays: true 
        } 
      },
      {
        $group: {
          _id: {
            localidad: '$localidad.nombre',
            genero: '$genero',
            estado: '$vigencia'
          },
          cantidad: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            localidad: '$_id.localidad',
            genero: '$_id.genero'
          },
          activos: {
            $sum: {
              $cond: [{ $eq: ['$_id.estado', 'activo'] }, '$cantidad', 0]
            }
          },
          inactivos: {
            $sum: {
              $cond: [{ $eq: ['$_id.estado', 'inactivo'] }, '$cantidad', 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          localidad: { $ifNull: ['$_id.localidad', 'Sin localidad'] },
          genero: '$_id.genero',
          activos: 1,
          inactivos: 1,
          total: { $add: ['$activos', '$inactivos'] }
        }
      },
      { $sort: { localidad: 1, genero: 1 } }
    ]);

    console.log(`📋 Tabla detallada: ${tablaDetallada.length} filas generadas`);

    // RESPUESTA
    res.json({
      success: true,
      data: {
        resumen: {
          activos,
          inactivos,
          total,
          crecimiento
        },
        porLocalidad: vendedoresPorLocalidad,
        porGenero: vendedoresPorGenero,
        tablaDetallada
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas del dashboard',
      error: error.message
    });
  }
};

// Obtener lista de localidades
exports.obtenerLocalidades = async (req, res) => {
  try {
    console.log('📍 Obteniendo lista de localidades...');
    
    const localidades = await Localidad.find({}, { nombre: 1 }).sort({ nombre: 1 });
    
    console.log(`✅ ${localidades.length} localidades encontradas`);

    res.json({
      success: true,
      data: localidades
    });

  } catch (error) {
    console.error('❌ Error obteniendo localidades:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener localidades',
      error: error.message
    });
  }
};