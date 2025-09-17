// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Vendedor = require('../models/Vendedor');

const router = express.Router();

// Middleware para validar errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      details: errors.array()
    });
  }
  next();
};

// Middleware de autenticación JWT (JSON Web Tokens)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
      message: 'Debes incluir un token en el header Authorization: Bearer <token>'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, vendedor) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido o expirado',
        message: 'El token proporcionado no es válido'
      });
    }
    req.vendedor = vendedor;
    next();
  });
};

// Definir las categorías válidas
const validCategories = [
  'comidas preparadas',
  'bebidas',
  'confiteria',
  'frutas y verduras',
  'productos textiles',
  'calzado',
  'bisuteria y accesorios',
  'jugeteria',
  'articulos de temporada',
  'cigarrillos y tabaco',
  'electronicos y accesorios',
  'arreglos florales',
  'papeleria y utiles escolares',
  'productos varios(para el hogar)',
  'productos de higiene y cuidado personal',
  's.lustrado de calzado',
  's.reparacion de calzado',
  's.reparacion de celulares y electrónicos',
  's.ambulantes de aseo y apoyo',
  'otros'
];

// REGISTRO DE VENDEDOR
router.post('/register', [
  // Validaciones
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 10 }).withMessage('El nombre debe tener entre 3 y 10 caracteres'),

  body('apellido')
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 3, max: 15 }).withMessage('El apellido debe tener entre 3 y 15 caracteres'),

  body('correo')
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail(),

  body('contrasenia')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

  body('numero_documento')
    .notEmpty().withMessage('El número de documento es requerido')
    .isLength({ min: 6, max: 20 }).withMessage('El número de documento debe tener entre 6 y 20 caracteres'),

  body('numero_celular')
    .isMobilePhone('es-CO').withMessage('Debe ser un número de celular válido de Colombia'),

  body('tipo_documento')
    .isIn(['CC', 'CE', 'TI', 'PA']).withMessage('Tipo de documento debe ser: CC, CE, TI, o PA'),

  body('genero')
    .isIn(['M', 'F', 'O']).withMessage('Género debe ser: M, F, u O'),

  body('categoria_producto')
    .custom(value => {
      // Convertir el valor a minúsculas y comprobar si está en las categorías válidas
      return validCategories.includes(value.trim().toLowerCase());
    })
    .withMessage('Categoría de producto no válida'),

  body('direccion_puesto_trabajo')
    .notEmpty().withMessage('La dirección del puesto de trabajo es requerida')

], handleValidationErrors, async (req, res) => {
  try {
    const {
      nombre, apellido, correo, contrasenia, numero_documento,
      numero_celular, tipo_documento, genero, categoria_producto,
      direccion_puesto_trabajo
    } = req.body;

    // Verificar si ya existe un vendedor con ese correo o documento
    const vendedorExistente = await Vendedor.findOne({
      $or: [{ correo }, { numero_documento }]
    });

    if (vendedorExistente) {
      return res.status(409).json({
        error: "Vendedor ya registrado",
        message: vendedorExistente.correo === correo
          ? "Ya existe un vendedor con este correo electrónico"
          : "Ya existe un vendedor con este número de documento"
      });
    }

    // Crear nuevo vendedor
    const nuevoVendedor = new Vendedor({
      nombre,
      apellido,
      correo,
      contrasenia,
      numero_documento,
      numero_celular,
      tipo_documento,
      genero,
      categoria_producto,
      direccion_puesto_trabajo
    });

    await nuevoVendedor.save();

    // Generar JWT token
    const token = jwt.sign(
      { vendedorId: nuevoVendedor._id, correo: nuevoVendedor.correo, nombre: nuevoVendedor.nombre, apellido: nuevoVendedor.apellido },
      process.env.JWT_SECRET, { expiresIn: '24h' }
    );

    // Respuesta exitosa
    res.status(201).json({
      message: "Vendedor registrado exitosamente",
      token,
      vendedor: nuevoVendedor.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en registro:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        error: "Datos duplicados",
        message: `Ya existe un vendedor con este ${field === 'correo' ? 'correo electrónico' : 'número de documento'}`
      });
    }

    res.status(500).json({
      error: "Error interno del servidor",
      message: "No se pudo registrar el vendedor"
    });
  }
});

// ACTUALIZAR PERFIL (RUTA PROTEGIDA)
router.put('/profile', authenticateToken, [
  body('nombre').optional().isLength({ min: 2, max: 100 }),
  body('apellido').optional().isLength({ min: 2, max: 100 }),
  body('numero_celular').optional().isMobilePhone('es-CO'),
  body('direccion_puesto_trabajo').optional().notEmpty(),
  body('categoria_producto')
    .custom(value => {
      return validCategories.includes(value.trim().toLowerCase());
    })
    .withMessage('Categoría de producto no válida')
], handleValidationErrors, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.correo;
    delete updates.numero_documento;
    delete updates.tipo_documento;
    delete updates.contrasenia;
    delete updates._id;
    delete updates.estado_vendedor;

    const vendedor = await Vendedor.findByIdAndUpdate(req.vendedor.vendedorId, updates, { new: true, runValidators: true }).select('-contrasenia');

    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    res.json({
      message: "Perfil actualizado exitosamente",
      vendedor: vendedor.toPublicJSON()
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el perfil'
    });
  }
});

module.exports = router;
