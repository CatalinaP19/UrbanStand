import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
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

    /* Espaciado responsive */
    --spacing-xs: clamp(0.25rem, 0.5vw, 0.375rem);
    --spacing-sm: clamp(0.5rem, 1vw, 0.75rem);
    --spacing-md: clamp(0.75rem, 1.5vw, 1rem);
    --spacing-lg: clamp(1rem, 2vw, 1.5rem);
    --spacing-xl: clamp(1.5rem, 3vw, 2rem);
    --spacing-2xl: clamp(2rem, 4vw, 3rem);
    --spacing-3xl: clamp(3rem, 6vw, 4rem);

    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 50%;

    /* Transiciones */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;

    /* Z-index layers */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal: 1040;
    --z-popover: 1050;
    --z-tooltip: 1060;
  }

  /* ========================================
     RESET Y ESTILOS BASE
     ======================================== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: var(--font-family);
    background: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* ========================================
     COMPONENTES BASE REUTILIZABLES
     ======================================== */

  /* Contenedores */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
    width: 100%;
  }

  .container-fluid {
    width: 100%;
    padding: 0 var(--spacing-lg);
  }

  /* Botones mejorados */
  .btn {
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    border: none;
    font-size: clamp(0.875rem, 2vw, 1rem);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    min-height: 44px;
    white-space: nowrap;
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
    width: clamp(16px, 4vw, 20px);
    height: clamp(16px, 4vw, 20px);
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }

  .icon-large {
    width: clamp(40px, 8vw, 48px);
    height: clamp(40px, 8vw, 48px);
  }

  /* ========================================
     ESTILOS PARA CHAT TEMPLATE
     ======================================== */

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--background);
    position: relative;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    background-color: white;
    box-shadow: 0 1px 3px var(--shadow);
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    min-height: 80px;
  }

  .chat-header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .chat-header-icon {
    width: clamp(2.5rem, 6vw, 3rem);
    height: clamp(2.5rem, 6vw, 3rem);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    background-color: var(--primary);
    font-size: clamp(1rem, 2.5vw, 1.25rem);
  }

  .chat-header-info h1 {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: bold;
    margin: 0;
    color: var(--secondary);
  }

  .chat-header-info p {
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    color: #6b7280;
    margin: 0;
  }

  .chat-header-stats {
    display: none;
    align-items: center;
    gap: var(--spacing-lg);
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    color: #6b7280;
  }

  .chat-stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  /* Navegación de pestañas mejorada */
  .chat-nav {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background-color: white;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .chat-nav-button {
    padding: var(--spacing-md) var(--spacing-lg);
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    border-bottom: 2px solid transparent;
    color: #6b7280;
    white-space: nowrap;
    font-size: clamp(0.875rem, 2vw, 1rem);
    min-height: 44px;
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
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .chat-empty-state {
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
    max-width: 500px;
    margin: 0 auto;
  }

  .chat-empty-icon {
    width: clamp(3rem, 8vw, 4rem);
    height: clamp(3rem, 8vw, 4rem);
    border-radius: var(--radius-full);
    margin: 0 auto var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 121, 1, 0.2);
  }

  .chat-empty-title {
    font-size: clamp(1rem, 3vw, 1.125rem);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--secondary);
  }

  .chat-empty-description {
    color: #6b7280;
    font-size: clamp(0.875rem, 2vw, 1rem);
  }

  /* Grid de stands mejorado */
  .chat-stands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
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
    transform: translateY(-2px);
  }

  .chat-stand-image {
    width: 100%;
    height: clamp(6rem, 20vw, 8rem);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    background-color: color-mix(in srgb, var(--primary) 80%, transparent);
  }

  .chat-stand-title {
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: #1f2937;
    font-size: clamp(0.875rem, 2vw, 1rem);
  }

  .chat-stand-subtitle {
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
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
    font-size: clamp(0.75rem, 2vw, 0.875rem);
    transition: all var(--transition-fast);
    min-height: 40px;
  }

  .chat-stand-button:hover {
    background-color: color-mix(in srgb, var(--primary) 90%, black);
  }

  /* ========================================
     RESPONSIVE DESIGN MEJORADO
     ======================================== */

  @media (min-width: 768px) {
    .chat-header-stats {
      display: flex;
    }
  }

  @media (max-width: 768px) {
    .chat-nav {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    .chat-nav-button {
      white-space: nowrap;
      flex-shrink: 0;
    }

    .chat-stands-grid {
      grid-template-columns: 1fr;
      padding: 0 var(--spacing-sm);
    }

    .chat-header {
      padding: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .chat-stands-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .chat-header {
      padding: var(--spacing-sm);
      min-height: 70px;
    }

    .chat-header-left {
      gap: var(--spacing-sm);
    }
  }
`;

const GlobalStylesProvider = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
};

export default GlobalStylesProvider;