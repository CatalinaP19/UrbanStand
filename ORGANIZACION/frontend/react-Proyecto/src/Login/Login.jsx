import React, { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .login-container {
        width: 100vw;
        height: 100vh;
        background: #faf3e0;
        font-family: system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }

      .login-header {
        background: #faf3e0;
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        box-shadow: 0 2px 10px var(--shadow);
        position: sticky;
        top: 0;
        z-index: 50;
      }

      .login-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .login-logo {
        font-size: 1.8rem;
        font-weight: bold;
        color: #f97316;
      }

      .login-home-button {
        background: #9a1e22;
        border: 2px solid #9a1e22;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .login-home-button:hover {
        background: transparent;
        color: #9a1e22;
      }

      .login-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        min-height: calc(100vh - 80px);
      }

      .login-box {
        width: 100%;
        max-width: 32rem;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .login-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 2rem;
        text-align: center;
        color: #9a1e22;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .login-input-group {
        display: flex;
        flex-direction: column;
      }

      .login-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
      }

      .login-input {
        border: 2px solid #ea580c;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;
        outline: none;
        box-sizing: border-box;
      }

      .login-input:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .login-input:hover {
        border-color: #9a1e22;
      }

      .login-password-container {
        position: relative;
        width: 100%;
      }

      .login-password-input {
        border: 2px solid #ea580c;
        width: 100%;
        padding: 0.75rem;
        padding-right: 3rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;
        outline: none;
        box-sizing: border-box;
      }

      .login-password-input:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .login-password-input:hover {
        border-color: #9a1e22;
      }

      .login-eye-button {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        color: #9a1e22;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .login-eye-button:hover {
        color: #f97316;
      }

      .login-checkbox-container {
        display: flex;
        align-items: flex-start;
      }

      .login-checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .login-checkbox {
        height: 1.25rem;
        width: 1.25rem;
        border-radius: 0.25rem;
        margin-right: 0.75rem;
        cursor: pointer;
        accent-color: #f97316;
      }

      .login-checkbox-text {
        color: #white;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .login-link {
        color: #9a1e22;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        display: block;
        text-align: center;
      }

      .login-link:hover {
        color: #ea580c;
        text-decoration: underline;
      }

      .login-submit-button {
        border: 2px solid #ea580c;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        background: #ea580c;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.2s ease;
        width: 100%;
        color: white;
      }

      .login-submit-button:hover {
        background: transparent;
        color: #ea580c;
        border-color: #f97316;
      }

      .login-toggle-container {
        text-align: center;
      }

      .login-toggle-button {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: #9a1e22;
        transition: all 0.2s ease;
      }

      .login-toggle-button:hover {
        color: #f97316;
        text-decoration: underline;
      }

      .login-message {
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        padding: 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
      }

      .login-message-error {
        color: #dc2626;
        background: #fef2f2;
        border: 1px solid #fecaca;
      }

      .login-message-success {
        color: #16a34a;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
      }

      .login-eye-icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      @media (max-width: 768px) {
        .login-content {
          padding: 1rem;
        }
        
        .login-box {
          padding: 1.5rem;
        }
        
        .logo-img {
          height: 5rem;
          width: auto;
        }
        
        .logo {
        font-size: 28px;
        font-weight: bold;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: 8px;
      }
        
        .login-header-content {
          padding: 0 1rem;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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