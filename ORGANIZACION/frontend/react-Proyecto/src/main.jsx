// src/main.jsx
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
              <PrivateRoute allowedRoles={['cliente']}>
                <VistaCliente />
              </PrivateRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)