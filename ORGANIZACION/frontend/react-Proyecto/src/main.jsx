import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './Componentes/Login.jsx'
import './index.css'
import UrbanStand from './Componentes/Urbanstand.jsx'
import Register from './Componentes/Register.jsx'
import RegisterRoles from './Componentes/Register_roles.jsx'
import RegistroEntidades from './Componentes/RegistroEntidades.jsx'
import Chat from './Componentes/ChatTemplate.jsx'
import VistaVendedor from './Componentes/VistaVendedor.jsx'
import VistaEntidades from './Componentes/VistaEntidades.jsx'
import VistaCliente from './Componentes/VistaCliente.jsx'
import PerfilVendedor from './Componentes/PerfilVendedor.jsx'
import EditarPerfilVendedor from './Componentes/EditarPerfilVendedor.jsx'
import ConfirmarEmail from './Componentes/ConfirmarEmail.jsx'
import RestablecerPassword from './Componentes/RestablecerPassword.jsx'
import VerificarEmail from './Componentes/VerificarEmail.jsx'
import SolicitarRestablecimiento from './Componentes/SolicitarRestablecimiento.jsx'
import Layout from './Layout.jsx'
import { AuthProvider } from './context/AuthContex.jsx'
import PrivateRoute from './Componentes/PrivateRoute.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* Rutas públicas */}
          <Route path="/" element={<App />} />
          <Route path="/urban" element={<UrbanStand />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-roles" element={<RegisterRoles />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro-entidades" element={<RegistroEntidades />} />
          
          {/* Rutas para confirmación de email y recuperación de contraseña */}
          <Route path="/confirmar-email/:token" element={<ConfirmarEmail />} />
          <Route path="/restablecer-password/:token" element={<RestablecerPassword />} />
          <Route path="/verificar-email" element={<VerificarEmail />} />
          <Route path="/solicitar-restablecimiento" element={<SolicitarRestablecimiento />} />

          {/* Rutas protegidas */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendedor"
            element={
              <PrivateRoute allowedRoles={['vendedor']}>
                <VistaVendedor />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendedor/perfil"
            element={
              <PrivateRoute allowedRoles={['vendedor']}>
                <PerfilVendedor />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendedor/editar-perfil"
            element={
              <PrivateRoute allowedRoles={['vendedor']}>
                <EditarPerfilVendedor />
              </PrivateRoute>
            }
          />
          <Route
            path="/entidades"
            element={
              <PrivateRoute allowedRoles={['entidad']}>
                <VistaEntidades />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente"
            element={
              <VistaCliente />
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)