# 🔧 SOLUCIÓN: Problema con Login y Rutas Protegidas

## 🚨 PROBLEMA IDENTIFICADO

Después de ingresar usuario y contraseña, no redirigía a la vista correspondiente.

### Causas Encontradas:

1. ❌ **Parámetros incorrectos en `authLogin()`**
   - Login.jsx pasaba: `authLogin(userData, token, role)`
   - AuthContext esperaba: `authLogin(token, userData)`

2. ❌ **userData sin campo `role`**
   - El contexto necesita `userData.role` para validar correctamente

3. ❌ **validateToken() usaba `user?.role` antes de cargar**
   - Cuando la página carga, `user` es `null`
   - Necesitaba leer el rol directamente de localStorage

---

## ✅ CORRECCIONES APLICADAS

### 1. Login.jsx - Corregir llamada a authLogin()

**ANTES (Incorrecto):**
```javascript
// Para entidades
authLogin(entidadData, loginResp.token, 'entidad');

// Para vendedores
authLogin(vendorData, token, 'vendedor');
```

**DESPUÉS (Correcto):**
```javascript
// Para entidades
const entidadUserData = {
  role: 'entidad',
  email,
  nomEnti: entidadData.nomEnti,
};
authLogin(loginResp.token, entidadUserData);

// Para vendedores
const vendedorUserData = {
  role: 'vendedor',
  email,
  firstName: vendorData?.firstName,
  lastName: vendorData?.lastName,
  genero: vendorData?.genero,
};
authLogin(token, vendedorUserData);
```

### 2. AuthContext.jsx - Leer rol desde localStorage

**ANTES (Incorrecto):**
```javascript
const userType = user?.role || 'vendedor'  // user puede ser null
```

**DESPUÉS (Correcto):**
```javascript
// Detectar tipo de usuario desde localStorage
let userType = 'vendedor'
try {
  const storedUser = localStorage.getItem('urbanstand_current_user')
  if (storedUser) {
    const userData = JSON.parse(storedUser)
    userType = userData.role || 'vendedor'
  }
} catch (e) {
  console.error('Error leyendo rol de usuario:', e)
}
```

### 3. AuthContext.jsx - Quitar dependencia innecesaria

**ANTES:**
```javascript
}, [user])  // Causaba re-renders innecesarios
```

**DESPUÉS:**
```javascript
}, [])  // Sin dependencias
```

---

## 🧪 CÓMO PROBAR

### Paso 1: Reiniciar el servidor backend

```bash
cd ORGANIZACION/backend
npm run start-backend
```

Deberías ver:
```
✅ Conectado a MongoDB exitosamente
🚀 Servidor corriendo en puerto 3005
```

### Paso 2: Reiniciar el frontend

```bash
cd ORGANIZACION/frontend/react-Proyecto
npm run dev
```

### Paso 3: Limpiar localStorage (IMPORTANTE)

Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.clear()
location.reload()
```

### Paso 4: Intentar Login

1. Ve a http://localhost:5173/login
2. Selecciona rol: **Vendedor**
3. Ingresa credenciales de un vendedor registrado
4. Haz clic en "Entrar"

### Paso 5: Verificar en la consola

**Deberías ver:**
```
🔑 Token guardado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔑 Token en localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
👤 Perfil recibido: { vendedor: {...} }
💾 Datos a guardar en localStorage: { email: "...", firstName: "...", ... }
```

**Y luego redirigir a:** `/vendedor`

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Si no redirige, verifica:

#### 1. ¿El token se está guardando?

Abre consola del navegador:
```javascript
console.log('Token:', localStorage.getItem('token'))
console.log('User:', localStorage.getItem('urbanstand_current_user'))
```

**Debe mostrar:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User: {"role":"vendedor","email":"...","firstName":"..."}
```

#### 2. ¿El endpoint de validación responde?

Abre consola del navegador y ejecuta:
```javascript
const token = localStorage.getItem('token')
fetch('http://localhost:3005/api/auth/validate', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)
```

**Debe responder:**
```json
{
  "valid": true,
  "vendedor": {
    "id": "...",
    "role": "vendedor"
  }
}
```

#### 3. ¿El PrivateRoute está validando?

Mira la consola del navegador. Deberías ver:
```
Validando acceso...
```

Y luego la vista del vendedor.

---

## 🚨 ERRORES COMUNES

### Error: "Token inválido o expirado"

**Causa:** El token expiró (24 horas) o el JWT_SECRET cambió.

**Solución:**
```javascript
localStorage.clear()
// Volver a hacer login
```

### Error: "Vendedor no encontrado"

**Causa:** El vendedor fue eliminado de la BD.

**Solución:** Registrar un nuevo vendedor.

### Error: "Cuenta inactiva o suspendida"

**Causa:** El campo `vigencia` del vendedor no es "activo".

**Solución:** Actualizar en MongoDB:
```javascript
db.vendedores.updateOne(
  { email: "tu-email@example.com" },
  { $set: { vigencia: "activo" } }
)
```

### Error: "Email no verificado"

**Causa:** El campo `emailVerificado` es `false`.

**Solución temporal:** Actualizar en MongoDB:
```javascript
db.vendedores.updateOne(
  { email: "tu-email@example.com" },
  { $set: { emailVerificado: true } }
)
```

O implementar el sistema de confirmación de email con nodemailer.

---

## 📊 FLUJO COMPLETO DEL LOGIN

```
1. Usuario ingresa credenciales
   ↓
2. Login.jsx → apiService.vendedor.login()
   ↓
3. Backend valida credenciales
   ↓
4. Backend genera JWT token
   ↓
5. Frontend guarda token en localStorage
   ↓
6. Frontend llama authLogin(token, userData)
   ↓
7. AuthContext guarda user en estado
   ↓
8. navigate('/vendedor')
   ↓
9. PrivateRoute intercepta
   ↓
10. PrivateRoute → validateToken()
    ↓
11. validateToken() → fetch('/api/auth/validate')
    ↓
12. Backend verifica:
    - Token válido ✅
    - Vendedor existe ✅
    - Cuenta activa ✅
    - Email verificado ✅
    ↓
13. Backend responde: { valid: true }
    ↓
14. PrivateRoute permite acceso
    ↓
15. ✅ Usuario ve VistaVendedor
```

---

## 🎯 CHECKLIST DE VERIFICACIÓN

Antes de reportar un problema, verifica:

- [ ] Backend corriendo en puerto 3005
- [ ] Frontend corriendo en puerto 5173
- [ ] MongoDB conectado correctamente
- [ ] localStorage limpio (sin tokens viejos)
- [ ] Credenciales correctas
- [ ] Vendedor existe en BD
- [ ] Campo `vigencia` = "activo"
- [ ] Campo `emailVerificado` = true (o comentar validación)
- [ ] Consola del navegador sin errores
- [ ] Consola del backend sin errores

---

## 🔧 TESTING RÁPIDO

### Crear vendedor de prueba (si no tienes):

```bash
# En MongoDB Compass o shell
db.vendedores.insertOne({
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan@test.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWHvCy8m", // "password123"
  numDoc: "1234567890",
  NumTel: "3001234567",
  TypeDoc: "CC",
  genero: "masculino",
  direccion: "Calle 123",
  rivi: "https://example.com/rivi.jpg",
  selectedProducts: ["Comidas preparadas"],
  vigencia: "activo",
  emailVerificado: true,
  id_localidad: ObjectId("...") // ID de una localidad existente
})
```

### Login de prueba:
- **Email:** juan@test.com
- **Password:** password123
- **Rol:** Vendedor

---

## ✅ RESULTADO ESPERADO

Después de aplicar todas las correcciones:

1. ✅ Login exitoso
2. ✅ Token guardado en localStorage
3. ✅ Usuario guardado en localStorage con `role`
4. ✅ Validación de token exitosa
5. ✅ Redirección a `/vendedor`
6. ✅ PrivateRoute permite acceso
7. ✅ Vista de vendedor se muestra correctamente

---

## 📝 NOTAS ADICIONALES

### Seguridad

- El token expira en 24 horas
- La validación se hace en cada carga de ruta protegida
- El backend verifica estado de cuenta en cada validación

### Performance

- La validación de token se hace solo una vez al cargar la ruta
- El resultado se cachea en el estado de PrivateRoute
- No se valida en cada render

### Mejoras Futuras

1. Implementar refresh tokens
2. Agregar rate limiting en login
3. Implementar confirmación de email
4. Agregar recuperación de contraseña
5. Implementar logout en todos los dispositivos

---

**¡Listo! El login debería funcionar correctamente ahora.** 🎉

Si sigues teniendo problemas, revisa la consola del navegador y del backend para ver los errores específicos.
