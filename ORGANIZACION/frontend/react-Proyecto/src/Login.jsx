
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [tyc, setTyc] = useState(false);
  const [mensaje, setMensaje] = useState("");

{/*Cada uno tiene su función (setEmail, setContraseña, etc.) que permite actualizar el valor cuando el usuario interactúa, por eso están vacios.*/}

  const handleSubmit = (event) => {
    event.preventDefault();

    let errores = "";
    const regexEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (!regexEmail.test(email)) {
      errores += "El email no es válido. ";
    }

    {/*Si el email no cumple con el formato, agregamos un mensaje a errores.*/}

    if (contraseña.length < 8) {
      errores += "La contraseña debe tener al menos 8 caracteres. ";
    }

    if (!tyc) {
      errores += "Debes aceptar los términos y condiciones. ";
    }
{/*Si el checkbox no está marcado (false), mostramos un mensaje.*/}


    if (errores !== "") {
      setMensaje(errores);
    } else {
      setMensaje("Formulario enviado correctamente.");
      // Aquí puedes hacer la lógica de envío
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-md" id="form">
          <div>
            <label>Ingrese su correo electrónico</label>
            <input
              type="email"
              className="border w-full p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Ingrese su contraseña</label>
            <input
              type="password"
              className="border w-full p-2 rounded"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded"
                checked={tyc}
                onChange={(e) => setTyc(e.target.checked)}
              />
              <p className="ml-2 text-gray-700">Acepto los términos y condiciones</p>
            </label>
          </div>

          <div>
            <a href="#" className="hover:text-red-800 hover:underline">Olvidé mi contraseña</a>
          </div>

          <div>
            <button type="submit" className="border px-6 py-2 hover:bg-red-400 rounded">
              Entrar
            </button>
          </div>

          {/* Mostrar mensaje de error o éxito */}
          {mensaje && (
            <div className="mt-4 text-center text-red-500 font-semibold">
              {mensaje}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}