// services/estadisticasService.js
const Vendedor = require('../models/Vendedor');
const mongoose = require('mongoose');

class EstadisticasService {
  
  // Obtener conteos básicos (activos, inactivos, total)
  async obtenerConteos(filtros = {}) {
    const query = this.construirQuery(filtros);
    
    const [activos, inactivos, total] = await Promise.all([
      Vendedor.countDocuments({ ...query, vigencia: 'activo' }),
      Vendedor.countDocuments({ ...query, vigencia: 'inactivo' }),
      Vendedor.countDocuments(query)
    ]);

    return { activos, inactivos, total };
  }

  // Obtener distribución por género
  async obtenerDistribucionGenero(filtros = {}) {
    const query = this.construirQuery(filtros);
    
    return await Vendedor.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$genero',
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$cantidad',
          _id: 0
        }
      }
    ]);
  }

  // Obtener vendedores por localidad
  async obtenerPorLocalidad(filtros = {}) {
    const query = this.construirQuery(filtros);
    
    return await Vendedor.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'localidades',
          localField: 'id_localidad',
          foreignField: '_id',
          as: 'localidad_info'
        }
      },
      { $unwind: '$localidad_info' },
      {
        $group: {
          _id: '$id_localidad',
          localidad: { $first: '$localidad_info.nombre' },
          vendedores: { $sum: 1 }
        }
      },
      {
        $project: {
          localidad: 1,
          vendedores: 1,
          _id: 0
        }
      },
      { $sort: { localidad: 1 } }
    ]);
  }

  // Obtener tabla detallada (por localidad y género)
  async obtenerTablaDetallada(filtros = {}) {
    const query = this.construirQuery(filtros);
    
    return await Vendedor.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'localidades',
          localField: 'id_localidad',
          foreignField: '_id',
          as: 'localidad_info'
        }
      },
      { $unwind: '$localidad_info' },
      {
        $group: {
          _id: {
            localidad: '$id_localidad',
            genero: '$genero'
          },
          localidad: { $first: '$localidad_info.nombre' },
          activos: {
            $sum: { $cond: [{ $eq: ['$vigencia', 'activo'] }, 1, 0] }
          },
          inactivos: {
            $sum: { $cond: [{ $eq: ['$vigencia', 'inactivo'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          localidad: 1,
          genero: '$_id.genero',
          activos: 1,
          inactivos: 1,
          total: 1,
          _id: 0
        }
      },
      { $sort: { localidad: 1, genero: 1 } }
    ]);
  }

  // Calcular crecimiento (comparar último mes con anterior)
  async calcularCrecimiento() {
    const hoy = new Date();
    const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);

    const [vendedoresMesActual, vendedoresMesAnterior] = await Promise.all([
      Vendedor.countDocuments({
        fecha_registro: { $gte: inicioMesActual },
        vigencia: 'activo'
      }),
      Vendedor.countDocuments({
        fecha_registro: { 
          $gte: inicioMesAnterior,
          $lt: inicioMesActual
        },
        vigencia: 'activo'
      })
    ]);

    if (vendedoresMesAnterior === 0) return 0;
    
    const crecimiento = ((vendedoresMesActual - vendedoresMesAnterior) / vendedoresMesAnterior) * 100;
    return Math.round(crecimiento);
  }

  // Construir query con filtros opcionales
  construirQuery(filtros) {
    const query = {};

    // Filtro por localidad
    if (filtros.localidad && filtros.localidad !== 'Todas') {
      // Si es un ObjectId válido, usarlo directamente
      if (mongoose.Types.ObjectId.isValid(filtros.localidad)) {
        query.id_localidad = new mongoose.Types.ObjectId(filtros.localidad);
      }
    }

    // Filtro por género
    if (filtros.genero && filtros.genero !== 'Todos') {
      query.genero = filtros.genero.toLowerCase();
    }

    // Filtro por estado
    if (filtros.estado) {
      const estado = filtros.estado.toLowerCase();
      if (estado === 'activos') {
        query.vigencia = 'activo';
      } else if (estado === 'inactivos') {
        query.vigencia = 'inactivo';
      }
    }

    // Filtro por fecha
    if (filtros.fechaInicio) {
      query.fecha_registro = {
        $gte: new Date(filtros.fechaInicio)
      };
      
      if (filtros.fechaFin) {
        query.fecha_registro.$lte = new Date(filtros.fechaFin);
      }
    }

    return query;
  }
}

module.exports = new EstadisticasService();