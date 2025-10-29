// controllers/dashboardController.js
const estadisticasService = require('../services/estadisticasService');
const Localidad = require('../models/Localidad');

// Obtener todas las estadísticas para el dashboard
exports.obtenerEstadisticasDashboard = async (req, res) => {
  try {
    const filtros = {
      localidad: req.query.localidad,
      genero: req.query.genero,
      estado: req.query.estado,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin
    };

    const [conteos, genero, localidades, tabla, crecimiento] = await Promise.all([
      estadisticasService.obtenerConteos(filtros),
      estadisticasService.obtenerDistribucionGenero(filtros),
      estadisticasService.obtenerPorLocalidad(filtros),
      estadisticasService.obtenerTablaDetallada(filtros),
      estadisticasService.calcularCrecimiento()
    ]);

    res.json({
      success: true,
      data: {
        conteos: {
          activos: conteos.activos,
          inactivos: conteos.inactivos,
          total: conteos.total,
          crecimiento
        },
        distribucionGenero: genero,
        vendedoresPorLocalidad: localidades,
        tablaDetallada: tabla
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del dashboard',
      error: error.message
    });
  }
};

// Obtener lista de localidades para el filtro
exports.obtenerLocalidades = async (req, res) => {
  try {
    const localidades = await Localidad.find().select('nombre codigo _id').sort('nombre');
    res.json({
      success: true,
      data: localidades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener localidades',
      error: error.message
    });
  }
};