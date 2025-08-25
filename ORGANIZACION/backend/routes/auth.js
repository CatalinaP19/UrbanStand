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

// Middleware de autenticación JWT
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

// REGISTRO DE VENDEDOR
router.post('/register', [
  // Validaciones
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('apellido')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
    
  body('correo')
    .isEmail()
    .withMessage('Debe ser un correo válido')
    .normalizeEmail(),
    
  body('contrasenia')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
    
  body('numero_documento')
    .notEmpty()
    .withMessage('El número de documento es requerido')
    .isLength({ min: 6, max: 20 })
    .withMessage('El número de documento debe tener entre 6 y 20 caracteres'),
    
  body('numero_celular')
    .isMobilePhone('es-CO')
    .withMessage('Debe ser un número de celular válido de Colombia'),
    
  body('tipo_documento')
    .isIn(['CC', 'CE', 'TI', 'PA'])
    .withMessage('Tipo de documento debe ser: CC, CE, TI, o PA'),
    
  body('genero')
    .isIn(['M', 'F', 'O'])
    .withMessage('Género debe ser: M, F, u O'),
    
  body('categoria_producto')
    .isIn(['comida_bebidas', 'ropa_accesorios', 'electrodomesticos', 'servicios', 'frutas_verduras', 'dulces_snacks', 'artesanias', 'otros'])
    .withMessage('Categoría de producto no válida'),
    
  body('direccion_puesto_trabajo')
    .notEmpty()
    .withMessage('La dirección del puesto de trabajo es requerida')
    
], handleValidationErrors, async (req, res) => {
  try {
    const {
      nombre, apellido, correo, contrasenia, numero_documento,
      numero_celular, tipo_documento, genero, categoria_producto,
      direccion_puesto_trabajo
    } = req.body;

    // Verificar si ya existe un vendedor con ese correo o documento
    const vendedorExistente = await Vendedor.findOne({
      $or: [
        { correo },
        { numero_documento }
      ]
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
      contrasenia, // Se encriptará automáticamente por el middleware pre('save')
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
      { 
        vendedorId: nuevoVendedor._id,
        correo: nuevoVendedor.correo,
        nombre: nuevoVendedor.nombre,
        apellido: nuevoVendedor.apellido
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    res.status(201).json({
      message: "Vendedor registrado exitosamente",
      token,
      vendedor: nuevoVendedor.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    // Error de duplicado de MongoDB
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

// LOGIN DE VENDEDOR
router.post('/login', [
  body('correo')
    .isEmail()
    .withMessage('Debe ser un correo válido')
    .normalizeEmail(),
  body('contrasenia')
    .notEmpty()
    .withMessage('La contraseña es requerida')
], handleValidationErrors, async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    // Buscar vendedor por correo
    const vendedor = await Vendedor.findOne({ correo });
    if (!vendedor) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        message: "Correo o contraseña incorrectos"
      });
    }

    // Verificar si el vendedor está activo
    if (vendedor.estado_vendedor === 'suspendido') {
      return res.status(403).json({
        error: "Cuenta suspendida",
        message: "Tu cuenta ha sido suspendida. Contacta al administrador."
      });
    }

    if (vendedor.estado_vendedor === 'eliminado') {
      return res.status(403).json({
        error: "Cuenta eliminada",
        message: "Esta cuenta ya no está disponible."
      });
    }

    // Verificar contraseña usando el método del modelo
    const esContrasenaValida = await vendedor.compararContrasenia(contrasenia);
    if (!esContrasenaValida) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        message: "Correo o contraseña incorrectos"
      });
    }

    // Actualizar estado a activo si está inactivo
    if (vendedor.estado_vendedor === 'inactivo') {
      vendedor.estado_vendedor = 'activo';
      await vendedor.save();
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        vendedorId: vendedor._id,
        correo: vendedor.correo,
        nombre: vendedor.nombre,
        apellido: vendedor.apellido,
        estado: vendedor.estado_vendedor
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    res.status(200).json({
      message: "Login exitoso",
      token,
      vendedor: vendedor.toPublicJSON()
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: "No se pudo procesar el login"
    });
  }
});

// OBTENER PERFIL (RUTA PROTEGIDA)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.vendedor.vendedorId)
      .select('-contrasenia')
      .populate('id_localidad', 'nombre_localidad')
      .populate('id_entidad', 'nombre_entidad');

    if (!vendedor) {
      return res.status(404).json({ 
        error: 'Vendedor no encontrado',
        message: 'El vendedor asociado al token no existe'
      });
    }

    res.json({
      message: "Perfil obtenido exitosamente",
      vendedor: vendedor.toPublicJSON()
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el perfil'
    });
  }
});

// ACTUALIZAR PERFIL (RUTA PROTEGIDA)
router.put('/profile', authenticateToken, [
  body('nombre').optional().isLength({ min: 2, max: 100 }),
  body('apellido').optional().isLength({ min: 2, max: 100 }),
  body('numero_celular').optional().isMobilePhone('es-CO'),
  body('direccion_puesto_trabajo').optional().notEmpty(),
  body('categoria_producto').optional().isIn(['comida_bebidas', 'ropa_accesorios', 'electrodomesticos', 'servicios', 'frutas_verduras', 'dulces_snacks', 'artesanias', 'otros'])
], handleValidationErrors, async (req, res) => {
  try {
    const updates = req.body;
    
    // Campos que no se pueden actualizar
    delete updates.correo;
    delete updates.numero_documento;
    delete updates.tipo_documento;
    delete updates.contrasenia;
    delete updates._id;
    delete updates.estado_vendedor;

    const vendedor = await Vendedor.findByIdAndUpdate(
      req.vendedor.vendedorId,
      updates,
      { new: true, runValidators: true }
    ).select('-contrasenia');

    if (!vendedor) {
      return res.status(404).json({ 
        error: 'Vendedor no encontrado' 
      });
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

// Exportar router y middleware
module.exports = { router, authenticateToken };