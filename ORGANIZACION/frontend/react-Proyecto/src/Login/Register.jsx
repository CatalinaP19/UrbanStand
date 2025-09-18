import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService' //

export default function Register({ onBackToRoles, onGoToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [numDoc, setNumDoc] = useState('')
  const [direccion, setDireccion] = useState('')
  const [genero, setGenero] = useState('')
  const [TypeDoc, setTypeDoc] = useState('CC')
  const [NumTel, setNumTel] = useState('')
  const [terms, setTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Mapear las categorías del frontend con las del backend
  const productsList = [
    'comidas preparadas',
    'bebidas',
    'confiteria',
    'frutas y verduras',
    'productos textiles',
    'calzado',
    'bisuteria y accesorios',
    'jugeteria',
    'articulos de temporada',
    'cigarrillos y tabaco',
    'electronicos y accesorios',
    'arreglos florales',
    'papeleria y utiles escolares',
    'productos varios(para el hogar)',
    'productos de higiene y cuidado personal',
    's.lustrado de calzado',
    's.reparacion de calzado',
    's.reparacion de celulares y electrónicos',
    's.ambulantes de aseo y apoyo',
    'otros'
  ]

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

        .register-header-content {
          padding: 0 1rem;
        }

              .register-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
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

      .register-submit-button:hover:not(:disabled) {
        background: transparent;
        color: #ea580c;
        border-color: #f97316;
      }

      .register-submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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

      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 10px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
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

  // Validación de la dirección
  const ValidateAddress = (address) => {
    const direccionRegex = /^(Calle|Carrera|Transversal|Diagonal|Avenida|Av\.?|Cr|Cl)\s?\d+[A-Za-z]{0,2}(?:\s?Bis)?(?:\s?(Sur|Este|Oeste))?\s?#\d+[A-Za-z]?-?\d*(?:,\s?.+)?$/i
    return direccionRegex.test(address)
  }

  // Mapear género del frontend al backend
  const mapGenero = (generoFrontend) => {
    const map = {
      'masculino': 'M',
      'femenino': 'F',
      'otro': 'O'
    }
    return map[generoFrontend] || ''
  }

  const handleSubmit = async () => {
    let errors = []
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    // Validaciones del frontend
    if (!firstName.trim()) {
      errors.push('El nombre es obligatorio.')
    } else if (firstName.length < 3 || firstName.length > 10) {
      errors.push('El nombre debe tener entre 3 y 10 caracteres.')
    }

    if (!lastName.trim()) {
      errors.push('El apellido es obligatorio.')
    } else if (lastName.length < 3 || lastName.length > 15) {
      errors.push('El apellido debe tener entre 3 y 15 caracteres.')
    }

    if (numDoc.length < 6 || numDoc.length > 20) {
      errors.push('El número de documento debe tener entre 6 y 20 caracteres.')
    }

    if (!emailRegex.test(email)) {
      errors.push('El email no es válido.')
    }

    if (!ValidateAddress(direccion)) {
      errors.push('La dirección debe ser válida y compatible con Bogotá.')
    }

    if (!genero) {
      errors.push('Debes elegir una opción de género.')
    }

    if (selectedProducts.length === 0) {
      errors.push('Debes seleccionar al menos una categoría de productos.')
    }

    if (!validatePhoneNumber(NumTel)) {
      errors.push('El número telefónico debe ser válido (formato: 3XXXXXXXXX).')
    }

    // Validación de contraseña
    const passwordRequirements = validatePassword(password)
    if (!passwordRequirements.minLength || !passwordRequirements.hasUppercase ||
      !passwordRequirements.hasLowercase || !passwordRequirements.hasNumber) {
      errors.push('La contraseña no cumple con los requisitos.')
    }

    if (password !== confirmPassword) {
      errors.push('Las contraseñas no coinciden.')
    }

    if (!terms) {
      errors.push('Debes aceptar los términos y condiciones.')
    }

    if (errors.length > 0) {
      setMessage(errors.join(' '))
      return
    }

    // Si no hay errores, enviar al backend
    setLoading(true)
    setMessage('')

    try {
      const registroData = {
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        correo: email.trim().toLowerCase(),
        contrasenia: password,
        numero_documento: numDoc.trim(),
        numero_celular: NumTel.trim(),
        tipo_documento: TypeDoc,
        genero: mapGenero(genero),
        categoria_producto: selectedProducts[0], // Tomar la primera seleccionada
        direccion_puesto_trabajo: direccion.trim()
      }

      console.log('Enviando datos:', registroData)

      // Hacer la petición al backend
      const response = await apiService.vendedor.register(registroData);
      apiService.saveAuth(response.token, 'vendedor');


      if (response.data) {
        setMessage('¡Registro exitoso! Bienvenido a UrbanStand.')

        // Guardar el token si se devuelve uno
        if (response.data.token) {
          localStorage.setItem('urbanstand_token', response.data.token)
        }

        // Limpiar formulario después del registro exitoso
        setTimeout(() => {
          setFirstName('')
          setLastName('')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          setNumDoc('')
          setDireccion('')
          setGenero('')
          setTypeDoc('CC')
          setNumTel('')
          setSelectedProducts([])
          setTerms(false)
          setMessage('')

          // Opcional: redirigir al login
          // onBackToRoles()
        }, 3000)
      }

    } catch (error) {
      console.error('Error en registro:', error)

      if (error.response && error.response.data) {
        // Error del servidor con respuesta
        if (error.response.data.details) {
          // Errores de validación
          const backendErrors = error.response.data.details.map(detail => detail.msg).join(' ')
          setMessage(backendErrors)
        } else {
          // Otros errores del servidor
          setMessage(error.response.data.message || error.response.data.error || 'Error en el servidor')
        }
      } else if (error.request) {
        // Error de conexión
        setMessage('Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:3005')
      } else {
        // Otros errores
        setMessage('Error inesperado. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const toggleConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  }

  const handleProductChange = (product, isChecked) => {
    if (isChecked) {
      // Solo permitir una selección para coincidir con el backend
      setSelectedProducts([product])
    } else {
      setSelectedProducts(prev => prev.filter(p => p !== product))
    }
  }

  const passwordRequirements = validatePassword(password)

  return (
    <div className="register-container">
      <header className="register-header">
        <div className="register-header-content">
          <div className="logo">
            <img className="logo-img" src="../img/logo.png" alt="logo" />
            UrbanStand
          </div>
        </div>
      </header>

        <div className="register-content">
          <div className="register-box">
            <button onClick={onBackToRoles} className="back-button">
              ← Volver a selección de roles
            </button>

            <h2 className="register-title">Vendedor, ¡Regístrate!</h2>

            <div className="register-form">
              {/* Nombre y Apellido */}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Género */}
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                    <span>Otro</span>
                  </label>
                </div>
              </div>

              {/* Tipo de documento */}
              <div className="register-input-group">
                <label className="register-label">Tipo de documento</label>
                <select
                  value={TypeDoc}
                  onChange={(e) => setTypeDoc(e.target.value)}
                  className="register-input"
                  required
                  disabled={loading}
                >
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </div>

              {/* Número de documento */}
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
                  disabled={loading}
                />
              </div>

              {/* Dirección de trabajo */}
              <div className="register-input-group">
                <label className="register-label">Dirección de su puesto de trabajo</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Tal cual tiene que escribri la direccion calle NUm letra(2) sur #num-num,texto(barrio)'
                  className="register-input"
                  required
                  disabled={loading}
                />
              </div>

              {/* Categoría de producto (solo una) */}
              <div className="register-input-group">
                <label className="register-label">Categoría de producto principal</label>
                <div className="register-products-grid">
                  {productsList.map((product, index) => (
                    <div key={index} className="register-product-item">
                      <input
                        type="radio"
                        id={`product-${index}`}
                        name="categoria_producto"
                        className="register-product-checkbox"
                        checked={selectedProducts.includes(product)}
                        onChange={(e) => handleProductChange(product, e.target.checked)}
                        disabled={loading}
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
                  {selectedProducts.length} categoría seleccionada
                </div>
              </div>

              {/* Número de teléfono */}
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
                  disabled={loading}
                />
              </div>

              {/* Email */}
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
                  disabled={loading}
                />
              </div>

              {/* Contraseña */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="register-eye-button"
                    disabled={loading}
                  >
                    <svg className="register-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {isPasswordVisible ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
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

              {/* Confirmar contraseña */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="register-eye-button"
                    disabled={loading}
                  >
                    <svg className="register-eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {isConfirmPasswordVisible ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="register-checkbox-container">
                <label className="register-checkbox-label">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="register-checkbox"
                    required
                    disabled={loading}
                  />
                  <p className="register-checkbox-text">
                    He leído y acepto los

                    <a href="../POLÍTICA DE PRIVACIDAD Y TÉRMINOS Y CONDICIONES URBANSTAND.pdf"> Términos y condiciones </a>
                    y la
                    <a href="../CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE DATOS PERSONALES URBANSTAND.pdf"> Política de Privacidad.</a>;
                  </p>
                </label>
              </div>

              {/* Botón de registro */}
              <button
                type="button"
                onClick={handleSubmit}
                className="register-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" />
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>

              {/* Link al login */}
              <div className="register-toggle-container">
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="register-toggle-button"
                  disabled={loading}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>

              {/* Mensaje de respuesta */}
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
      );
}

