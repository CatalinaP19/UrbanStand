import React, { useEffect } from 'react';

const GlobalStylesProvider = ({ children }) => {
  useEffect(() => {
    // Verificar si ya se han aplicado los estilos globales
    if (document.querySelector('#global-urbanstand-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'global-urbanstand-styles';
    style.textContent = `
      /* ========================================
         VARIABLES CSS GLOBALES
         ======================================== */
      :root {
        /* Colores principales */
        --primary: #ff7901;
        --secondary: #085c52;
        --accent: #9a1e22;
        --background: #faf3e0;
        --surface: #ffffff;
        --text-primary: #202124;
        --text-secondary: #5f6368;
        --border: #dadce0;
        --shadow: rgba(0, 0, 0, 0.1);
        --shadow-hover: rgba(0, 0, 0, 0.15);
        --shadow-focus: rgba(249, 115, 22, 0.1);

        /* Fuentes */
        --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        --font-family-system: system-ui, -apple-system, sans-serif;

        /* Espaciado */
        --spacing-xs: 0.25rem;
        --spacing-sm: 0.5rem;
        --spacing-md: 0.75rem;
        --spacing-lg: 1rem;
        --spacing-xl: 1.5rem;
        --spacing-2xl: 2rem;
        --spacing-3xl: 3rem;

        /* Border radius */
        --radius-sm: 0.25rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-full: 50%;

        /* Transiciones */
        --transition-fast: 0.2s ease;
        --transition-normal: 0.3s ease;
      }

      /* ========================================
         RESET Y ESTILOS BASE
         ======================================== */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: var(--font-family);
        background: var(--background);
        color: var(--text-primary);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ========================================
         COMPONENTES BASE REUTILIZABLES
         ======================================== */

      /* Contenedores */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-lg);
      }

      .container-fluid {
        width: 100%;
        padding: 0 var(--spacing-lg);
      }

      /* Botones */
      .btn {
        padding: var(--spacing-md) var(--spacing-xl);
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        text-decoration: none;
        border: none;
        font-size: 0.875rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
      }

      .btn-primary {
        background: var(--primary);
        color: white;
        border: 2px solid var(--primary);
      }

      .btn-primary:hover:not(:disabled) {
        background: transparent;
        color: var(--primary);
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: var(--accent);
        color: white;
        border: 2px solid var(--accent);
      }

      .btn-secondary:hover:not(:disabled) {
        background: transparent;
        color: var(--accent);
        transform: translateY(-2px);
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Iconos */
      .icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .icon-large {
        width: 48px;
        height: 48px;
      }

      /* ========================================
         ESTILOS PARA URBANSTAND
         ======================================== */

      /* Header */
      .header {
        background: var(--background);
        padding: 15px 0;
        box-shadow: 0 2px 10px var(--shadow);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
        gap: var(--spacing-xl);
      }

      .logo {
        font-size: 1.75rem;
        font-weight: bold;
        color: var(--primary);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .logo img {
        height: 40px;
        width: auto;
      }

      .nav-links {
        display: flex;
        gap: var(--spacing-2xl);
        list-style: none;
      }

      .nav-links a {
        text-decoration: none;
        color: var(--text-primary);
        font-weight: 500;
        transition: color var(--transition-normal);
      }

      .nav-links a:hover {
        color: var(--accent);
      }

      .auth-buttons {
        display: flex;
        gap: var(--spacing-md);
      }

      /* Hero Section */
      .hero {
        padding: var(--spacing-3xl) 0;
      }

      .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: center;
      }

      .hero-text h1 {
        font-size: 2.625rem;
        font-weight: bold;
        color: var(--text-primary);
        margin-bottom: var(--spacing-xl);
      }

      .hero-text .highlight {
        color: var(--accent);
      }

      .hero-text p {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-2xl);
        line-height: 1.8;
      }

      .hero-image {
        width: 70%;
        border-radius: 15px;
        box-shadow: 0 0.5px 35px var(--shadow);
        object-fit: cover;
        height: 350px;
      }

      .cta-button {
        background: var(--primary);
        color: white;
        padding: 15px 30px;
        font-size: 1rem;
        font-weight: bold;
        border-radius: var(--radius-md);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        transition: all var(--transition-normal);
      }

      .cta-button:hover {
        background: var(--accent);
        transform: translateY(-2px);
      }

      /* Secciones y Cards */
      .section-title {
        text-align: center;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 50px;
        color: var(--accent);
      }

      .users-section {
        padding: 60px 0;
      }

      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-2xl);
        margin-bottom: 50px;
      }

      .user-card {
        background: var(--surface);
        padding: 40px 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 8px 25px var(--shadow);
        transition: all var(--transition-normal);
        border: 2px solid transparent;
      }

      .user-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent);
        box-shadow: 0 15px 40px var(--shadow-hover);
      }

      .user-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: linear-gradient(45deg, var(--primary), #ff9533);
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-card h3 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 15px;
        color: var(--text-primary);
      }

      .user-card p {
        color: var(--text-secondary);
        margin-bottom: 25px;
        line-height: 1.6;
      }

      /* Mapa y modales */
      .map-section {
        padding: 40px 0;
        text-align: center;
      }

      .map-container {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px var(--shadow);
        margin: 30px 0;
      }

      #map {
        height: 400px;
        width: 100%;
      }

      .map-login-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
      }

      .modal-content {
        background: var(--surface);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(1);
        transition: transform var(--transition-normal);
      }

      .modal-content h3 {
        color: var(--primary);
        margin-bottom: 15px;
        font-size: 1.5rem;
      }

      .modal-content p {
        color: var(--text-secondary);
        margin-bottom: 25px;
        line-height: 1.6;
      }

      .modal-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
      }

      .close-modal {
        background: transparent;
        border: 2px solid var(--border);
        color: var(--text-secondary);
      }

      .close-modal:hover {
        border-color: var(--primary);
        color: var(--primary);
      }

      /* Testimoniales */
      .testimonial-section {
        background: linear-gradient(135deg, #fff5ec 0%, #ffe5d1 100%);
        padding: 60px 0;
        margin: 60px 0;
        border-radius: 25px;
        position: relative;
        overflow: hidden;
      }

      .testimonial {
        text-align: center;
        max-width: 700px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }

      .testimonial-card {
        background: var(--surface);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(255, 121, 1, 0.1);
        border: 1px solid rgba(255, 121, 1, 0.1);
        position: relative;
      }

      .testimonial-avatar {
        width: 100px;
        height: 100px;
        border-radius: var(--radius-full);
        margin: 0 auto 25px;
        border: 4px solid var(--primary);
        box-shadow: 0 8px 25px rgba(255, 121, 1, 0.2);
        transition: transform var(--transition-normal);
      }

      .testimonial-avatar:hover {
        transform: scale(1.05);
      }

      /* Beneficios */
      .benefits-section {
        padding: 60px 0;
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
      }

      .benefit-card {
        background: var(--surface);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 15px var(--shadow);
        transition: all var(--transition-normal);
      }

      .benefit-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px var(--shadow-hover);
      }

      .benefit-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 15px;
        color: var(--primary);
      }

      .benefit-title {
        font-size: 1rem;
        font-weight: bold;
        color: var(--text-primary);
        margin-bottom: 10px;
      }

      .benefit-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary);
      }

      /* Footer */
      .footer {
        background: var(--accent);
        color: var(--surface);
        padding: 0px 0 20px;
        margin-top: 60px;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
      }

      .footer-section p, .footer-section a {
        color: #ccc;
        text-decoration: none;
        line-height: 1.8;
      }

      .footer-section a:hover {
        color: var(--primary);
      }

      .footer-bottom {
        padding-top: 20px;
        text-align: center;
        color: var(--background);
      }

      /* ========================================
         ESTILOS PARA CHAT TEMPLATE
         ======================================== */

      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        min-height: 100vh;
        background-color: var(--background);
        width: 100%;
        overflow-x: hidden;
      }

      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-lg);
        background-color: white;
        box-shadow: 0 1px 3px var(--shadow);
        border-bottom: 1px solid #e5e7eb;
        flex-shrink: 0;
        position: relative;
      }

      .chat-header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        flex: 1;
      }

      .chat-header-icon {
        width: 3rem;
        height: 3rem;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        background-color: var(--primary);
      }

      .chat-header-info h1 {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
        color: var(--secondary);
      }

      .chat-header-info p {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
      }

      .chat-header-stats {
        display: none;
        align-items: center;
        gap: var(--spacing-lg);
        font-size: 0.875rem;
        color: #6b7280;
        position: absolute;
        right: var(--spacing-lg);
        top: 50%;
        transform: translateY(-50%);
      }

      .chat-stat-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .chat-nav {
        display: flex;
        border-bottom: 1px solid #e5e7eb;
        background-color: white;
        flex-shrink: 0;
        min-height: 60px;
      }

      .chat-nav-button {
        padding: var(--spacing-md) var(--spacing-xl);
        font-weight: 500;
        background: none;
        border: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        border-bottom: 2px solid transparent;
        color: #6b7280;
      }

      .chat-nav-button:hover {
        color: #374151;
      }

      .chat-nav-button.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-height: 0;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
        min-height: 0;
      }

      .chat-empty-state {
        text-align: center;
        padding: var(--spacing-2xl) 0;
      }

      .chat-empty-icon {
        width: 4rem;
        height: 4rem;
        border-radius: var(--radius-full);
        margin: 0 auto var(--spacing-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 121, 1, 0.2);
      }

      .chat-empty-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--secondary);
      }

      .chat-empty-description {
        color: #6b7280;
      }

      .chat-message {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .chat-message-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--radius-full);
        background-color: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
        flex-shrink: 0;
      }

      .chat-message-content {
        flex: 1;
      }

      .chat-message-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xs);
      }

      .chat-message-name {
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--secondary);
      }

      .chat-message-time {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .chat-message-bubble {
        background-color: white;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        box-shadow: 0 1px 3px var(--shadow);
        border: 1px solid #e5e7eb;
      }

      .chat-message-text {
        color: #1f2937;
        margin: 0;
      }

      .chat-input-container {
        padding: var(--spacing-lg);
        border-top: 1px solid #e5e7eb;
        background-color: white;
        flex-shrink: 0;
      }

      .chat-input-wrapper {
        display: flex;
        align-items: flex-end;
        gap: var(--spacing-md);
      }

      .chat-input-field {
        flex: 1;
        position: relative;
      }

      .chat-textarea {
        width: 100%;
        padding: var(--spacing-md);
        border: 1px solid #d1d5db;
        border-radius: var(--radius-md);
        resize: none;
        min-height: 44px;
        font-family: inherit;
        transition: all var(--transition-fast);
        outline: none;
      }

      .chat-textarea:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--shadow-focus);
      }

      .chat-send-button {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        color: white;
        background-color: var(--primary);
        border: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chat-send-button:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--primary) 90%, black);
      }

      .chat-tabs-content {
        flex: 1;
        padding: var(--spacing-xl);
        overflow-y: auto;
        min-height: 0;
      }

      .chat-tab-empty {
        text-align: center;
        padding: var(--spacing-2xl) 0;
      }

      .chat-tab-icon {
        margin: 0 auto var(--spacing-lg);
        color: var(--primary);
      }

      .chat-tab-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--secondary);
      }

      .chat-tab-description {
        color: #6b7280;
        margin-bottom: var(--spacing-xl);
      }

      .chat-stands-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--spacing-lg);
        max-width: 1024px;
        margin: 0 auto;
      }

      .chat-stand-card {
        background-color: white;
        padding: var(--spacing-lg);
        border-radius: var(--radius-md);
        box-shadow: 0 1px 3px var(--shadow);
        border: 1px solid #e5e7eb;
        transition: all var(--transition-fast);
      }

      .chat-stand-card:hover {
        box-shadow: 0 4px 12px var(--shadow-hover);
      }

      .chat-stand-image {
        width: 100%;
        height: 8rem;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.25rem;
        background-color: color-mix(in srgb, var(--primary) 80%, transparent);
      }

      .chat-stand-title {
        font-weight: 600;
        margin-bottom: var(--spacing-xs);
        color: #1f2937;
      }

      .chat-stand-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: var(--spacing-sm);
      }

      .chat-stand-button {
        width: 100%;
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-weight: 500;
        color: white;
        background-color: var(--primary);
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all var(--transition-fast);
      }

      .chat-stand-button:hover {
        background-color: color-mix(in srgb, var(--primary) 90%, black);
      }

      /* ========================================
         ESTILOS PARA LOGIN
         ======================================== */

      .login-container {
        width: 100%;
        min-height: 100vh;
        background: var(--background);
        font-family: var(--font-family-system);
        margin: 0;
        padding: 0;
        position: relative;
        overflow-x: hidden;
      }

      .login-header {
        background: var(--background);
        backdrop-filter: blur(10px);
        padding: var(--spacing-lg) var(--spacing-2xl);
        box-shadow: 0 2px 10px var(--shadow);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        height: 80px;
        display: flex;
        align-items: center;
      }

      .login-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .login-logo {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--primary);
      }

      .login-home-button {
        background: var(--accent);
        border: 2px solid var(--accent);
        color: white;
        padding: var(--spacing-sm) var(--spacing-lg);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all var(--transition-fast);
      }

      .login-home-button:hover {
        background: transparent;
        color: var(--accent);
      }

      .login-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--spacing-2xl);
        min-height: calc(100vh - 80px);
        margin-top: 80px;
        width: 100%;
      }

      .login-box {
        width: 100%;
        max-width: 32rem;
        background: white;
        padding: var(--spacing-2xl);
        border-radius: var(--radius-xl);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        position: relative;
        z-index: 10;
      }

      .login-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: var(--spacing-2xl);
        text-align: center;
        color: var(--accent);
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      .login-input-group {
        display: flex;
        flex-direction: column;
      }

      .login-label {
        display: block;
        margin-bottom: var(--spacing-sm);
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
      }

      .login-input {
        border: 2px solid #ea580c;
        width: 100%;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
        outline: none;
        box-sizing: border-box;
      }

      .login-input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--shadow-focus);
      }

      .login-input:hover {
        border-color: var(--accent);
      }

      .login-password-container {
        position: relative;
        width: 100%;
      }

      .login-password-input {
        border: 2px solid #ea580c;
        width: 100%;
        padding: var(--spacing-md);
        padding-right: 3rem;
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
        outline: none;
        box-sizing: border-box;
      }

      .login-password-input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--shadow-focus);
      }

      .login-password-input:hover {
        border-color: var(--accent);
      }

      .login-eye-button {
        position: absolute;
        right: var(--spacing-md);
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--accent);
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: color var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .login-eye-button:hover {
        color: var(--primary);
      }

      .login-checkbox-container {
        display: flex;
        align-items: flex-start;
      }

      .login-checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .login-checkbox {
        height: 1.25rem;
        width: 1.25rem;
        border-radius: var(--radius-sm);
        margin-right: var(--spacing-md);
        cursor: pointer;
        accent-color: var(--primary);
      }

      .login-checkbox-text {
        color: var(--text-primary);
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .login-link {
        color: var(--accent);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all var(--transition-fast);
        display: block;
        text-align: center;
      }

      .login-link:hover {
        color: #ea580c;
        text-decoration: underline;
      }

      .login-submit-button {
        border: 2px solid #ea580c;
        padding: var(--spacing-md) var(--spacing-xl);
        border-radius: var(--radius-md);
        background: #ea580c;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all var(--transition-fast);
        width: 100%;
        color: white;
      }

      .login-submit-button:hover {
        background: transparent;
        color: #ea580c;
        border-color: var(--primary);
      }

      .login-toggle-container {
        text-align: center;
      }

      .login-toggle-button {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--accent);
        transition: all var(--transition-fast);
      }

      .login-toggle-button:hover {
        color: var(--primary);
        text-decoration: underline;
      }

      .login-message {
        margin-top: var(--spacing-lg);
        text-align: center;
        font-weight: 600;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
      }

      .login-message-error {
        color: #dc2626;
        background: #fef2f2;
        border: 1px solid #fecaca;
      }

      .login-message-success {
        color: #16a34a;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
      }

      .login-eye-icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* ========================================
         RESPONSIVE DESIGN
         ======================================== */

      @media (min-width: 768px) {
        .chat-header-stats {
          display: flex;
        }
      }

      @media (max-width: 768px) {
        .hero-content {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .hero-text h1 {
          font-size: 2rem;
        }

        .nav-links {
          display: none;
        }

        .users-grid {
          grid-template-columns: 1fr;
        }

        .benefits-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        /* Chat responsive */
        .chat-container {
          height: 100vh;
          width: 100vw;
          position: relative;
        }

        .chat-header {
          padding: var(--spacing-md);
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          min-height: 70px;
        }

        .chat-header-left {
          flex: 1;
          min-width: 0;
        }

        .chat-header-info h1 {
          font-size: 1.1rem;
        }

        .chat-nav {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .chat-nav::-webkit-scrollbar {
          display: none;
        }
        
        .chat-nav-button {
          white-space: nowrap;
          padding: var(--spacing-sm) var(--spacing-lg);
          flex-shrink: 0;
        }

        .chat-stands-grid {
          grid-template-columns: 1fr;
        }

        .chat-messages {
          padding: var(--spacing-md);
        }

        .chat-input-container {
          padding: var(--spacing-md);
        }

        .chat-tabs-content {
          padding: var(--spacing-lg);
        }

        /* Login responsive */
        .login-container {
          width: 100vw;
          overflow-x: hidden;
        }

        .login-header {
          padding: var(--spacing-md) var(--spacing-lg);
          height: 60px;
        }

        .login-content {
          padding: var(--spacing-lg);
          margin-top: 60px;
          min-height: calc(100vh - 60px);
          width: 100%;
        }
        
        .login-box {
          padding: var(--spacing-xl);
          max-width: none;
          width: 100%;
          margin: 0;
        }

        .login-header-content {
          padding: 0;
        }
      }

      @media (max-width: 480px) {
        .container {
          padding: 0 var(--spacing-md);
        }

        .hero-text h1 {
          font-size: 1.75rem;
        }

        .auth-buttons {
          flex-direction: column;
          width: 100%;
        }

        .benefits-grid {
          grid-template-columns: 1fr;
        }

        /* Chat mobile fixes */
        .chat-header {
          padding: var(--spacing-sm);
          min-height: 60px;
        }

        .chat-header-left {
          gap: var(--spacing-sm);
        }

        .chat-header-icon {
          width: 2.5rem;
          height: 2.5rem;
        }

        .chat-header-info h1 {
          font-size: 1rem;
        }

        .chat-nav-button {
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: 0.8rem;
        }

        .chat-stands-grid {
          padding: 0 var(--spacing-sm);
        }

        .chat-stand-card {
          padding: var(--spacing-md);
        }

        .chat-tabs-content {
          padding: var(--spacing-md);
        }

        /* Login mobile fixes */
        .login-header {
          padding: var(--spacing-sm) var(--spacing-md);
          height: 50px;
        }

        .login-content {
          padding: var(--spacing-md);
          margin-top: 50px;
          min-height: calc(100vh - 50px);
        }

        .login-box {
          padding: var(--spacing-lg);
        }

        .login-title {
          font-size: 1.5rem;
        }
      }

      /* ========================================
         UTILIDADES
         ======================================== */

      .text-center {
        text-align: center;
      }

      .text-left {
        text-align: left;
      }

      .text-right {
        text-align: right;
      }

      .hidden {
        display: none;
      }

      .flex {
        display: flex;
      }

      .flex-column {
        flex-direction: column;
      }

      .items-center {
        align-items: center;
      }

      .justify-center {
        justify-content: center;
      }

      .gap-sm {
        gap: var(--spacing-sm);
      }

      .gap-md {
        gap: var(--spacing-md);
      }

      .gap-lg {
        gap: var(--spacing-lg);
      }

      .p-sm {
        padding: var(--spacing-sm);
      }

      .p-md {
        padding: var(--spacing-md);
      }

      .p-lg {
        padding: var(--spacing-lg);
      }

      .m-sm {
        margin: var(--spacing-sm);
      }

      .m-md {
        margin: var(--spacing-md);
      }

      .m-lg {
        margin: var(--spacing-lg);
      }

      .w-full {
        width: 100%;
      }

      .h-full {
        height: 100%;
      }
    `;

    document.head.appendChild(style);

    // Cleanup function para remover los estilos cuando el componente se desmonte
    return () => {
      const existingStyle = document.querySelector('#global-urbanstand-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  return <>{children}</>;
};

export default GlobalStylesProvider;