// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login/Login.jsx'
import './index.css'
import UrbanStand from './Componentes/Urbanstand.jsx'
import Register from './Login/Register.jsx'
import RegisterRoles from './Componentes/Register_roles.jsx'
import RegistroEntidades from './Componentes/RegistroEntidades.jsx'
import Chat from './Componentes/ChatTemplate.jsx'
import VistaVendedor from './Componentes/VistaVendedor.jsx'
import VistaEntidades from './Componentes/VistaEntidades.jsx'
import VistaCliente from './Componentes/VistaCliente.jsx'
import Layout from './Layout.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/urban" element={<UrbanStand />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-roles" element={<RegisterRoles />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registro-entidades" element={<RegistroEntidades />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/vendedor" element={<VistaVendedor />} />
        <Route path="/entidades" element={<VistaEntidades />} />
        <Route path="/cliente" element={<VistaCliente />} />
      </Route>
    </Routes>
  </BrowserRouter>
)