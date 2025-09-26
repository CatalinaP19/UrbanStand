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

  const handleSubmit = async () => {
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
    } else {
      // Inicio de sesión
      setMessage("Iniciando sesión...");
      if (!isRegistrationMode) {
        try {
          if (role === 'entidad') {
            // Login entidad contra backend
            const loginResp = await apiService.entidad.login({
              correo_institucional: email,
              contrasenia: password,
            });
            if (loginResp?.token) apiService.saveAuth(loginResp.token, 'entidad');
            // Recuperar perfil
            let profile = {};
            try {
              profile = await apiService.entidad.profile();
            } catch (_) {}
            const entidadData = {
              email,
              nomEnti: profile?.nombre_entidad || profile?.nomEnti || profile?.nombre || undefined,
            };
            setMessage("Inicio de sesión exitoso.");
            if (typeof onSuccessfulLogin === 'function') {
              return onSuccessfulLogin('entidad', entidadData);
            } else {
              // fallback de navegación
              return navigate('/entidades');
            }
          } else if (role === 'vendedor') {
            // Intentar login vendedor contra backend; si falla, usar fallback localStorage
            let vendorData = null;
            try {
              const loginResp = await apiService.vendedor.login({ email, password });
              if (loginResp?.token) apiService.saveAuth(loginResp.token, 'vendedor');
              const profile = await apiService.vendedor.profile();
              vendorData = {
                email,
                firstName: profile?.firstName || profile?.nombre || undefined,
                lastName: profile?.lastName || profile?.apellido || undefined,
                genero: profile?.genero || undefined,
              };
            } catch (_) {
              // Fallback: perfil local guardado en registro
              let profile = {};
              const key = (email || '').trim().toLowerCase();
              try {
                const allRaw = JSON.parse(localStorage.getItem('urbanstand_users') || '{}');
                // Migración a minúsculas
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
            setMessage("Inicio de sesión exitoso.");
            if (typeof onSuccessfulLogin === 'function') {
              return onSuccessfulLogin('vendedor', vendorData);
            } else {
              // fallback de navegación
              return navigate('/vendedor');
            }
          }
        } catch (error) {
          console.error('Error de login:', error);
          setMessage(error?.message || 'Error iniciando sesión');
          return;
        }
      }
      setMessage("Inicio de sesión exitoso.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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
              >
                {isRegistrationMode ? "Registrarse" : "Entrar"}
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