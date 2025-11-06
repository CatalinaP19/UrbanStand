// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const Vendedor = require("../models/Vendedor");
const Localidad = require("../models/Localidad");
const { enviarEmailConfirmacion } = require("../services/emailService");

const router = express.Router();

// Middleware para validar errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      details: errors.array(),
    });
  }
  next();
};

// Middleware de autenticación JWT(JSON Web Tokens)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Token de acceso requerido",
      message:
        "Debes incluir un token en el header Authorization: Bearer <token>",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, vendedor) => {
    if (err) {
      return res.status(403).json({
        error: "Token inválido o expirado",
        message: "El token proporcionado no es válido",
      });
    }
    req.vendedor = vendedor;
    next();
  });
};

// REGISTRO DE VENDEDOR
router.post(
  "/register",
  [
    // Validaciones
    body("firstName")
      .notEmpty()
      .withMessage("El nombre es requerido")
      .isLength({ min: 3, max: 10 })
      .withMessage("El nombre debe tener entre 3 y 10 caracteres"),

    body("lastName")
      .notEmpty()
      .withMessage("El apellido es requerido")
      .isLength({ min: 3, max: 15 })
      .withMessage("El apellido debe tener entre 3 y 15 caracteres"),

    body("email")
      .isEmail()
      .withMessage("Debe ser un correo válido")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),

    body("numDoc")
      .notEmpty()
      .withMessage("El número de documento es requerido")
      .isLength({ min: 6, max: 20 })
      .withMessage("El número de documento debe tener entre 6 y 20 caracteres"),

    body("NumTel")
      .isMobilePhone("es-CO")
      .withMessage("Debe ser un número de celular válido de Colombia"),

    body("TypeDoc")
      .isIn(["CC", "CE", "TI", "PA"])
      .withMessage("Tipo de documento debe ser: CC, CE, TI, o PA"),

    body("genero")
      .isIn(["masculino", "femenino", "otro"])
      .withMessage("Género debe ser: masculino, femenino, u otro"),

    body("rivi")
      .notEmpty()
      .withMessage("La imagen del RIVI Y HEMI es requerida"),

    body("selectedProducts")
      .isArray()
      .custom((array) => {
        const validProducts = [
          "Comidas preparadas",
          "Bebidas",
          "Confitería",
          "Frutas y verduras",
          "Productos textiles",
          "Calzado",
          "Bisutería y accesorios",
          "Juguetería",
          "Artículos de temporada",
          "Cigarrillos y tabaco",
          "Electrónicos y accesorios",
          "Arreglos florales",
          "Papelería y útiles escolares",
          "Productos varios (Para el hogar)",
          "S. Lustrado de calzado",
          "S. Reparación de calzado",
          "S. Reparación de celulares y electrónicos",
          "S. Ambulantes de aseo y apoyo",
          "Otros",
        ];
        return array.every((product) => validProducts.includes(product)); //verifica que todos los productos sean válidos
      })
      .withMessage("Categoría de producto no válida"),

    body("direccion")
      .notEmpty()
      .withMessage("La dirección del puesto de trabajo es requerida"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        numDoc,
        NumTel,
        TypeDoc,
        genero,
        selectedProducts,
        direccion,
        localidad,
        rivi,
        vigencia,
      } = req.body;

      // Verificar si ya existe un vendedor con ese correo o documento
      const vendedorExistente = await Vendedor.findOne({
        $or: [{ email }, { numDoc }],
      });

      if (vendedorExistente) {
        return res.status(409).json({
          error: "Vendedor ya registrado",
          message:
            vendedorExistente.email === email
              ? "Ya existe un vendedor con este correo electrónico"
              : "Ya existe un vendedor con este número de documento",
        });
      }

      // Buscar el ID de la localidad por nombre
      const localidadDoc = await Localidad.findOne({ nombre: localidad });
      if (!localidadDoc) {
        return res.status(400).json({
          error: "Localidad inválida",
          message: "La localidad seleccionada no existe",
        });
      }

      // Crear nuevo vendedor
      const nuevoVendedor = new Vendedor({
        firstName,
        lastName,
        email,
        password, // Se encriptará automáticamente por el middleware pre('save')
        numDoc,
        NumTel,
        TypeDoc,
        genero,
        selectedProducts,
        direccion,
        id_localidad:localidadDoc._id,
        rivi,
        vigencia,
      });

      await nuevoVendedor.save();

      // Generar token de confirmación de email
      const tokenConfirmacion = crypto.randomBytes(32).toString('hex');
      nuevoVendedor.tokenConfirmacion = tokenConfirmacion;
      nuevoVendedor.tokenConfirmacionExpira = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
      nuevoVendedor.emailVerificado = false;
      await nuevoVendedor.save();

      // Enviar email de confirmación
      try {
        await enviarEmailConfirmacion(
          nuevoVendedor.email,
          nuevoVendedor.firstName,
          tokenConfirmacion
        );
        console.log('✅ Email de confirmación enviado a:', nuevoVendedor.email);
      } catch (emailError) {
        console.error('⚠️ Error al enviar email de confirmación:', emailError);
        // No fallar el registro si el email falla
      }

      // Generar JWT token
      const token = jwt.sign(
        {
          vendedorId: nuevoVendedor._id,
          email: nuevoVendedor.email,
          firstName: nuevoVendedor.firstName,
          lastName: nuevoVendedor.lastName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Respuesta exitosa
      res.status(201).json({
        message: "Vendedor registrado exitosamente. Por favor verifica tu email para confirmar tu cuenta.",
        token,
        vendedor: nuevoVendedor.toPublicJSON(),
        emailEnviado: true
      });
    } catch (error) {
      console.error("Error en registro:", error);

      // Error de duplicado de MongoDB
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(409).json({
          error: "Datos duplicados",
          message: `Ya existe un vendedor con este ${
            field === "correo" ? "correo electrónico" : "número de documento"
          }`,
        });
      }

      res.status(500).json({
        error: "Error interno del servidor",
        message: "No se pudo registrar el vendedor",
      });
    }
  }
);

// LOGIN DE VENDEDOR
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Debe ser un correo válido")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar vendedor por correo
      const vendedor = await Vendedor.findOne({ email });
      if (!vendedor) {
        return res.status(401).json({
          error: "Credenciales inválidas",
          message: "Correo o contraseña incorrectos",
        });
      }
      // Verificar si el vendedor está activo
      if (vendedor.vigencia !== "activo") {
        return res.status(403).json({
          error: "Cuenta inactiva",
          message: "Tu cuenta no está activa. Contacta al soporte.",
        });
      }

      // Verificar contraseña usando el método del modelo
      const esContrasenaValida = await vendedor.compararContrasenia(password);
      if (!esContrasenaValida) {
        return res.status(401).json({
          error: "Credenciales inválidas",
          message: "Correo o contraseña incorrectos",
        });
      }

      // Actualizar estado a activo si está inactivo
      if (vendedor.vigencia === "inactivo") {
        vendedor.vigencia = "activo";
        await vendedor.save();
      }

      // Generar JWT token
      const token = jwt.sign(
        {
          vendedorId: vendedor._id,
          email: vendedor.email,
          firstName: vendedor.firstName,
          lastName: vendedor.lastName,
          vigencia: vendedor.vigencia,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Respuesta exitosa
      res.status(200).json({
        message: "Login exitoso",
        token,
        vendedor: vendedor.toPublicJSON(),
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        message: "No se pudo procesar el login",
      });
    }
  }
);

// VALIDAR TOKEN (RUTA PROTEGIDA)
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.vendedor.vendedorId)
      .select('vigencia emailVerificado');

    if (!vendedor) {
      return res.status(404).json({
        valid: false,
        message: 'Vendedor no encontrado'
      });
    }

    // Verificar estado de cuenta
    if (vendedor.vigencia !== 'activo') {
      return res.status(403).json({
        valid: false,
        message: 'Cuenta inactiva o suspendida'
      });
    }

    res.json({
      valid: true,
      vendedor: {
        id: vendedor._id,
        role: 'vendedor'
      }
    });
  } catch (error) {
    console.error('Error validando token:', error);
    res.status(500).json({
      valid: false,
      message: 'Error al validar token'
    });
  }
});

// OBTENER PERFIL (RUTA PROTEGIDA)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.vendedor.vendedorId)
      .select("-password")
      .populate("id_localidad", "nombre_localidad")
      .populate("id_entidad", "nombre_entidad");

    if (!vendedor) {
      return res.status(404).json({
        error: "Vendedor no encontrado",
        message: "El vendedor asociado al token no existe",
      });
    }

    res.json({
      message: "Perfil obtenido exitosamente",
      vendedor: vendedor.toPublicJSON(),
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: "No se pudo obtener el perfil",
    });
  }
});

// ACTUALIZAR PERFIL (RUTA PROTEGIDA)
router.put(
  "/profile",
  authenticateToken,
  [
    body("firstName").optional().isLength({ min: 2, max: 100 }),
    body("lastName").optional().isLength({ min: 2, max: 100 }),
    body("NumTel").optional().isMobilePhone("es-CO"),
    body("direccion").optional().notEmpty(),
    body("localidad").notEmpty().withMessage("La localidad es requerida"),
    body("selectedProducts")
      .isArray()
      .custom((array) => {
        const validProducts = [
          "Comidas preparadas",
          "Bebidas",
          "Confitería",
          "Frutas y verduras",
          "Productos textiles",
          "Calzado",
          "Bisutería y accesorios",
          "Juguetería",
          "Artículos de temporada",
          "Cigarrillos y tabaco",
          "Electrónicos y accesorios",
          "Arreglos florales",
          "Papelería y útiles escolares",
          "Productos varios (Para el hogar)",
          "S. Lustrado de calzado",
          "S. Reparación de calzado",
          "S. Reparación de celulares y electrónicos",
          "S. Ambulantes de aseo y apoyo",
          "Otros",
        ];
        return array.every((product) => validProducts.includes(product));
      })
      .withMessage("Categoría de producto no válida"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updates = req.body;

      // Campos que no se pueden actualizar
      delete updates.email;
      delete updates.numDoc;
      delete updates.TypeDoc;
      delete updates.password;
      delete updates._id;
      delete updates.vigencia;

      const vendedor = await Vendedor.findByIdAndUpdate(
        req.vendedor.vendedorId,
        updates,
        { new: true, runValidators: true }
      ).select("-password");

      if (!vendedor) {
        return res.status(404).json({
          error: "Vendedor no encontrado",
        });
      }

      res.json({
        message: "Perfil actualizado exitosamente",
        vendedor: vendedor.toPublicJSON(),
      });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        message: "No se pudo actualizar el perfil",
      });
    }
  }
);

// Exportar router y middleware
module.exports = router;
