// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Ruta para obtener estadísticas del dashboard
router.get('/estadisticas', dashboardController.obtenerEstadisticasDashboard);

// Ruta para obtener lista de localidades
router.get('/localidades', dashboardController.obtenerLocalidades);

module.exports = router;