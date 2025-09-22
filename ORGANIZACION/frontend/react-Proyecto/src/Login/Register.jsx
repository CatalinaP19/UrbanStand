import React, { useState, useEffect } from 'react'
import Swal from "sweetalert2"

export default function Register({ onBackToRoles, onSuccessfulLogin, onGoToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [numDoc, setNumDoc] = useState('')
  const [direccion, setDireccion] = useState('')
  const [genero, setGenero] = useState('')
  const [TypeDoc, setTypeDoc] = useState('CC')
  const [rivi, setRivi] = useState(null)
  const [vigencia, setVigencia] = useState('')
  const [NumTel, setNumTel] = useState('')
  const [terms, setTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])

  const productsList = [
    'Comidas preparadas',
    'Bebidas',
    'Confitería',
    'Frutas y verduras',
    'Productos textiles',
    'Calzado',
    'Bisutería y accesorios',
    'Juguetería',
    'Artículos de temporada',
    'Cigarrillos y tabaco',
    'Electrónicos y accesorios',
    'Arreglos florales',
    'Papelería y útiles escolares',
    'Productos varios (Para el hogar)',
    'S. Lustrado de calzado',
    'S. Reparación de calzado',
    'S. Reparación de celulares y electrónicos',
    'S. Ambulantes de aseo y apoyo',
    'Otros'
  ]

  const mostrarModal = () => {
    Swal.fire({
      title: "Consentimiento de Tratamiento de Datos",
      html: `
        <p style="text-align:justify;">
          Autorizo de manera libre, previa, expresa, voluntaria e informada a
          <strong>UrbanStand</strong> para que realice el tratamiento de mis datos
          personales conforme a lo dispuesto en la Ley 1581 de 2012 y el Decreto 1377 de 2013.
        </p>
        <p style="text-align:justify;">
          Entiendo que mis datos podrán ser utilizados únicamente para las finalidades
          relacionadas con la prestación de los servicios de la plataforma, y que tengo derecho
          a conocer, actualizar, rectificar o suprimir mis datos.
        </p>
        <p style="text-align:justify;">
          Para más información, consulte nuestra <a href="../CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE DATOS PERSONALES URBANSTAND.pdf">Política de Privacidad</a>.
        </p>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Acepto",
      cancelButtonText: "No acepto",
      confirmButtonColor: "#9a1e22",
      cancelButtonColor: "#6c757d",
      width: "600px"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("¡Consentimiento aceptado!", "", "success");
        // Aquí puedes guardar el consentimiento en tu backend o localStorage
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("No aceptaste el consentimiento", "", "error");
        // Aquí puedes redirigir o bloquear el registro
      }
    });
  };

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .register-container {
        width: 100vw;
        background: #faf3e0;
        font-family: system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        min-height: 100vh;
      }

      .register-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        min-height: 100vh;
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
        position: relative;
      }

      .register-label::after {
        content: ' *';
        color: #dc2626;
        font-weight: bold;
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

      .register-radio-group {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
      }

      .register-radio-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: 0.5rem;
      }

      .register-radio {
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
        accent-color: #ea580c;
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

      .register-products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 0.75rem;
        margin-top: 0.5rem;
        max-height: 300px;
        overflow-y: auto;
        padding: 1rem;
        border: 2px solid #ea580c;
        border-radius: 0.5rem;
        background: #fef7f0;
      }

      .register-product-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: white;
        border-radius: 0.375rem;
        border: 1px solid #fed7aa;
        transition: all 0.2s ease;
      }

      .register-product-item:hover {
        background: #fff7ed;
        border-color: #ea580c;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .register-product-checkbox {
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 0.25rem;
        cursor: pointer;
        accent-color: #ea580c;
        flex-shrink: 0;
      }

      .register-product-label {
        cursor: pointer;
        font-size: 0.875rem;
        color: #374151;
        line-height: 1.3;
        user-select: none;
      }

      .register-product-item input:checked + .register-product-label {
        color: #9a1e22;
        font-weight: 500;
      }

      .register-products-counter {
        font-size: 0.8rem;
        color: #6b7280;
        margin-top: 0.5rem;
        text-align: right;
      }

      .password-requirements {
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: #f9f9f9;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        color: #666;
      }

      .password-requirement {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0.25rem 0;
      }

      .password-requirement.valid {
        color: #16a34a;
      }

      .password-requirement.invalid {
        color: #dc2626;
      }

      .back-button {
        background: #6b7280;
        border: 2px solid #6b7280;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        margin-bottom: 1.5rem;
        width: 100%;
      }

      .back-button:hover {
        background: transparent;
        color: #6b7280;
      }

      @media (max-width: 768px) {
        .register-content {
          padding: 1rem;
        }
        
        .register-box {
          padding: 1.5rem;
        }

        .register-name-group {
          flex-direction: column;
          gap: 1.5rem;
        }

        .register-radio-group {
          flex-direction: column;
          gap: 0.8rem;
        }

        .register-products-grid {
          grid-template-columns: 1fr;
          max-height: 250px;
        }
        
        .register-product-item {
          padding: 0.75rem 0.5rem;
        }
      }
    `

    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Validación de contraseña mejorada
  const validatePassword = (pass) => {
    const requirements = {
      minLength: pass.length >= 8,
      hasUppercase: /[A-Z]/.test(pass),
      hasLowercase: /[a-z]/.test(pass),
      hasNumber: /\d/.test(pass)
    }
    return requirements
  }

  // Validación de teléfono colombiano
  const validatePhoneNumber = (phone) => {
    const colombianPhoneRegex = /^3\d{9}$/
    return colombianPhoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Validación de la dirección corregida
  const ValidateAddress = (address) => {
    const direccionRegex = /^(Calle|Carrera|Transversal|Diagonal|Avenida|Av\.?|Cr|Cl)\s?\d+[A-Za-z]{0,2}(?:\s?Bis)?(?:\s?(Sur|Este|Oeste))?\s?#\d+[A-Za-z]?-?\d*(?:,\s?.+)?$/i
    return direccionRegex.test(address)
  }

  const handleSubmit = async () => {
    let errors = []
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    // Validaciones
    if (!firstName.trim()) {
      errors.push('El nombre es obligatorio.')
    } else if (firstName.length > 30) {
      errors.push('Su nombre no debe tener más de 30 caracteres.')
    }

    if (!lastName.trim()) {
      errors.push('El apellido es obligatorio.')
    } else if (lastName.length > 30) {
      errors.push('Su apellido no debe tener más de 30 caracteres.')
    }

    if (numDoc.length < 6 || numDoc.length > 10) {
      errors.push('El número de documento debe tener entre 6 y 10 dígitos.')
    }

    if (!rivi) {
      errors.push('La imagen del RIVI Y HEMI es requerida.')
    }

    if (!emailRegex.test(email)) {
      errors.push('El email no es válido.')
    }

    if (!ValidateAddress(direccion)) {
      errors.push('La dirección debe ser válida y compatible con Bogotá.')
    }

    if (!vigencia) {
      errors.push('Debes elegir una opción de vigencia.')
    }

    if (!genero) {
      errors.push('Debes elegir una opción de género.')
    }

    if (selectedProducts.length === 0) {
      errors.push('Debes seleccionar al menos una categoría de productos que ofreces.')
    }

    if (!validatePhoneNumber(NumTel)) {
      errors.push('El número telefónico debe ser válido y compatible con Colombia (formato: 3XXXXXXXXX).')
    }

    // Validación de contraseña mejorada
    const passwordRequirements = validatePassword(password)
    if (!passwordRequirements.minLength) {
      errors.push('La contraseña debe tener al menos 8 caracteres.')
    }
    if (!passwordRequirements.hasUppercase) {
      errors.push('La contraseña debe contener al menos una letra mayúscula.')
    }
    if (!passwordRequirements.hasLowercase) {
      errors.push('La contraseña debe contener al menos una letra minúscula.')
    }
    if (!passwordRequirements.hasNumber) {
      errors.push('La contraseña debe contener al menos un número.')
    }

    if (password !== confirmPassword) {
      errors.push('Las contraseñas no coinciden.')
    }

    if (!terms) {
      errors.push('Debes aceptar los términos y condiciones.')
    }

    if (errors.length > 0) {
      setMessage(errors.join(' '))
    } else {
      try {
        const response = await fetch('http://localhost:3005/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
            rivi,
          })
        })
        const data = await response.json()

        if (response.ok) {
          // Éxito
          setMessage('¡Registro exitoso! Redirigiendo al login...')

          // Guardar perfil mínimo en localStorage para personalizar luego del login
          try {
            const existing = JSON.parse(localStorage.getItem('urbanstand_users') || '{}')
            const key = (email || '').trim().toLowerCase()
            existing[key] = {
              role: 'vendedor',
              firstName,
              lastName,
              genero,
            }
            localStorage.setItem('urbanstand_users', JSON.stringify(existing))
          } catch (_) {}

          // Limpiar formulario y redirigir después de 2 segundos
          setTimeout(() => {
            if (onGoToLogin) {
              setFirstName('')
              setLastName('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')

              setNumDoc('')
              setDireccion('')
              setGenero('')
              setTypeDoc('CC')
              setRivi(null)
              setVigencia('')
              setNumTel('')
              setTerms(false)
              setSelectedProducts([])
              setMessage('')
              onGoToLogin()
            }
          }, 2000)
        } else {
          // Error del servidor
          setMessage(data.message || data.error || 'Error en el registro')
        }
      } catch (error) {
        console.error('Error en registro:', error)
        setMessage('Error en el registro. Por favor, inténtalo de nuevo más tarde.')
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRivi(file.name)  // Solo guarda el nombre como string
    }
  }

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const toggleConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  }

 const goToLogin = () => {
  if (onGoToLogin) {
    onGoToLogin()
  }
}

  const handleProductChange = (product, isChecked) => {
    if (isChecked) {
      setSelectedProducts((prev) => [...prev, product])
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p !== product))
    }
  }

  const passwordRequirements = validatePassword(password)

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-box">
          {/* Botón de regreso */}
          <button
            onClick={onBackToRoles}
            className="back-button"
          >
            ← Volver a selección de roles
          </button>

          <h2 className="register-title">Vendedor, ¡Regístrate!</h2>

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
                  placeholder='Primer nombre'
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
                  placeholder='Primer apellido'
                  className="register-input"
                  required
                />
              </div>
            </div>

            {/* Gender Input */}
            <div className="register-input-group">
              <label className="register-label">Género</label>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="genero"
                    value="masculino"
                    checked={genero === 'masculino'}
                    onChange={(e) => setGenero(e.target.value)}
                    className="register-radio"
                  />
                  <span>Masculino</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="genero"
                    value="femenino"
                    checked={genero === 'femenino'}
                    onChange={(e) => setGenero(e.target.value)}
                    className="register-radio"
                  />
                  <span>Femenino</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="genero"
                    value="otro"
                    checked={genero === 'otro'}
                    onChange={(e) => setGenero(e.target.value)}
                    className="register-radio"
                  />
                  <span>Otro</span>
                </label>
              </div>
            </div>

            {/* Type-Doc select */}
            <div className="register-input-group">
              <label className="register-label">Tipo de documento</label>
              <select
                value={TypeDoc}
                onChange={(e) => setTypeDoc(e.target.value)}
                onKeyPress={handleKeyPress}
                className="register-input"
                required
              >
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
            </div>

            {/* Num-Doc Input */}
            <div className="register-input-group">
              <label className="register-label">Número de documento</label>
              <input
                type="text"
                value={numDoc}
                onChange={(e) => setNumDoc(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Número de identificación'
                className="register-input"
                required
              />
            </div>

            {/* File-(RIVI) Input */}
            <div className="register-input-group">
              <label className="register-label">
                Adjunte la captura del RIVI Y HEMI
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="register-input"
                accept="image/*,.pdf"
                required
              />
            </div>

            {/* Address Input */}
            <div className="register-input-group">
              <label className="register-label">Dirección de su puesto de trabajo</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ej. Calle 100 #15-55, barrio Barrios Unidos'
                className="register-input"
                required
              />
            </div>

            {/* Validity Input */}
            <div className="register-input-group">
              <label className="register-label">Vigencia</label>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="vigencia"
                    value="activo"
                    checked={vigencia === 'activo'}
                    onChange={(e) => setVigencia(e.target.value)}
                    className="register-radio"
                  />
                  <span> Vigente</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="vigencia"
                    value="inactivo"
                    checked={vigencia === 'inactivo'}
                    onChange={(e) => setVigencia(e.target.value)}
                    className="register-radio"
                  />
                  <span>Vencido</span>
                </label>
              </div>
            </div>

            {/* Products Input */}
            <div className="register-input-group">
              <label className="register-label">Productos que ofrece</label>
              <div className="register-products-grid">
                {productsList.map((product, index) => (
                  <div key={index} className="register-product-item">
                    <input
                      type="checkbox"
                      id={`product-${index}`}
                      className="register-product-checkbox"
                      checked={selectedProducts.includes(product)}
                      onChange={(e) =>
                        handleProductChange(product, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`product-${index}`}
                      className="register-product-label"
                    >
                      {product}
                    </label>
                  </div>
                ))}
              </div>
              <div className="register-products-counter">
                {selectedProducts.length} producto
                {selectedProducts.length !== 1 ? 's' : ''} seleccionado
                {selectedProducts.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="register-input-group">
              <label className="register-label">Número de teléfono</label>
              <input
                type="text"
                value={NumTel}
                onChange={(e) => setNumTel(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ej. 3123456789'
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
                placeholder='email@correo.com'
                className="register-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="register-input-group">
              <label className="register-label">Contraseña</label>
              <div className="register-password-container">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Ej. MiContra123'
                  className="register-password-input"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="register-eye-button"
                  aria-label={
                    isPasswordVisible
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  <svg
                    className="register-eye-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    {isPasswordVisible ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {password && (
                <div className="password-requirements">
                  <div className={`password-requirement ${passwordRequirements.minLength ? 'valid' : 'invalid'}`}>
                    {passwordRequirements.minLength ? '✓' : '✗'} Mínimo 8 caracteres
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasUppercase ? 'valid' : 'invalid'}`}>
                    {passwordRequirements.hasUppercase ? '✓' : '✗'} Al menos una letra mayúscula
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasLowercase ? 'valid' : 'invalid'}`}>
                    {passwordRequirements.hasLowercase ? '✓' : '✗'} Al menos una letra minúscula
                  </div>
                  <div className={`password-requirement ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}>
                    {passwordRequirements.hasNumber ? '✓' : '✗'} Al menos un número
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="register-input-group">
              <label className="register-label">Confirmar contraseña</label>
              <div className="register-password-container">
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Confirmar contraseña'
                  className="register-password-input"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="register-eye-button"
                  aria-label={
                    isConfirmPasswordVisible
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  <svg
                    className="register-eye-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    {isConfirmPasswordVisible ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
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
                  He leído y acepto los
                  <a href="../POLÍTICA DE PRIVACIDAD Y TÉRMINOS Y CONDICIONES URBANSTAND.pdf"> Términos y condiciones
                  </a>
                </p>
              </label>
            </div>
            <div>
              <button onClick={mostrarModal} className="btn btn-primary">
                Ver Consentimiento
              </button>
            </div>

            {/* Submit */}
            <button type="button" onClick={handleSubmit} className="register-submit-button">
              Registrarse
            </button>

            {/* Go to Login */}
            <div className="register-toggle-container">
              <button type="button" onClick={goToLogin} className="register-toggle-button">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`register-message ${message.includes('exitoso')
                  ? 'register-message-success'
                  : 'register-message-error'
                  }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}