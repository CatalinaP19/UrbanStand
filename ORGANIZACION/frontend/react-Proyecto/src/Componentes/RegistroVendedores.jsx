import React, { useState, useEffect } from "react"

export default function Register({ onBackToRoles }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [numDoc, setNumDoc] = useState("")
  const [direccion, setDireccion] = useState("")
  const [genero, setGenero] = useState("")
  const [TypeDoc, setTypeDoc] = useState("CC")
  const [rivi, setRivi] = useState(null)
  const [vigencia, setVigencia] = useState("")
  const [NumTel, setNumTel] = useState("")
  const [terms, setTerms] = useState(false)
  const [message, setMessage] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // ✅ Estado de carga

  // Estado para manejar los productos seleccionados
  const [selectedProducts, setSelectedProducts] = useState([])

  const productsList = [
    "Comidas preparadas",
    "Bebidas",
    "Confitería",
    "Frutas y verduras",
    "Productos textiles",
    "Calzado",
    "Bisutería y accesorios",
    "Juguetería",
    "Artículos de temporada",
    "Cigarrillos y tabaco",
    "Electrónicos y accesorios",
    "Arreglos florales",
    "Papelería y útiles escolares",
    "Productos varios (Para el hogar)",
    "S. Lustrado de calzado",
    "S. Reparación de calzado",
    "S. Reparación de celulares y electrónicos",
    "S. Ambulantes de aseo y apoyo",
  ]

  // ✅ Manejo de estilos
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .register-container { width: 100vw; height: 100vh; background: #faf3e0; font-family: system-ui; }
      .register-header { padding: 1rem 2rem; position: sticky; top: 0; background: #faf3e0; }
      .register-content { display: flex; justify-content: center; align-items: center; padding: 2rem; }
      .register-box { max-width: 32rem; background: white; padding: 2rem; border-radius: 1rem; }
      .back-button { background: #6b7280; color: white; padding: .5rem 1rem; border-radius: .5rem; border: none; cursor: pointer; }
      .register-title { font-size: 2rem; font-weight: bold; color: #9a1e22; text-align: center; margin-bottom: 1rem; }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .form-group { display: flex; flex-direction: column; margin-bottom: 1rem; }
      .form-label { font-weight: 600; margin-bottom: .5rem; }
      .form-input, .form-select { padding: .75rem; border: 2px solid #f97316; border-radius: .5rem; }
      .submit-button { width: 100%; background: #f97316; color: white; padding: .875rem; border-radius: .5rem; margin-top: 1rem; border: none; cursor: pointer; }
      .submit-button:disabled { background: #9ca3af; cursor: not-allowed; }
      .password-toggle { background: none; border: none; cursor: pointer; padding: .25rem; }
      .message-success { color: #059669; font-weight: 600; margin-top: 1rem; }
      .message-error { color: #dc2626; font-weight: 600; margin-top: 1rem; }
      .loading { opacity: 0.7; }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // ✅ Funciones auxiliares
  const handleFileChange = (e) => {
    setRivi(e.target.files[0])
  }

  const handleProductChange = (product, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, product])
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p !== product))
    }
  }

  const togglePassword = () => setIsPasswordVisible(!isPasswordVisible)
  const toggleConfirmPassword = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)

  // ✅ Validaciones contraseña
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  // ✅ Función para enviar datos a la API
  const registerUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3005/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Manejo del submit con API
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Validaciones locales
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setMessage("La contraseña no cumple con los requisitos")
      setIsLoading(false)
      return
    }

    if (!terms) {
      setMessage("Debe aceptar los términos y condiciones")
      setIsLoading(false)
      return
    }

    // ✅ Preparar datos para enviar
    const userData = {
      firstName,
      lastName,
      email,
      password,
      numDoc,
      direccion,
      genero,
      TypeDoc,
      vigencia,
      NumTel,
      selectedProducts, // Lista de productos seleccionados
      userType: 'vendedor' // Identificar tipo de usuario
    }

    try {
      // ✅ Enviar datos a la API
      const result = await registerUser(userData)
      
      setMessage("✅ Registro exitoso! Bienvenido a UrbanStand")
      
      // Opcional: Limpiar formulario después del registro exitoso
      setTimeout(() => {
        // Redirigir o limpiar formulario
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setNumDoc("")
        setDireccion("")
        setGenero("")
        setVigencia("")
        setNumTel("")
        setSelectedProducts([])
        setTerms(false)
      }, 2000)

    } catch (error) {
      console.error('Error al registrar:', error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <header className="register-header">
        <div className="logo">UrbanStand</div>
      </header>

      <div className="register-content">
        <div className={`register-box ${isLoading ? 'loading' : ''}`}>
          <button onClick={onBackToRoles} className="back-button" disabled={isLoading}>
            ← Volver
          </button>
          <h1 className="register-title">Vendedor, ¡Regístrate!</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="form-input" 
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido *</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="form-input" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Tipo de Documento *</label>
                <select 
                  value={TypeDoc} 
                  onChange={(e) => setTypeDoc(e.target.value)} 
                  className="form-select" 
                  required
                  disabled={isLoading}
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Número de Documento *</label>
                <input 
                  type="text" 
                  value={numDoc} 
                  onChange={(e) => setNumDoc(e.target.value)} 
                  className="form-input" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-input" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input 
                type="tel" 
                value={NumTel} 
                onChange={(e) => setNumTel(e.target.value)} 
                className="form-input" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección *</label>
              <input 
                type="text" 
                value={direccion} 
                onChange={(e) => setDireccion(e.target.value)} 
                className="form-input" 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Género *</label>
              <select 
                value={genero} 
                onChange={(e) => setGenero(e.target.value)} 
                className="form-select" 
                required
                disabled={isLoading}
              >
                <option value="">Seleccionar género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decir">Prefiero no decir</option>
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={isPasswordVisible ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="form-input" 
                    required 
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    onClick={togglePassword}
                    className="password-toggle"
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar Contraseña *</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={isConfirmPasswordVisible ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="form-input" 
                    required 
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    onClick={toggleConfirmPassword}
                    className="password-toggle"
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    disabled={isLoading}
                  >
                    {isConfirmPasswordVisible ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Validación visual de contraseña */}
            {password && (
              <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <p style={{ color: passwordRequirements.minLength ? '#059669' : '#dc2626' }}>
                  {passwordRequirements.minLength ? "✅" : "❌"} Mínimo 8 caracteres
                </p>
                <p style={{ color: passwordRequirements.hasUppercase ? '#059669' : '#dc2626' }}>
                  {passwordRequirements.hasUppercase ? "✅" : "❌"} Al menos una mayúscula
                </p>
                <p style={{ color: passwordRequirements.hasLowercase ? '#059669' : '#dc2626' }}>
                  {passwordRequirements.hasLowercase ? "✅" : "❌"} Al menos una minúscula
                </p>
                <p style={{ color: passwordRequirements.hasNumber ? '#059669' : '#dc2626' }}>
                  {passwordRequirements.hasNumber ? "✅" : "❌"} Al menos un número
                </p>
              </div>
            )}

            {/* ✅ Sección de productos */}
            <div className="form-group">
              <label className="form-label">Productos que vende: *</label>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1rem' }}>
                {productsList.map((product, index) => (
                  <label key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      checked={selectedProducts.includes(product)}
                      onChange={(e) => handleProductChange(product, e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                      disabled={isLoading}
                    />
                    {product}
                  </label>
                ))}
              </div>
              <small style={{ color: '#6b7280' }}>
                Seleccionados: {selectedProducts.length}
              </small>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={terms} 
                  onChange={(e) => setTerms(e.target.checked)} 
                  required 
                  disabled={isLoading}
                  style={{ marginRight: '0.5rem' }}
                /> 
                Acepto los términos y condiciones y política de privacidad de UrbanStand *
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || !terms}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>

            {/* ✅ Mensajes de estado */}
            {message && (
              <p className={message.includes('✅') ? 'message-success' : 'message-error'}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}