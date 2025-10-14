import React, { useState } from "react";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

export default function Login({ onSuccessfulLogin, onGoToRegister }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);
  const [role, setRole] = useState("vendedor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // ✅ Prevenir múltiples submits
    if (isSubmitting) {
      console.log('⏳ Ya hay un login en proceso, ignorando...');
      return;
    }

    let errors = "";
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email)) {
      errors += "El email no es válido. ";
    }
    if (password.length < 8) {
      errors += "La contraseña debe tener al menos 8 caracteres. ";
    }

    if (errors !== "") {
      setMessage(errors);
      return; // ✅ Salir sin bloquear
    }

    setIsSubmitting(true); // ✅ Bloquear SOLO si las validaciones pasaron
    setMessage("Iniciando sesión...");

    if (!isRegistrationMode) {
      try {
        if (role === 'entidad') {
          const loginResp = await apiService.entidad.login({
            emailE: email,
            password,
          });

          if (loginResp?.token) {
            const token = apiService.saveAuth(loginResp.token, 'entidad');
            console.log('🔑 Token guardado:', token);
            console.log('🔑 Token en localStorage:', localStorage.getItem('token'));
            const profileResponse = await apiService.entidad.profile(token);
            const profile = profileResponse?.vendedor || profileResponse;

            const entidadData = {
              email,
              nomEnti: profile?.nombre_entidad || profile?.nomEnti || profile?.nombre || undefined,
            };

            try {
              const allEntidades = JSON.parse(localStorage.getItem('urbanstand_entidades') || '{}');
              const emailKey = email.trim().toLowerCase();
              allEntidades[emailKey] = entidadData;
              localStorage.setItem('urbanstand_entidades', JSON.stringify(allEntidades));
            } catch (e) { /* ignore */ }

            try {
              localStorage.setItem('urbanstand_current_user', JSON.stringify({
                role: 'entidad',
                email,
                nomEnti: entidadData.nomEnti,
              }));
            } catch (_) { /* ignore */ }

            setMessage("Inicio de sesión exitoso.");
            if (typeof onSuccessfulLogin === 'function') {
              return onSuccessfulLogin('entidad', entidadData);
            } else {
              return navigate('/entidades');
            }
          }
        } else if (role === 'vendedor') {
          let vendorData = null;
          try {
            const loginResp = await apiService.vendedor.login({ email, password });
            console.log('📦 Respuesta completa del backend:', loginResp);

            if (loginResp?.token) {
              const token = apiService.saveAuth(loginResp.token, 'vendedor');
              console.log('🔑 Token guardado:', token);
              console.log('🔑 Token en localStorage:', localStorage.getItem('token'));

              const profileResponse = await apiService.vendedor.profile(token);
              console.log('👤 Perfil recibido:', profileResponse);

              const profile = profileResponse?.vendedor || profileResponse;
              console.log('🔍 Campos del perfil:', {
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                genero: profile?.genero,
                email: profile?.email
              });

              vendorData = {
                email,
                firstName: profile?.firstName || profile?.nombre || undefined,
                lastName: profile?.lastName || profile?.apellido || undefined,
                genero: profile?.genero || undefined,
              };

              console.log('💾 Datos a guardar en localStorage:', vendorData);

              try {
                const allUsers = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
                const emailKey = email.trim().toLowerCase();
                allUsers[emailKey] = vendorData;
                localStorage.setItem('urbanstand_users', JSON.stringify(allUsers));
              } catch (e) { /* ignore */ }
            }
          } catch (innerError) {
            console.log('⚠️ Error en login/profile, usando fallback local');
            let profile = {};
            const key = (email || '').trim().toLowerCase();
            try {
              const allRaw = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
              const migrated = {};
              if (allRaw && typeof allRaw === 'object') {
                Object.keys(allRaw).forEach(k => {
                  migrated[k.trim().toLowerCase()] = allRaw[k];
                });
                localStorage.setItem('urbanstand_users', JSON.stringify(migrated));
              }
              profile = migrated[key] || {};
            } catch (e) { /* ignore */ }
            vendorData = { email, ...profile };
          }

          try {
            const current = {
              role: 'vendedor',
              email,
              firstName: vendorData?.firstName,
              lastName: vendorData?.lastName,
              genero: vendorData?.genero,
            };
            localStorage.setItem('urbanstand_current_user', JSON.stringify(current));
          } catch (e) { /* ignore */ }

          setMessage("Inicio de sesión exitoso.");
          if (typeof onSuccessfulLogin === 'function') {
            return onSuccessfulLogin('vendedor', vendorData);
          } else {
            return navigate('/vendedor');
          }
        }
      } catch (error) {
        console.error('❌ Error de login:', error);
        setMessage(error?.message || 'Error iniciando sesión');
      } finally {
        setIsSubmitting(false); // ✅ Siempre desbloquear al finalizar
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault(); // ✅ Prevenir submit del form
      handleSubmit();
    }
  };

  const toggleMode = () => {
    if (onGoToRegister) {
      onGoToRegister();
    } else {
      navigate('/register-roles');
    }
  };

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="login-container">

      {/* Login Container */}
      <div className="login-content">
        <div className="login-box">
          <h2 className="login-title">
            {isRegistrationMode ? "Registrarse" : "Iniciar sesión"}
          </h2>

          <div className="login-form">
            {/* Role Selection (solo para iniciar sesión) */}
            {!isRegistrationMode && (
              <div className="login-input-group">
                <label className="login-label">
                  Selecciona tu rol
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="login-input"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="entidad">Entidad</option>
                </select>
              </div>
            )}
            {/* Email Input */}
            <div className="login-input-group">
              <label className="login-label">
                Ingrese su correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="login-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="login-input-group">
              <label className="login-label">
                Ingrese su contraseña
              </label>
              <div className="login-password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="login-password-input"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="login-eye-button"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <svg className="login-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {isPasswordVisible ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="login-checkbox-container">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="login-checkbox"
                  required
                />
                <span className="login-checkbox-text">
                  Acepto los términos y condiciones
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleSubmit}
                className="login-submit-button"
                disabled={isSubmitting || !terms}
                style={{ opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? "Procesando..." : (isRegistrationMode ? "Registrarse" : "Entrar")}
              </button>
            </div>

            {/* Forgot Password Link */}
            {!isRegistrationMode && (
              <div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="login-link"
                >
                  Olvidé mi contraseña
                </a>
              </div>
            )}

            {/* Toggle Mode Button */}
            <div className="login-toggle-container">
              <button
                type="button"
                onClick={toggleMode}
                className="login-toggle-button"
              >
                {isRegistrationMode
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"
                }
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`login-message ${message.includes("exitoso")
                  ? "login-message-success"
                  : "login-message-error"
                  }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}