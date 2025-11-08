import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../Componentes/Breadcrumbs';

export default function RegistroEntidades({ onBackToRoles, onGoToLogin }) {
  const navigate = useNavigate()

  const [nomEnti, setNomEnti] = useState('')
  const [tipoE, setTipoE] = useState('')
  const [sector, setSector] = useState('')
  const [nit, setNit] = useState('')
  const [emailE, setEmailE] = useState('')
  const [NumTelE, setNumTelE] = useState('')
  const [direccionE, setDireccionE] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPasswordE, setConfirmPasswordE] = useState('')
  const [terms, setTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  
  // Estados para errores individuales
  const [errors, setErrors] = useState({
    nomEnti: '',
    tipoE: '',
    sector: '',
    nit: '',
    emailE: '',
    NumTelE: '',
    direccionE: '',
    password: '',
    confirmPasswordE: '',
    terms: ''
  })

  useEffect(() => {
    const style = document.createElement('style')
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

      .back-button {
        background: #9a1e22;
        border: 2px solid #9a1e22;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        margin-bottom: 1rem;
        width: 100%;
      }

      .back-button:hover {
        background: transparent;
        color: #9a1e22;
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

      .field-error {
        color: #dc2626;
        background: #fef2f2;
        border: 1px solid #fecaca;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        font-weight: 500;
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

        .register-name-group {
          flex-direction: column;
          gap: 1.5rem;
        }

        .register-radio-group {
          flex-direction: column;
          gap: 0.8rem;
        }
      }
    `

    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const validatePassword = (pass) => {
    const requirements = {
      minLength: pass.length >= 8,
      hasUppercase: /[A-Z]/.test(pass),
      hasLowercase: /[a-z]/.test(pass),
      hasNumber: /\d/.test(pass),
    }
    return requirements
  }

  const validatePhoneNumber = (phone) => {
    const colombianPhoneRegex = /^3\d{9}$/
    return colombianPhoneRegex.test(phone.replace(/\s/g, ''))
  }

  const handleSubmit = async () => {
    let newErrors = {
      nomEnti: '',
      tipoE: '',
      sector: '',
      nit: '',
      emailE: '',
      NumTelE: '',
      direccionE: '',
      password: '',
      confirmPasswordE: '',
      terms: ''
    }
    
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    // Validaciones individuales
    if (!nomEnti.trim()) {
      newErrors.nomEnti = 'El nombre de la empresa es obligatorio.'
    } else if (nomEnti.length > 100) {
      newErrors.nomEnti = 'El nombre de la empresa no debe exceder más de 100 caracteres.'
    }

    if (!tipoE) newErrors.tipoE = '¿De qué tipo es tu entidad?'
    if (!sector) newErrors.sector = '¿A qué sector pertenece tu entidad?'
    if (!nit.trim()) newErrors.nit = 'El NIT es requerido.'
    if (!emailRegex.test(emailE)) newErrors.emailE = 'El email no es válido.'

    // Validación de la dirección
const ValidateAddressEnti = (direccionE) => {
  const direccionRegex = /^(Calle|Carrera|Transversal|Diagonal|Avenida|Autopista|Circunvalar|Av\.?|Kr\.?|Cr\.?|Cl\.?|Tv\.?|Dg\.?|Ac\.?|Ak\.?|Cra\.?)\s*\d+[A-Za-z]*(?:\s*(?:Bis|Sur|Norte|Este|Oeste|A|B|C))?\s*(?:#|No\.?|Nro\.?|N°)\s*\d+[A-Za-z]*(?:\s*[-–]\s*\d+[A-Za-z]*)?(?:\s*(?:Apt|Apto|Apartamento|Of|Oficina|Local|Int|Interior|Piso|Torre|Bloque|Casa|Lote)\s*[A-Za-z0-9]+)?/i
  return direccionRegex.test(direccionE)
}
    if (!validatePhoneNumber(NumTelE)) {
      newErrors.NumTelE = 'El número telefónico debe ser válido y compatible con Colombia (formato: 3XXXXXXXXX).'
    }

    if (!ValidateAddressEnti(direccionE)) {
      newErrors.direccionE = 'La dirección debe ser válida y compatible con el formato requerido.'
    }

    const passwordRequirements = validatePassword(password)
    let passwordErrors = []
    if (!passwordRequirements.minLength) passwordErrors.push('Mínimo 8 caracteres')
    if (!passwordRequirements.hasUppercase) passwordErrors.push('Al menos una letra mayúscula')
    if (!passwordRequirements.hasLowercase) passwordErrors.push('Al menos una letra minúscula')
    if (!passwordRequirements.hasNumber) passwordErrors.push('Al menos un número')
    
    if (passwordErrors.length > 0) {
      newErrors.password = 'La contraseña debe contener: ' + passwordErrors.join(', ') + '.'
    }

    if (password !== confirmPasswordE) {
      newErrors.confirmPasswordE = 'Las contraseñas no coinciden.'
    }
    
    if (!terms) newErrors.terms = 'Debes aceptar los términos y condiciones.'

    setErrors(newErrors)

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== '')
    if (hasErrors) {
      return
    }

    try {
      setMessage('Registrando entidad...')
      const registroData = {
        nomEnti,
        tipoE,
        sector,
        nit,
        emailE,
        NumTelE,
        direccionE,
        password,
      }

      // Aquí iría la llamada a tu API
      // const response = await apiService.entidad.register(registroData)
      
      setMessage('¡Registro exitoso! Redirigiendo al login...')
      setTimeout(() => {
        if (typeof onGoToLogin === 'function') onGoToLogin()
      }, 2000)
    } catch (error) {
      console.error('Error en registro:', error)
      const backendMsg = error?.message || 'No se pudo registrar la entidad.'
      setMessage(`Error: ${backendMsg}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const toggleConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  }

  const passwordRequirements = validatePassword(password)

  return (
    <div className="register-container">
      <Breadcrumbs />
      <div className="register-content">
        <div className="register-box">
          <button
            onClick={() => {
              if (typeof onBackToRoles === 'function') {
                onBackToRoles()
              }
            }}
            className="back-button"
          >
            ← Volver a selección de roles
          </button>

          <h2 className="register-title">Entidad, ¡Registrate!</h2>

          <div className="register-form">
            {/* Name Input */}
            <div className="register-input-group">
              <label className="register-label">Nombre entidad</label>
              <input
                type="text"
                value={nomEnti}
                onChange={(e) => setNomEnti(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nombre de la entidad"
                className="register-input"
                required
              />
              {errors.nomEnti && (
                <div className="field-error">{errors.nomEnti}</div>
              )}
            </div>

            {/* Tipo entidad Input */}
            <div className="register-input-group">
              <label className="register-label">Tipo de entidad</label>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="tipoE"
                    value="publica"
                    checked={tipoE === 'publica'}
                    onChange={(e) => setTipoE(e.target.value)}
                    className="register-radio"
                  />
                  <span>Pública</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="tipoE"
                    value="privada"
                    checked={tipoE === 'privada'}
                    onChange={(e) => setTipoE(e.target.value)}
                    className="register-radio"
                  />
                  <span>Privada</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="tipoE"
                    value="ong"
                    checked={tipoE === 'ong'}
                    onChange={(e) => setTipoE(e.target.value)}
                    className="register-radio"
                  />
                  <span>ONG</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="tipoE"
                    value="universidad"
                    checked={tipoE === 'universidad'}
                    onChange={(e) => setTipoE(e.target.value)}
                    className="register-radio"
                  />
                  <span>Universidad</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="tipoE"
                    value="otro"
                    checked={tipoE === 'otro'}
                    onChange={(e) => setTipoE(e.target.value)}
                    className="register-radio"
                  />
                  <span>Otro</span>
                </label>
              </div>
              {errors.tipoE && (
                <div className="field-error">{errors.tipoE}</div>
              )}
            </div>

            {/* Sector entidad Input */}
            <div className="register-input-group">
              <label className="register-label">Sector</label>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="sector"
                    value="comercio"
                    checked={sector === 'comercio'}
                    onChange={(e) => setSector(e.target.value)}
                    className="register-radio"
                  />
                  <span>Comercio</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="sector"
                    value="investigacion"
                    checked={sector === 'investigacion'}
                    onChange={(e) => setSector(e.target.value)}
                    className="register-radio"
                  />
                  <span>Investigación</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="sector"
                    value="gubernamental"
                    checked={sector === 'gubernamental'}
                    onChange={(e) => setSector(e.target.value)}
                    className="register-radio"
                  />
                  <span>Gubernamental</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="sector"
                    value="otro"
                    checked={sector === 'otro'}
                    onChange={(e) => setSector(e.target.value)}
                    className="register-radio"
                  />
                  <span>Otro</span>
                </label>
              </div>
              {errors.sector && (
                <div className="field-error">{errors.sector}</div>
              )}
            </div>

            {/* NIT Input */}
            <div className="register-input-group">
              <label className="register-label">NIT</label>
              <input
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Número de identificación Tributaria"
                className="register-input"
                required
              />
              {errors.nit && (
                <div className="field-error">{errors.nit}</div>
              )}
            </div>

            {/* Email Input */}
            <div className="register-input-group">
              <label className="register-label">
                Correo electrónico institucional
              </label>
              <input
                type="email"
                value={emailE}
                onChange={(e) => setEmailE(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="email@correo.com"
                className="register-input"
                required
              />
              {errors.emailE && (
                <div className="field-error">{errors.emailE}</div>
              )}
            </div>

            {/* Numero de telefono Input */}
            <div className="register-input-group">
              <label className="register-label">
                Número telefónico institucional
              </label>
              <input
                type="text"
                value={NumTelE}
                onChange={(e) => setNumTelE(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej. 3123456789"
                className="register-input"
                required
              />
              {errors.NumTelE && (
                <div className="field-error">{errors.NumTelE}</div>
              )}
            </div>

            {/* Direccion Input */}
            <div className="register-input-group">
              <label className="register-label">
                Dirección (sede principal)
              </label>
              <input
                type="text"
                value={direccionE}
                onChange={(e) => ValidateAddressEnti(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej. Calle 100 #15-55, barrio Barrios Unidos"
                className="register-input"
                required
              />
              {errors.direccionE && (
                <div className="field-error">{errors.direccionE}</div>
              )}
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
                  placeholder="Ej. MiContra123"
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
                  <div
                    className={`password-requirement ${passwordRequirements.minLength ? 'valid' : 'invalid'}`}
                  >
                    {passwordRequirements.minLength ? '✓' : '✗'} Mínimo 8
                    caracteres
                  </div>
                  <div
                    className={`password-requirement ${passwordRequirements.hasUppercase ? 'valid' : 'invalid'}`}
                  >
                    {passwordRequirements.hasUppercase ? '✓' : '✗'} Al menos una
                    letra mayúscula
                  </div>
                  <div
                    className={`password-requirement ${passwordRequirements.hasLowercase ? 'valid' : 'invalid'}`}
                  >
                    {passwordRequirements.hasLowercase ? '✓' : '✗'} Al menos una
                    letra minúscula
                  </div>
                  <div
                    className={`password-requirement ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}
                  >
                    {passwordRequirements.hasNumber ? '✓' : '✗'} Al menos un
                    número
                  </div>
                </div>
              )}
              {errors.password && (
                <div className="field-error">{errors.password}</div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="register-input-group">
              <label className="register-label">Confirmar contraseña</label>
              <div className="register-password-container">
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPasswordE}
                  onChange={(e) => setConfirmPasswordE(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirmar contraseña"
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
              {errors.confirmPasswordE && (
                <div className="field-error">{errors.confirmPasswordE}</div>
              )}
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
                  Declaro que la entidad hace uso de la información solo con
                  fines estadísticos y respetando la privacidad de los
                  vendedores
                </p>
              </label>
            </div>
            {errors.terms && (
              <div className="field-error">{errors.terms}</div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="register-submit-button"
            >
              Registrarse
            </button>

            {/* Message */}
            {message && (
              <div
                className={`register-message ${
                  message.includes('exitoso')
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