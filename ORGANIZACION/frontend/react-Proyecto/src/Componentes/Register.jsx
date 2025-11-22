import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../Componentes/Breadcrumbs';


export default function Register({ onBackToRoles, onGoToLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [localidad, setLocalidad] = useState('')
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
  const [errors, setErrors] = useState({})

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
    'Otros',
  ]

  const localidadesBogota = [
    'Antonio Nariño',
    'Barrios Unidos',
    'Bosa',
    'Chapinero',
    'Ciudad Bolívar',
    'Engativá',
    'Fontibón',
    'Kennedy',
    'La Candelaria',
    'Los Mártires',
    'Puente Aranda',
    'Rafael Uribe Uribe',
    'San Cristóbal',
    'Santa Fe',
    'Suba',
    'Sumapaz',
    'Teusaquillo',
    'Tunjuelito',
    'Usaquén',
    'Usme',
  ]

  const mostrarModal = () => {
    Swal.fire({
      title: 'Consentimiento de Tratamiento de Datos',
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
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Acepto',
      cancelButtonText: 'No acepto',
      confirmButtonColor: '#9a1e22',
      cancelButtonColor: '#6c757d',
      width: '600px',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Consentimiento aceptado!', '', 'success')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('No aceptaste el consentimiento', '', 'error')
      }
    })
  }

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
        max-width: 600px;
        background: white;
        padding: 2rem 1.5rem;
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
        gap: 1.2rem;
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
        margin-top: 0.5rem;
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
        padding: 0.75rem;
        background: #fff7ed;
        border: 1px solid #fed7aa;
        border-radius: 0.5rem;
        font-size: 0.875rem;
      }

      .password-requirement {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0;
        transition: all 0.2s ease;
      }

      .password-requirement.valid {
        color: #16a34a;
      }

      .password-requirement.invalid {
        color: #666;
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
          padding: 1.5rem;
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

  const validatePassword = (pass) => {
    return {
      minLength: pass.length >= 8,
      hasUppercase: /[A-Z]/.test(pass),
      hasLowercase: /[a-z]/.test(pass),
      hasNumber: /\d/.test(pass),
    }
  }

  const validatePhoneNumber = (phone) => {
    const colombianPhoneRegex = /^3\d{9}$/
    return colombianPhoneRegex.test(phone.replace(/\s/g, ''))
  }

  const ValidateAddress = (address) => {
    const direccionRegex =
      /^(Calle|Carrera|Transversal|Diagonal|Avenida|Av\.?|Cr|Cl)\s?\d+[A-Za-z]{0,2}(?:\s?Bis)?(?:\s?(Sur|Este|Oeste))?\s?#\d+[A-Za-z]?-?\d*(?:,\s?.+)?$/i
    return direccionRegex.test(address)
  }

  const handleSubmit = async () => {
    const newErrors = {}
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio.'
    } else if (firstName.length > 30) {
      newErrors.firstName = 'Su nombre no debe tener más de 30 caracteres.'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio.'
    } else if (lastName.length > 30) {
      newErrors.lastName = 'Su apellido no debe tener más de 30 caracteres.'
    }

    if (!genero) {
      newErrors.genero = 'Debes elegir una opción de género.'
    }

    if (numDoc.length < 6 || numDoc.length > 10) {
      newErrors.numDoc = 'El número de documento debe tener entre 6 y 10 dígitos.'
    }

    if (!rivi) {
      newErrors.rivi = 'La imagen del RIVI Y HEMI es requerida.'
    }

    if (!ValidateAddress(direccion)) {
      newErrors.direccion = 'La dirección debe ser válida y compatible con Bogotá.'
    }

    if (!localidad) {
      newErrors.localidad = 'Debes seleccionar la localidad donde trabajas.'
    }

    if (!vigencia) {
      newErrors.vigencia = 'Debes elegir una opción de vigencia.'
    }

    if (selectedProducts.length === 0) {
      newErrors.selectedProducts = 'Debes seleccionar al menos una categoría de productos.'
    }

    if (!validatePhoneNumber(NumTel)) {
      newErrors.NumTel = 'El número debe tener 10 dígitos y empezar con 3.'
    }

    if (!emailRegex.test(email)) {
      newErrors.email = 'El email no es válido.'
    }

    if (!terms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones.'
    }

    const passwordRequirements = validatePassword(password)
    if (!passwordRequirements.minLength || !passwordRequirements.hasUppercase || 
        !passwordRequirements.hasLowercase || !passwordRequirements.hasNumber) {
      newErrors.password = 'La contraseña no cumple todos los requisitos.'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          'http://localhost:3005/api/auth/register',
          {
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
              localidad,
              rivi,
              vigencia,
            }),
          }
        )
        const data = await response.json()

        if (response.ok) {
          setMessage('¡Registro exitoso! Redirigiendo al login...')

          try {
            const existing = JSON.parse(
              localStorage.getItem('urbanstand_users') || '{}'
            )
            const key = (email || '').trim().toLowerCase()
            existing[key] = {
              role: 'vendedor',
              firstName,
              lastName,
              genero,
            }
            localStorage.setItem('urbanstand_users', JSON.stringify(existing))
          } catch (e) {
            console.error('Error guardando perfil en localStorage:', e)
          }

          setTimeout(() => {
            if (onGoToLogin) {
              setFirstName('')
              setLastName('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')
              setNumDoc('')
              setDireccion('')
              setLocalidad('')
              setGenero('')
              setTypeDoc('CC')
              setRivi(null)
              setVigencia('')
              setNumTel('')
              setTerms(false)
              setSelectedProducts([])
              setMessage('')
              onGoToLogin()
            } else {
              navigate('/verificar-email', {
                state: {
                  email: email,
                  tipoUsuario: 'vendedor',
                  nombre: firstName,
                }
              });
            }
          }, 2000)
        } else {
          setMessage(data.message || data.error || 'Error en el registro')
        }
      } catch (error) {
        console.error('Error en registro:', error)
        setMessage(
          'Error en el registro. Por favor, inténtalo de nuevo más tarde.'
        )
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRivi(file.name)
      setErrors(prev => ({ ...prev, rivi: '' }))
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
    setErrors(prev => ({ ...prev, selectedProducts: '' }))
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
              } else {
                navigate('/register-roles')
              }
            }}
            className="back-button"
          >
            ← Volver a selección de roles
          </button>

          <h2 className="register-title">Vendedor, ¡Regístrate!</h2>

          <div className="register-form">
            <div className="register-name-group">
              <div className="register-input-group">
                <label className="register-label">Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    setErrors(prev => ({ ...prev, firstName: '' }))
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Primer nombre"
                  className="register-input"
                  required
                />
                {errors.firstName && (
                  <div className="register-message register-message-error">
                    {errors.firstName}
                  </div>
                )}
              </div>
              <div className="register-input-group">
                <label className="register-label">Apellido</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    setErrors(prev => ({ ...prev, lastName: '' }))
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Primer apellido"
                  className="register-input"
                  required
                />
                {errors.lastName && (
                  <div className="register-message register-message-error">
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            <div className="register-input-group">
              <label className="register-label">Género</label>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="genero"
                    value="masculino"
                    checked={genero === 'masculino'}
                    onChange={(e) => {
                      setGenero(e.target.value)
                      setErrors(prev => ({ ...prev, genero: '' }))
                    }}
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
                    onChange={(e) => {
                      setGenero(e.target.value)
                      setErrors(prev => ({ ...prev, genero: '' }))
                    }}
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
                    onChange={(e) => {
                      setGenero(e.target.value)
                      setErrors(prev => ({ ...prev, genero: '' }))
                    }}
                    className="register-radio"
                  />
                  <span>Otro</span>
                </label>
              </div>
              {errors.genero && (
                <div className="register-message register-message-error">
                  {errors.genero}
                </div>
              )}
            </div>

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

            <div className="register-input-group">
              <label className="register-label">Número de documento</label>
              <input
                type="text"
                value={numDoc}
                onChange={(e) => {
                  setNumDoc(e.target.value)
                  setErrors(prev => ({ ...prev, numDoc: '' }))
                }}
                onKeyPress={handleKeyPress}
                placeholder="Número de identificación"
                className="register-input"
                required
              />
              {errors.numDoc && (
                <div className="register-message register-message-error">
                  {errors.numDoc}
                </div>
              )}
            </div>

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
              {errors.rivi && (
                <div className="register-message register-message-error">
                  {errors.rivi}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">
                Dirección de su puesto de trabajo
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => {
                  setDireccion(e.target.value)
                  setErrors(prev => ({ ...prev, direccion: '' }))
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ej. Calle 100 #15-55, barrio Barrios Unidos"
                className="register-input"
                required
              />
              {errors.direccion && (
                <div className="register-message register-message-error">
                  {errors.direccion}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">Localidad donde trabaja</label>
              <select
                value={localidad}
                onChange={(e) => {
                  setLocalidad(e.target.value)
                  setErrors(prev => ({ ...prev, localidad: '' }))
                }}
                onKeyPress={handleKeyPress}
                className="register-input"
                required
              >
                <option value="">Seleccione una localidad</option>
                {localidadesBogota.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.localidad && (
                <div className="register-message register-message-error">
                  {errors.localidad}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">Vigencia</label>
              <div className="register-radio-group">
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="vigencia"
                    value="activo"
                    checked={vigencia === 'activo'}
                    onChange={(e) => {
                      setVigencia(e.target.value)
                      setErrors(prev => ({ ...prev, vigencia: '' }))
                    }}
                    className="register-radio"
                  />
                  <span>Vigente</span>
                </label>
                <label className="register-radio-label">
                  <input
                    type="radio"
                    name="vigencia"
                    value="inactivo"
                    checked={vigencia === 'inactivo'}
                    onChange={(e) => {
                      setVigencia(e.target.value)
                      setErrors(prev => ({ ...prev, vigencia: '' }))
                    }}
                    className="register-radio"
                  />
                  <span>Vencido</span>
                </label>
              </div>
              {errors.vigencia && (
                <div className="register-message register-message-error">
                  {errors.vigencia}
                </div>
              )}
            </div>

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
              {errors.selectedProducts && (
                <div className="register-message register-message-error">
                  {errors.selectedProducts}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">Número de teléfono</label>
              <input
                type="text"
                value={NumTel}
                onChange={(e) => {
                  setNumTel(e.target.value)
                  setErrors(prev => ({ ...prev, NumTel: '' }))
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ej. 3123456789"
                className="register-input"
                required
              />
              {errors.NumTel && (
                <div className="register-message register-message-error">
                  {errors.NumTel}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors(prev => ({ ...prev, email: '' }))
                }}
                onKeyPress={handleKeyPress}
                placeholder="email@correo.com"
                className="register-input"
                required
              />
              {errors.email && (
                <div className="register-message register-message-error">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">Contraseña</label>
              <div className="register-password-container">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors(prev => ({ ...prev, password: '' }))
                  }}
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
              
              <div className="password-requirements">
                <div className={`password-requirement ${passwordRequirements.minLength ? 'valid' : 'invalid'}`}>
                  Mínimo 8 caracteres
                </div>
                <div className={`password-requirement ${passwordRequirements.hasUppercase ? 'valid' : 'invalid'}`}>
                  Al menos una letra mayúscula
                </div>
                <div className={`password-requirement ${passwordRequirements.hasLowercase ? 'valid' : 'invalid'}`}>
                  Al menos una letra minúscula
                </div>
                <div className={`password-requirement ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}>
                  Al menos un número
                </div>
              </div>
              {errors.password && (
                <div className="register-message register-message-error">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label className="register-label">Confirmar contraseña</label>
              <div className="register-password-container">
                <input
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors(prev => ({ ...prev, confirmPassword: '' }))
                  }}
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
              {errors.confirmPassword && (
                <div className="register-message register-message-error">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="register-checkbox-container">
              <label className="register-checkbox-label">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => {
                    setTerms(e.target.checked)
                    setErrors(prev => ({ ...prev, terms: '' }))
                  }}
                  className="register-checkbox"
                  required
                />
                <p className="register-checkbox-text">
                  He leído y acepto los
                  <a href="../POLÍTICA DE PRIVACIDAD Y TÉRMINOS Y CONDICIONES URBANSTAND.pdf">
                    {' '}
                    Términos y condiciones
                  </a>
                </p>
              </label>
            </div>
            {errors.terms && (
              <div className="register-message register-message-error">
                {errors.terms}
              </div>
            )}

            <div>
              <button onClick={mostrarModal} className="back-button" style={{marginBottom: '0'}}>
                Ver Consentimiento de Datos
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="register-submit-button"
              disabled={!terms}
            >
              Registrarse
            </button>

            <div className="register-toggle-container">
              <button
                type="button"
                onClick={goToLogin}
                className="register-toggle-button"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>

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