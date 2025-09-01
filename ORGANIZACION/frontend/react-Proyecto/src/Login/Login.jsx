import React, { useState } from "react";
import "./Login.css"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tyc, setTyc] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    let errores = "";
    const regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!regexEmail.test(email)) {
      errores += "El email no es válido. ";
    }

    if (contraseña.length < 8) {
      errores += "La contraseña debe tener al menos 8 caracteres. ";
    }

    if (!tyc) {
      errores += "Debes aceptar los términos y condiciones. ";
    }

    if (errores !== "") {
      setMensaje(errores);
    } else {
      setMensaje("Formulario enviado correctamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="login-form" id="form">
          <div>
            <label className="login-label">Ingrese su correo electrónico</label>
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="login-label">Ingrese su contraseña</label>
            <input
              type="password"
              className="login-input"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>

          <div>
            <label className="login-checkbox-container">
              <input
                type="checkbox"
                className="login-checkbox"
                checked={tyc}
                onChange={(e) => setTyc(e.target.checked)}
              />
              <span className="login-checkbox-text">
                Acepto los términos y condiciones
              </span>
            </label>
          </div>

          <div>
            <a href="#" className="login-link">
              Olvidé mi contraseña
            </a>
          </div>

          <div>
            <button type="submit" className="login-button">
              Entrar
            </button>
          </div>

          {mensaje && (
            <div
              className={`login-message ${
                mensaje.includes("correctamente")
                  ? "login-message-success"
                  : "login-message-error"
              }`}
            >
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
