import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContex.jsx'
import Breadcrumbs from '../Componentes/Breadcrumbs';


export default function Login({ onSuccessfulLogin, onGoToRegister }) {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isRegistrationMode] = useState(false)
  const [role, setRole] = useState('vendedor')
  const [isSubmitting, setIsSubmitting] = useState(false)

  //Estados para el control de intentos y bloqueo
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(null)
  const [remainingTime, setRemainingTime] = useState(0)

  const LOCKOUT_DURATION = 30 * 60 * 1000 // 30 minutos en milisegundos
  const MAX_ATTEMPTS = 3

  //Verificar si hay un bloqueo activo al cargar el componente
  useEffect(() => {
    const storedLockout = localStorage.getItem('login_lockout_time')
    const storedAttempts = localStorage.getItem('login_failed_attempts')

    if (storedLockout) {
      const lockTime = parseInt(storedLockout)
      const now = Date.now()

      if (now < lockTime) {
        // Aún está bloqueado
        setIsLocked(true)
        setLockoutTime(lockTime)
        setFailedAttempts(MAX_ATTEMPTS)
        console.log('Cuenta bloqueada detectada al cargar')
      } else {
        // El bloqueo expiró, limpiar
        localStorage.removeItem('login_lockout_time')
        localStorage.removeItem('login_failed_attempts')
        console.log('Bloqueo expirado, limpiando datos')
      }
    } else if (storedAttempts) {
      const attempts = parseInt(storedAttempts)
      setFailedAttempts(attempts)
      console.log(`Intentos fallidos previos: ${attempts}`)
    }
  }, [])

  //Timer para mostrar tiempo restante de bloqueo
  useEffect(() => {
    if (!isLocked || !lockoutTime) return

    const timer = setInterval(() => {
      const now = Date.now()
      const remaining = lockoutTime - now

      if (remaining <= 0) {
        // El bloqueo expiró
        setIsLocked(false)
        setLockoutTime(null)
        setFailedAttempts(0)
        setRemainingTime(0)
        localStorage.removeItem('login_lockout_time')
        localStorage.removeItem('login_failed_attempts')
        setMessage('')
        console.log('Bloqueo expirado, cuenta desbloqueada')
      } else {
        setRemainingTime(remaining)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isLocked, lockoutTime])

  // Formatear tiempo restante (MM:SS)
  const formatRemainingTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  //Registrar intento fallido
  const registerFailedAttempt = () => {
    const newAttempts = failedAttempts + 1
    setFailedAttempts(newAttempts)
    localStorage.setItem('login_failed_attempts', newAttempts.toString())
    console.log(`Intento fallido registrado: ${newAttempts}/${MAX_ATTEMPTS}`)

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockTime = Date.now() + LOCKOUT_DURATION
      setIsLocked(true)
      setLockoutTime(lockTime)
      localStorage.setItem('login_lockout_time', lockTime.toString())
      setMessage(
        `Has alcanzado el máximo de intentos fallidos. La cuenta está bloqueada por 30 minutos.`
      )
      console.log('Cuenta bloqueada por 30 minutos')
    } else {
      setMessage(
        `Credenciales incorrectas. Intento ${newAttempts} de ${MAX_ATTEMPTS}.`
      )
    }
  }

  //Resetear intentos fallidos tras login exitoso
  const resetFailedAttempts = () => {
    setFailedAttempts(0)
    setIsLocked(false)
    setLockoutTime(null)
    localStorage.removeItem('login_failed_attempts')
    localStorage.removeItem('login_lockout_time')
    console.log('Intentos fallidos reseteados')
  }

  const handleSubmit = async () => {
    // Verificar si está bloqueado
    if (isLocked) {
      setMessage(
        `Cuenta bloqueada. Intenta nuevamente en ${formatRemainingTime(remainingTime)}.`
      )
      console.log('Intento de login bloqueado')
      return
    }

    //Prevenir múltiples submits
    if (isSubmitting) {
      console.log('Ya hay un login en proceso, ignorando...')
      return
    }

    let errors = ''
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    if (!emailRegex.test(email)) {
      errors += 'El email no es válido. '
    }
    if (password.length < 8) {
      errors += 'La contraseña debe tener al menos 8 caracteres. '
    }

    if (errors !== '') {
      setMessage(errors)
      return //Salir sin bloquear
    }

    setIsSubmitting(true) //Bloquear SOLO si las validaciones pasaron
    setMessage('Iniciando sesión...')

    if (!isRegistrationMode) {
      try {
        if (role === 'entidad') {
          const loginResp = await apiService.entidad.login({
            emailE: email,
            password,
          })

          console.log('Respuesta de login entidad:', loginResp)

          // Verificar si hay token en la respuesta
          if (!loginResp?.token) {
            console.warn('No se recibió token en la respuesta')
            registerFailedAttempt()
            setMessage(
              'Credenciales incorrectas. Por favor intenta nuevamente.'
            )
            return
          }

          // ✅ Validación de email verificado AQUÍ
          if (loginResp?.entidad?.emailVerificado === false) {
            setMessage(
              '⚠️ Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
            )
            navigate('/verificar-email', {
              state: {
                email: email,
                tipoUsuario: 'entidad',
                nombre: loginResp?.entidad?.nomEnti,
              },
            })
            return
          }

          //Login exitoso - resetear intentos
          resetFailedAttempts()

          const token = apiService.saveAuth(loginResp.token, 'entidad')
          console.log('Token guardado:', token)
          console.log('Token en localStorage:', localStorage.getItem('token'))
          const profileResponse = await apiService.entidad.profile(token)
          const profile = profileResponse?.vendedor || profileResponse

          const entidadData = {
            email,
            nomEnti:
              profile?.nombre_entidad ||
              profile?.nomEnti ||
              profile?.nombre ||
              undefined,
          }

          try {
            const allEntidades = JSON.parse(
              localStorage.getItem('urbanstand_entidades') || '{}'
            )
            const emailKey = email.trim().toLowerCase()
            allEntidades[emailKey] = entidadData
            localStorage.setItem(
              'urbanstand_entidades',
              JSON.stringify(allEntidades)
            )
          } catch {
            /* ignore */
          }

          // Usar el contexto de autenticación
          const entidadUserData = {
            role: 'entidad',
            email,
            nomEnti: entidadData.nomEnti,
          }

          // Llamar a authLogin que actualiza el estado y localStorage
          const loginSuccess = authLogin(loginResp.token, entidadUserData)

          if (loginSuccess) {
            setMessage('Inicio de sesión exitoso.')
            if (typeof onSuccessfulLogin === 'function') {
              onSuccessfulLogin('entidad', entidadData)
            }
            // Usar setTimeout para asegurar que el estado se actualice antes de navegar
            setTimeout(() => {
              navigate('/entidades', { replace: true })
            }, 100)
          }
          return
        } else if (role === 'vendedor') {
          const loginResp = await apiService.vendedor.login({ email, password })
          console.log('Respuesta completa del backend:', loginResp)

          // Verificar si hay token en la respuesta
          if (!loginResp?.token) {
            console.warn('No se recibió token en la respuesta')
            registerFailedAttempt() //Registrar intento fallido
            setMessage(
              'Credenciales incorrectas. Por favor intenta nuevamente.'
            )
            return
          }

          if (loginResp?.vendedor?.emailVerificado === false) {
            setMessage(
              '⚠️ Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
            )
            navigate('/verificar-email', {
              state: {
                email: email,
                tipoUsuario: 'vendedor',
                nombre: loginResp?.vendedor?.firstName,
              },
            })
            return
          }

          // ✅ Login exitoso - resetear intentos
          resetFailedAttempts()

          const token = apiService.saveAuth(loginResp.token, 'vendedor')
          console.log('Token guardado:', token)
          console.log('Token en localStorage:', localStorage.getItem('token'))

          const profileResponse = await apiService.vendedor.profile(token)
          console.log('Perfil recibido:', profileResponse)

          const profile = profileResponse?.vendedor || profileResponse
          console.log('Campos del perfil:', {
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            genero: profile?.genero,
            email: profile?.email,
          })

          const vendorData = {
            email,
            firstName: profile?.firstName || profile?.nombre || undefined,
            lastName: profile?.lastName || profile?.apellido || undefined,
            genero: profile?.genero || undefined,
          }

          console.log('Datos a guardar en localStorage:', vendorData)

          try {
            const allUsers = JSON.parse(
              localStorage.getItem('urbanstand_users') || '{}'
            )
            const emailKey = email.trim().toLowerCase()
            allUsers[emailKey] = vendorData
            localStorage.setItem('urbanstand_users', JSON.stringify(allUsers))
          } catch {
            /* ignore */
          }

          // Usar el contexto de autenticación
          const vendedorUserData = {
            role: 'vendedor',
            email,
            firstName: vendorData?.firstName,
            lastName: vendorData?.lastName,
            genero: vendorData?.genero,
          }

          // Llamar a authLogin que actualiza el estado y localStorage
          const loginSuccess = authLogin(token, vendedorUserData)

          if (loginSuccess) {
            setMessage('Inicio de sesión exitoso.')
            if (typeof onSuccessfulLogin === 'function') {
              onSuccessfulLogin('vendedor', vendorData)
            }
            // Usar setTimeout para asegurar que el estado se actualice antes de navegar
            setTimeout(() => {
              navigate('/vendedor', { replace: true })
            }, 100)
          }
          return
        }
      } catch (error) {
        console.error('Error de login:', error)
        console.error('Tipo de error:', typeof error)
        console.error('Error completo:', JSON.stringify(error, null, 2))

        // Mensajes de error más específicos
        let errorMessage = 'Error iniciando sesión'
        let isCredentialError = false

        if (error?.message) {
          const msg = error.message.toLowerCase()
          console.log('Mensaje de error:', msg)

          if (
            msg.includes('password') ||
            msg.includes('contraseña') ||
            msg.includes('credencial') ||
            msg.includes('incorrect') ||
            msg.includes('incorrectos') ||
            msg.includes('unauthorized') ||
            msg.includes('401') ||
            msg.includes('inválidas') ||
            msg.includes('user') ||
            msg.includes('usuario') ||
            msg.includes('not found') ||
            msg.includes('no encontrado')
          ) {
            isCredentialError = true
            errorMessage =
              'Credenciales incorrectas. Por favor verifica tu email y contraseña.'
          } else {
            errorMessage = error.message
          }
        } else if (error?.response?.status === 401 || error?.status === 401) {
          isCredentialError = true
          errorMessage =
            'Credenciales incorrectas. Por favor verifica tu email y contraseña.'
        }

        //Registrar intento fallido solo si es error de credenciales
        if (isCredentialError) {
          registerFailedAttempt()
        } else {
          setMessage(errorMessage)
        }
      } finally {
        setIsSubmitting(false) //Siempre desbloquear al finalizar
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting && !isLocked) {
      e.preventDefault() //Prevenir submit del form
      handleSubmit()
    }
  }

  const toggleMode = () => {
    if (onGoToRegister) {
      onGoToRegister()
    } else {
      navigate('/register-roles')
    }
  }

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className="login-container">
      <Breadcrumbs />
      {/* Login Container */}
      <div className="login-content">
        <div className="login-box">
          <h2 className="login-title">
            {isRegistrationMode ? 'Registrarse' : 'Iniciar sesión'}
          </h2>

          <div className="login-form">
            {/*Advertencia de intentos fallidos */}
            {failedAttempts > 0 &&
              failedAttempts < MAX_ATTEMPTS &&
              !isLocked && (
                <div
                  style={{
                    padding: '12px 15px',
                    marginBottom: '15px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '6px',
                    color: '#856404',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>
                    Intentos fallidos: <strong>{failedAttempts}</strong> de{' '}
                    <strong>{MAX_ATTEMPTS}</strong>
                  </span>
                </div>
              )}

            {/*Mensaje de bloqueo */}
            {isLocked && (
              <div
                style={{
                  padding: '12px 15px',
                  marginBottom: '15px',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '6px',
                  color: '#721c24',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '5px',
                  }}
                >
                  <strong>Cuenta bloqueada por seguridad</strong>
                </div>
                <div style={{ marginLeft: '24px', fontSize: '13px' }}>
                  Tiempo restante:{' '}
                  <strong>{formatRemainingTime(remainingTime)}</strong>
                </div>
              </div>
            )}

            {/* Role Selection (solo para iniciar sesión) */}
            {!isRegistrationMode && (
              <div className="login-input-group">
                <label className="login-label">Selecciona tu rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="login-input"
                  disabled={isLocked}
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
                disabled={isLocked}
                required
              />
            </div>

            {/* Password Input */}
            <div className="login-input-group">
              <label className="login-label">Ingrese su contraseña</label>
              <div className="login-password-container">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="login-password-input"
                  disabled={isLocked}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="login-eye-button"
                  disabled={isLocked}
                  aria-label={
                    isPasswordVisible
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  <svg
                    className="login-eye-icon"
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
            </div>

            {/* Checkbox */}
            <div className="login-checkbox-container">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="login-checkbox"
                  disabled={isLocked}
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
                disabled={isSubmitting || !terms || isLocked}
                style={{
                  opacity: isSubmitting || isLocked || !terms ? 0.5 : 1,
                  cursor:
                    isSubmitting || isLocked || !terms
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {isLocked
                  ? 'Bloqueado'
                  : isSubmitting
                    ? 'Procesando...'
                    : isRegistrationMode
                      ? 'Registrarse'
                      : 'Entrar'}
              </button>
            </div>

            {/* Forgot Password Link */}
            {!isRegistrationMode && (
              <div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/solicitar-restablecimiento')
                  }}
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
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`login-message ${
                  message.includes('exitoso') || message.includes('✅')
                    ? 'login-message-success'
                    : 'login-message-error'
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
