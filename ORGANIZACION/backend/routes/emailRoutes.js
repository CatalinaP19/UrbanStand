// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Vendedor = require('../models/Vendedor');
const EntidadGubernamental = require('../models/EntidadGubernamental');
const {
  enviarEmailConfirmacion,
  enviarEmailRecuperacion,
  enviarEmailBienvenida,
  enviarEmailCambioPassword
} = require('../services/emailService');

/**
 * POST /api/email/reenviar-confirmacion
 * Reenviar email de confirmación
 */
router.post('/reenviar-confirmacion', async (req, res) => {
  try {
    const { email, tipoUsuario } = req.body;

    if (!email || !tipoUsuario) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Email y tipo de usuario son requeridos'
      });
    }

    // Buscar usuario según tipo
    const Modelo = tipoUsuario === 'vendedor' ? Vendedor : EntidadGubernamental;
    const usuario = await Modelo.findOne({ email });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No existe un usuario con ese email'
      });
    }

    if (usuario.emailVerificado) {
      return res.status(400).json({
        error: 'Email ya verificado',
        message: 'Este email ya ha sido confirmado'
      });
    }

    // Generar nuevo token
    const token = crypto.randomBytes(32).toString('hex');
    usuario.tokenConfirmacion = token;
    usuario.tokenConfirmacionExpira = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
    await usuario.save();

    // Enviar email
    const nombre = usuario.firstName || usuario.nomEnti;
    await enviarEmailConfirmacion(email, nombre, token);

    res.json({
      success: true,
      message: 'Email de confirmación reenviado exitosamente'
    });
  } catch (error) {
    console.error('Error al reenviar confirmación:', error);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'No se pudo reenviar el email de confirmación'
    });
  }
});

/**
 * GET /api/email/confirmar/:token
 * Confirmar email con token
 */
router.get('/confirmar/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar en vendedores
    let usuario = await Vendedor.findOne({
      tokenConfirmacion: token,
      tokenConfirmacionExpira: { $gt: Date.now() }
    });

    let tipoUsuario = 'vendedor';

    // Si no se encuentra, buscar en entidades
    if (!usuario) {
      usuario = await EntidadGubernamental.findOne({
        tokenConfirmacion: token,
        tokenConfirmacionExpira: { $gt: Date.now() }
      });
      tipoUsuario = 'entidad';
    }

    if (!usuario) {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El token de confirmación es inválido o ha expirado'
      });
    }

    // Marcar email como verificado
    usuario.emailVerificado = true;
    usuario.tokenConfirmacion = null;
    usuario.tokenConfirmacionExpira = null;
    await usuario.save();

    // Enviar email de bienvenida
    const nombre = usuario.firstName || usuario.nomEnti;
    const email = usuario.email || usuario.emailE;
    await enviarEmailBienvenida(email, nombre, tipoUsuario);

    res.json({
      success: true,
      message: 'Email confirmado exitosamente',
      tipoUsuario
    });
  } catch (error) {
    console.error('Error al confirmar email:', error);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'No se pudo confirmar el email'
    });
  }
});

/**
 * POST /api/email/solicitar-recuperacion
 * Solicitar recuperación de contraseña
 */
router.post('/solicitar-recuperacion', async (req, res) => {
  try {
    const { email, tipoUsuario } = req.body;

    if (!email || !tipoUsuario) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Email y tipo de usuario son requeridos'
      });
    }

    // Buscar usuario según tipo
    const Modelo = tipoUsuario === 'vendedor' ? Vendedor : EntidadGubernamental;
    const usuario = await Modelo.findOne({ email });

    // Por seguridad, siempre responder lo mismo aunque el usuario no exista
    if (!usuario) {
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
      });
    }

    // Generar token de recuperación
    const token = crypto.randomBytes(32).toString('hex');
    usuario.tokenRecuperacion = token;
    usuario.tokenRecuperacionExpira = Date.now() + 60 * 60 * 1000; // 1 hora
    await usuario.save();

    // Enviar email
    const nombre = usuario.firstName || usuario.nomEnti;
    const emailDestino = usuario.email || usuario.emailE;
    await enviarEmailRecuperacion(emailDestino, nombre, token);

    res.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
    });
  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'No se pudo procesar la solicitud'
    });
  }
});

/**
 * POST /api/email/restablecer-password
 * Restablecer contraseña con token
 */
router.post('/restablecer-password', async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;

    if (!token || !nuevaPassword) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    if (nuevaPassword.length < 8) {
      return res.status(400).json({
        error: 'Contraseña inválida',
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Buscar en vendedores
    let usuario = await Vendedor.findOne({
      tokenRecuperacion: token,
      tokenRecuperacionExpira: { $gt: Date.now() }
    });

    // Si no se encuentra, buscar en entidades
    if (!usuario) {
      usuario = await EntidadGubernamental.findOne({
        tokenRecuperacion: token,
        tokenRecuperacionExpira: { $gt: Date.now() }
      });
    }

    if (!usuario) {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'El token de recuperación es inválido o ha expirado'
      });
    }

    // Actualizar contraseña (se hasheará automáticamente por el middleware pre-save)
    usuario.password = nuevaPassword;
    usuario.tokenRecuperacion = null;
    usuario.tokenRecuperacionExpira = null;
    await usuario.save();

    // Enviar email de confirmación de cambio
    const nombre = usuario.firstName || usuario.nomEnti;
    const email = usuario.email || usuario.emailE;
    await enviarEmailCambioPassword(email, nombre);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'No se pudo restablecer la contraseña'
    });
  }
});

module.exports = router;
