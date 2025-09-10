import React, { useState, useEffect } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [numDoc, setNumDoc] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .register-container {
        width: 100vw;
        height: 100vh;
        background: #faf3e0;
        font-family: system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }
      .register-header {
        background: #faf3e0;
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 50;
      }

      .register-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .register-home-button {
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

      .register-home-button:hover {
        background: transparent;
        color: #9a1e22;
      }

      .register-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        min-height: calc(100vh - 80px);
      }

      .register-box {
        width: 100%;
        max-width: 32rem;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .register-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 2rem;
        text-align: center;
        color: #9a1e22;
      }

      .register-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .register-input-group {
        display: flex;
        flex-direction: column;
      }

      .register-name-group {
        display: flex;
        gap: 1rem;
      }

      .register-name-group .register-input-group {
        flex: 1;
      }

      .register-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
      }

      .register-input {
        border: 2px solid #ea580c;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;
        outline: none;
        box-sizing: border-box;
      }

      .register-input:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .register-input:hover {
        border-color: #9a1e22;
      }

      .register-password-container {
        position: relative;
        width: 100%;
      }

      .register-password-input {
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

      .register-password-input:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .register-password-input:hover {
        border-color: #9a1e22;
      }

      .register-eye-button {
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

      .register-eye-button:hover {
        color: #f97316;
      }

      .register-checkbox-container {
        display: flex;
        align-items: flex-start;
      }

      .register-checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .register-checkbox {
        height: 1.25rem;
        width: 1.25rem;
        border-radius: 0.25rem;
        margin-right: 0.75rem;
        cursor: pointer;
        accent-color: #f97316;
      }

      .register-checkbox-text {
        color: #374151;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .register-checkbox-text a {
        color: #9a1e22;
        text-decoration: none;
      }

      .register-checkbox-text a:hover {
        text-decoration: underline;
      }

      .register-submit-button {
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

      .register-submit-button:hover {
        background: transparent;
        color: #ea580c;
        border-color: #f97316;
      }

      .register-toggle-container {
        text-align: center;
      }

      .register-toggle-button {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: #9a1e22;
        transition: all 0.2s ease;
      }

      .register-toggle-button:hover {
        color: #f97316;
        text-decoration: underline;
      }

      .register-message {
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        padding: 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
      }

      .register-message-error {
        color: #dc2626;
        background: #fef2f2;
        border: 1px solid #fecaca;
      }

      .register-message-success {
        color: #16a34a;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
      }

      .register-eye-icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .logo {
        font-size: 28px;
        font-weight: bold;
        color: #f97316;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      @media (max-width: 768px) {
        .register-content {
          padding: 1rem;
        }
        
        .register-box {
          padding: 1.5rem;
        }
        
        .logo img {
          height: 40px;
          width: auto;
        }
        
        .register-header-content {
          padding: 0 1rem;
        }

        .register-name-group {
          flex-direction: column;
          gap: 1.5rem;
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

    if (!firstName.trim()) errors += "El nombre es obligatorio. ";
    if (!lastName.trim()) errors += "El apellido es obligatorio. ";
    if (numDoc.length < 8 || numDoc.length > 10) errors += "El número de documento debe tener entre 8 y 10 dígitos. ";
    if (!emailRegex.test(email)) errors += "El email no es válido. ";
    if (password.length < 8) errors += "La contraseña debe tener al menos 8 caracteres. ";
    if (password !== confirmPassword) errors += "Las contraseñas no coinciden. ";
    if (!terms) errors += "Debes aceptar los términos y condiciones. ";
    
    if (errors) {
      setMessage(errors);
    } else {
      setMessage("Registro exitoso! Bienvenido a UrbanStand.");
      // Here you would typically send the data to your backend
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const goHome = () => {
    alert("Redirigiendo al inicio…");
  };

  const goToLogin = () => {
    alert("Redirigiendo a inicio de sesión…");
  };

  return (
    <div className="register-container">
      {/* Header */}
      <header className="register-header">
        <div className="register-header-content">
          <div className="logo">
            <span>🏪</span>
            UrbanStand
          </div>
          <button onClick={goHome} className="register-home-button">
            Volver al inicio
          </button>
        </div>
      </header>

      {/* Register Container */}
      <div className="register-content">
        <div className="register-box">
          <h2 className="register-title">Registrarse</h2>

          <div className="register-form">
            {/* Name Inputs */}
            <div className="register-name-group">
              <div className="register-input-group">
                <label className="register-label">Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="register-input"
                  required
                />
              </div>
              <div className="register-input-group">
                <label className="register-label">Apellido</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="register-input"
                  required
                />
              </div>
            </div>


            {/* Num-Doc Input */} 
            <div className="register-input-group">
              <label className="register-label">Tipo de documento</label>
              <input
                type="text"
                value={numDoc}
                onChange={(e) => setNumDoc(e.target.value)}
                onKeyPress={handleKeyPress}
                className="register-input"
                required
              />
            </div>


            {/* Num-Doc Input */} 
            <div className="register-input-group">
              <label className="register-label">Número de documento</label>
              <input
                type="text"
                value={numDoc}
                onChange={(e) => setNumDoc(e.target.value)}
                onKeyPress={handleKeyPress}
                className="register-input"
                required
              />
            </div>

            {/* Email Input */}
            <div className="register-input-group">
              <label className="register-label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="register-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="register-input-group">
              <label className="register-label">Contraseña</label>
              <div className="register-password-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="register-password-input"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="register-eye-button"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <svg className="register-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

            {/* Confirm Password Input */}
            <div className="register-input-group">
              <label className="register-label">Confirmar contraseña</label>
              <div className="register-password-container">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="register-password-input"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="register-eye-button"
                  aria-label={isConfirmPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <svg className="register-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {isConfirmPasswordVisible ? (
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
            <div className="register-checkbox-container">
              <label className="register-checkbox-label">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="register-checkbox"
                  required
                />
                <p className="register-checkbox-text">
                  <a href="#">Acepto los términos y condiciones</a>
                </p>
              </label>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} className="register-submit-button">
              Registrarse
            </button>

            {/* Go to Login */}
            <div className="register-toggle-container">
              <button onClick={goToLogin} className="register-toggle-button">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`register-message ${
                  message.includes("exitoso")
                    ? "register-message-success"
                    : "register-message-error"
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