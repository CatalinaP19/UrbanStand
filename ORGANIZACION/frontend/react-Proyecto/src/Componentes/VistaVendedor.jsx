import React, { useState, useEffect } from 'react';
import { MapPin, Bell, MessageCircle, X, Send, User, BarChart3, Edit3, Package } from 'lucide-react';

// Proveedor de estilos globales
const GlobalStylesProvider = ({ children }) => {
  useEffect(() => {
    if (document.querySelector('#global-urbanstand-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'global-urbanstand-styles';
    style.textContent = `
      :root {
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
        --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        --spacing-sm: 0.5rem;
        --spacing-md: 0.75rem;
        --spacing-lg: 1rem;
        --spacing-xl: 1.5rem;
        --spacing-2xl: 2rem;
        --spacing-3xl: 3rem;
        --radius-sm: 0.25rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-full: 50%;
        --transition-fast: 0.2s ease;
        --transition-normal: 0.3s ease;
      }

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

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-lg);
      }

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
    `;

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.querySelector('#global-urbanstand-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  return <>{children}</>;
};

const VistaVendedor = () => {
  const [isChatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Juan', text: 'Hola, ¿cómo puedo ayudarte?', isOwn: false },
    { id: 2, sender: 'Cliente', text: 'Hola, quiero ver tus productos', isOwn: true }
  ]);
  const [profileImage, setProfileImage] = useState('');

  const images = [
    "https://protoinfrastack.ivondy.com/media/vO8SMrOMuVyUDTYiuaTgSAbWYwAwTd7C3oCs.png",
    "https://protoinfrastack.ivondy.com/media/VdbygmIJK95vt1MRtSjawaXu6z430NAguXHX.png",
    "https://protoinfrastack.ivondy.com/media/D3Z7AsmYzOz3GLI5RcIFebTOEkz57HGoME1N.png",
    "https://protoinfrastack.ivondy.com/media/eN2hrChZ8w5oslLVcY8BbaGBUEbtKVXgHA3x.png",
    "https://protoinfrastack.ivondy.com/media/FWmYqHFeFaT99CCeMwwKvUsh6pG47p9eHRLE.png",
    "https://protoinfrastack.ivondy.com/media/F6AxsphXEQRziQ9cEdrofL1jgTjyDrivpM93.png"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setProfileImage(images[randomIndex]);
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { 
        id: Date.now(), 
        sender: 'Tú', 
        text: message, 
        isOwn: true 
      }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const vendorImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23faf3e0'/%3E%3Crect x='50' y='150' width='250' height='80' rx='10' fill='%23D2691E'/%3E%3Crect x='60' y='140' width='230' height='10' rx='5' fill='%238B4513'/%3E%3Ccircle cx='175' cy='120' r='30' fill='%23DEB887'/%3E%3Ccircle cx='165' cy='115' r='2' fill='%23000'/%3E%3Ccircle cx='185' cy='115' r='2' fill='%23000'/%3E%3Cpath d='M165 125 Q175 135 185 125' stroke='%23000' stroke-width='2' fill='none'/%3E%3Crect x='160' y='150' width='30' height='40' fill='%23228B22'/%3E%3Crect x='145' y='190' width='60' height='40' fill='%23000080'/%3E%3Ccircle cx='100' cy='170' r='15' fill='%23FFD700'/%3E%3Ccircle cx='130' cy='180' r='12' fill='%23FF6347'/%3E%3Ccircle cx='220' cy='175' r='13' fill='%23FF4500'/%3E%3Ccircle cx='250' cy='165' r='10' fill='%2332CD32'/%3E%3Crect x='270' y='160' width='15' height='25' fill='%23FFA500'/%3E%3C/svg%3E";

  return (
    <GlobalStylesProvider>
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <MapPin size={24} />
              UrbanStand
            </div>
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <button className="btn btn-primary">
                Inicio
              </button>
              <a href="#" style={{
                color: 'var(--secondary)',
                textDecoration: 'none',
                fontWeight: '500'
              }}>Mapa</a>
              <a href="#" style={{
                color: 'var(--secondary)',
                textDecoration: 'none',
                fontWeight: '500'
              }}>Perfil</a>
              <a href="#" style={{
                color: 'var(--secondary)',
                textDecoration: 'none',
                fontWeight: '500'
              }}>Chat</a>
              <Bell size={18} style={{ 
                color: 'var(--secondary)', 
                cursor: 'pointer' 
              }} />
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                <span className="highlight">Plataforma para</span><br />
                vendedores
              </h1>
              <p>
                Conéctate con tus clientes y gestiona tu negocio con facilidad
              </p>
            </div>
            <div style={{ flex: '1', textAlign: 'center' }}>
              <img 
                src="./img/vendedor.png"
                alt="Vendedor ambulante"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <main style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Map Section */}
          <div style={{
            height: '600px',
            backgroundColor: '#f0f0f0',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 2px 12px var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #e8e8e8 25%, transparent 25%), linear-gradient(-45deg, #e8e8e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e8e8e8 75%), linear-gradient(-45deg, transparent 75%, #e8e8e8 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              position: 'relative'
            }}>
              {/* Map markers */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '40%',
                background: 'var(--primary)',
                width: '30px',
                height: '30px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transform: 'rotate(45deg)'
                }}></div>
              </div>
              <div style={{
                position: 'absolute',
                top: '60%',
                left: '55%',
                background: 'var(--primary)',
                width: '30px',
                height: '30px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transform: 'rotate(45deg)'
                }}></div>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'var(--surface)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px var(--shadow)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <MapPin size={16} />
                Mi ubicación
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--surface)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              boxShadow: '0 2px 10px var(--shadow)'
            }}>
              <img
                src={profileImage}
                alt="Perfil de Juan"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--spacing-lg)',
                  objectFit: 'cover'
                }}
              />
              <h2 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.5rem'
              }}>Juan</h2>
              <h4 style={{
                margin: '0 0 1rem 0',
                color: 'var(--text-secondary)',
                fontWeight: 'normal'
              }}>Vendedor</h4>
              <p style={{
                margin: '0 0 var(--spacing-xl) 0',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                Vendo jugos naturales y empanadas desde hace 3 años.
              </p>
              
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <button style={{
                  background: '#f0f0f0',
                  border: 'none',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  transition: 'var(--transition-fast)'
                }}>
                  <Edit3 size={14} />
                  Editar perfil
                </button>
                <button style={{
                  background: '#f0f0f0',
                  border: 'none',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  transition: 'var(--transition-fast)'
                }}>
                  <Package size={14} />
                  Mis productos
                </button>
              </div>
              
              <button style={{
                background: '#f0f0f0',
                border: 'none',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                margin: '0 auto',
                transition: 'var(--transition-fast)'
              }}>
                <BarChart3 size={14} />
                Estadísticas
              </button>
            </div>
          </div>
        </main>

        {/* Chat Toggle Button */}
        <button
          onClick={() => setChatOpen(!isChatOpen)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            zIndex: 999
          }}
        >
          <MessageCircle size={24} />
        </button>

        {/* Chat Box */}
        {isChatOpen && (
          <div style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 4px 12px var(--shadow-hover)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '12px 15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>Chat - Vendedores</div>
                <div style={{
                  fontSize: '12px',
                  opacity: '0.9'
                }}>Localidad Kennedy</div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              backgroundColor: 'var(--background)'
            }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isOwn ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: msg.isOwn ? '#DCF8C6' : 'var(--surface)',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px'
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      marginBottom: '2px',
                      fontSize: '12px'
                    }}>
                      {msg.sender}:
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{
              display: 'flex',
              padding: '15px',
              backgroundColor: 'var(--surface)',
              borderTop: '1px solid #e0e0e0'
            }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 'var(--radius-xl)',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all var(--transition-fast)'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: '10px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          backgroundColor: 'var(--secondary)',
          color: '#fff',
          marginTop: 'var(--spacing-3xl)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <p style={{ margin: 0 }}>2025 UrbanStand. Todos los derechos reservados.</p>
        </footer>
      </div>
    </GlobalStylesProvider>
  );
};

export default VistaVendedor;