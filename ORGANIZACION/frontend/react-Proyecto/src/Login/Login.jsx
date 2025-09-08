import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);

  const handleSubmit = () => {
    let errors = "";
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email)) {
      errors += "El email no es válido. ";
    }

    if (password.length < 8) {
      errors += "La contraseña debe tener al menos 8 caracteres. ";
    }

    if (!terms) {
      errors += "Debes aceptar los términos y condiciones. ";
    }

    if (errors !== "") {
      setMessage(errors);
    } else {
      setMessage(isRegistrationMode ? "Registro exitoso." : "Inicio de sesión exitoso.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleMode = () => {
    setIsRegistrationMode(!isRegistrationMode);
    setMessage("");
  };

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const goHome = () => {
    alert('Redirigiendo al inicio...');
    // Aquí puedes agregar la lógica para redirigir al usuario
  };

  return (
    <div className="login-container">
      {/* Header */}
      <header className="login-header">
        <div className="login-header-content">
          <div className="logo">
            <img className="logo-img" src="../img/logo.png" alt="logo" />
            UrbanStand
          </div>
          <button
            onClick={goHome}
            className="login-home-button"
          >
            Volver al inicio
          </button>
        </div>
      </header>

      {/* Login Container */}
      <div className="login-content">
        <div className="login-box">
          <h2 className="login-title">
            {isRegistrationMode ? "Registrarse" : "Iniciar sesión"}
          </h2>

          <div className="login-form">
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