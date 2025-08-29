// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './Login.jsx'
import './index.css'   // <- Asegúrate de tener esta línea
import './index.css'   // (deja solo una si ya existía)
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
