// services/emailService.js
const nodemailer = require('nodemailer');

// Configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar: gmail, outlook, yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación
  }
});

// Verificar la conexión
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});

/**
 * Enviar email de confirmación de registro
 */
const enviarEmailConfirmacion = async (destinatario, nombre, token) => {
  const urlConfirmacion = `${process.env.FRONTEND_URL}/confirmar-email/${token}`;
  
  const mailOptions = {
    from: `"UrbanStand" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '✅ Confirma tu registro en UrbanStand',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Bienvenido a UrbanStand!</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Gracias por registrarte en UrbanStand. Para completar tu registro y activar tu cuenta, por favor confirma tu dirección de email haciendo clic en el botón de abajo:</p>
            
            <div style="text-align: center;">
              <a href="${urlConfirmacion}" class="button">Confirmar mi Email</a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${urlConfirmacion}
            </p>
            
            <p><strong>⏰ Este enlace expirará en 24 horas.</strong></p>
            
            <p>Si no solicitaste este registro, puedes ignorar este email.</p>
          </div>
          <div class="footer">
            <p>© 2025 UrbanStand - Plataforma de Vendedores Ambulantes</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de confirmación:', error);
    throw error;
  }
};

/**
 * Enviar email de recuperación de contraseña
 */
const enviarEmailRecuperacion = async (destinatario, nombre, token) => {
  const urlRecuperacion = `${process.env.FRONTEND_URL}/restablecer-password/${token}`;
  
  const mailOptions = {
    from: `"UrbanStand" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '🔐 Recuperación de Contraseña - UrbanStand',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperación de Contraseña</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en UrbanStand.</p>
            
            <div style="text-align: center;">
              <a href="${urlRecuperacion}" class="button">Restablecer Contraseña</a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${urlRecuperacion}
            </p>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este enlace expirará en <strong>1 hora</strong></li>
                <li>Solo puedes usar este enlace una vez</li>
                <li>Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá sin cambios</li>
              </ul>
            </div>
            
            <p>Por seguridad, te recomendamos:</p>
            <ul>
              <li>Usar una contraseña fuerte y única</li>
              <li>No compartir tu contraseña con nadie</li>
              <li>Cambiar tu contraseña regularmente</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2025 UrbanStand - Plataforma de Vendedores Ambulantes</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error);
    throw error;
  }
};

/**
 * Enviar email de bienvenida (después de confirmar email)
 */
const enviarEmailBienvenida = async (destinatario, nombre, tipoUsuario) => {
  const mailOptions = {
    from: `"UrbanStand" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '🎊 ¡Cuenta Activada! - UrbanStand',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 ¡Tu cuenta está activa!</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${nombre}!</h2>
            <p>Tu email ha sido confirmado exitosamente. Ya puedes acceder a todas las funcionalidades de UrbanStand.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">Iniciar Sesión</a>
            </div>
            
            <h3>¿Qué puedes hacer ahora?</h3>
            ${tipoUsuario === 'vendedor' ? `
              <div class="feature">
                <strong>📝 Completa tu perfil</strong><br>
                Agrega información sobre tus productos y ubicación
              </div>
              <div class="feature">
                <strong>💬 Conecta con otros vendedores</strong><br>
                Usa nuestro chat en tiempo real
              </div>
              <div class="feature">
                <strong>📍 Actualiza tu ubicación</strong><br>
                Permite que los clientes te encuentren fácilmente
              </div>
            ` : `
              <div class="feature">
                <strong>📊 Accede a estadísticas</strong><br>
                Visualiza datos de vendedores en tiempo real
              </div>
              <div class="feature">
                <strong>📥 Descarga reportes</strong><br>
                Genera informes personalizados
              </div>
              <div class="feature">
                <strong>🔍 Monitorea actividad</strong><br>
                Supervisa el comercio ambulante en tu zona
              </div>
            `}
            
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          </div>
          <div class="footer">
            <p>© 2025 UrbanStand - Plataforma de Vendedores Ambulantes</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida:', error);
    throw error;
  }
};

/**
 * Enviar email de notificación de cambio de contraseña
 */
const enviarEmailCambioPassword = async (destinatario, nombre) => {
  const mailOptions = {
    from: `"UrbanStand" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '✅ Contraseña Actualizada - UrbanStand',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Contraseña Actualizada</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Te confirmamos que tu contraseña ha sido actualizada exitosamente.</p>
            
            <div class="warning">
              <strong>⚠️ ¿No fuiste tú?</strong><br>
              Si no realizaste este cambio, tu cuenta podría estar comprometida. 
              Por favor, contacta inmediatamente con soporte.
            </div>
            
            <p><strong>Fecha y hora del cambio:</strong> ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p>
            
            <p>Recomendaciones de seguridad:</p>
            <ul>
              <li>No compartas tu contraseña con nadie</li>
              <li>Usa contraseñas únicas para cada servicio</li>
              <li>Activa la autenticación de dos factores cuando esté disponible</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2025 UrbanStand - Plataforma de Vendedores Ambulantes</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de cambio de contraseña enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email de cambio de contraseña:', error);
    throw error;
  }
};

module.exports = {
  enviarEmailConfirmacion,
  enviarEmailRecuperacion,
  enviarEmailBienvenida,
  enviarEmailCambioPassword
};
