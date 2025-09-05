import React, { useState, useRef, useEffect } from "react";

export default function ChatTemplate({ 
  chatName = "Chat Local",
  locationInfo = {
    city: "Bogota",
    province: "Localidad",
    activeUsers: 0,
    activeStands: 0
  },
  initialMessages = [],
  currentUser = {
    id: "user1",
    name: "Usuario Actual",
    avatar: "👤"
  },
  onSendMessage = () => {},
  theme = {
    primary: "#ff7901",
    secondary: "#774612",
    accent: "#9a1e22",
    background: "#faf3e0"
  }
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: ${theme.background};
      }

      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid #e5e7eb;
      }

      .chat-header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .chat-header-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        background-color: ${theme.primary};
      }

      .chat-header-info h1 {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
        color: ${theme.secondary};
      }

      .chat-header-info p {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
      }

      .chat-header-stats {
        display: none;
        align-items: center;
        gap: 1rem;
        font-size: 0.875rem;
        color: #6b7280;
      }

      .chat-stat-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .chat-nav {
        display: flex;
        border-bottom: 1px solid #e5e7eb;
        background-color: white;
      }

      .chat-nav-button {
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 2px solid transparent;
        color: #6b7280;
      }

      .chat-nav-button:hover {
        color: #374151;
      }

      .chat-nav-button.active {
        color: ${theme.primary};
        border-bottom-color: ${theme.primary};
      }

      .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: auto;
        flex-direction: column;
        gap: 1rem;
      }

      .chat-empty-state {
        text-align: center;
        padding: 2rem 0;
      }

      .chat-empty-icon {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        margin: 0 auto 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${theme.primary}20;
      }

      .chat-empty-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: ${theme.secondary};
      }

      .chat-empty-description {
        color: #6b7280;
      }

      .chat-message {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .chat-message-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
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
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }

      .chat-message-name {
        font-weight: 600;
        font-size: 0.875rem;
        color: ${theme.secondary};
      }

      .chat-message-time {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .chat-message-bubble {
        background-color: white;
        padding: 0.75rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
      }

      .chat-message-text {
        color: #1f2937;
        margin: 0;
      }

      .chat-input-container {
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
        background-color: white;
      }

      .chat-input-wrapper {
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
      }

      .chat-input-field {
        flex: 1;
        position: relative;
      }

      .chat-textarea {
        width: 90%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        resize: none;
        min-height: 30px;
        font-family: inherit;
        transition: all 0.2s ease;
        outline: none;
      }

      .chat-textarea:focus {
        border-color: ${theme.primary};
        box-shadow: 0 0 0 3px ${theme.primary}20;
      }

      .chat-send-button {
        padding: 0.75rem;
        border-radius: 0.5rem;
        color: white;
        background-color: ${theme.primary};
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chat-send-button:hover:not(:disabled) {
        background-color: ${theme.primary}dd;
      }

      .chat-send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .chat-tabs-content {
        flex: 1;
        padding: 1.5rem;
      }

      .chat-tab-empty {
        text-align: center;
        padding: 2rem 0;
      }

      .chat-tab-icon {
        margin: 0 auto 1rem;
        color: ${theme.primary};
      }

      .chat-tab-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: ${theme.secondary};
      }

      .chat-tab-description {
        color: #6b7280;
        margin-bottom: 1.5rem;
      }

      .chat-stands-grid {
        display: grid;
        grid-template-columns: repeat(auto, minmax(260px, 1fr));
        gap: 1rem;
        max-width: 1024px;
        margin: 0 auto;
      }

      .chat-stand-card {
        background-color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        transition: all 0.2s ease;
      }

      .chat-stand-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .chat-stand-image {
        width: 100%;
        height: 8rem;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.25rem;
        background-color: ${theme.primary}cc;
      }

      .chat-stand-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #1f2937;
      }

      .chat-stand-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
      }

      .chat-stand-button {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-weight: 500;
        color: white;
        background-color: ${theme.primary};
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s ease;
      }

      .chat-stand-button:hover {
        background-color: ${theme.primary}dd;
      }

      .chat-icon {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
      }

      .chat-icon-large {
        width: 48px;
        height: 48px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
      }

      @media (min-width: 768px) {
        .chat-header-stats {
          display: flex;
        }
      }

      @media (max-width: 768px) {
        .chat-nav {
          overflow-x: auto;
        }
        
        .chat-nav-button {
          white-space: nowrap;
        }
        
        .chat-stands-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  // Auto scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para enviar mensaje
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: newMessage,
      timestamp: new Date(),
      type: "user"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    onSendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Formatear timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container">
      
      {/* Header del Chat */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-icon">
            <svg className="chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="chat-header-info">
            <h1>{chatName}</h1>
            <p>{locationInfo.city}, {locationInfo.province}</p>
          </div>
        </div>

        {/* Stats del chat */}
        <div className="chat-header-stats">
          <div className="chat-stat-item">
            <svg className="chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>{locationInfo.activeUsers} activos</span>
          </div>
        </div>
      </header>

      {/* Navegación de pestañas */}
      <nav className="chat-nav">
        <button
          onClick={() => setActiveTab("chat")}
          className={`chat-nav-button ${activeTab === "chat" ? "active" : ""}`}
        >
          💬 Chat General
        </button>
        <button
          onClick={() => setActiveTab("stands")}
          className={`chat-nav-button ${activeTab === "stands" ? "active" : ""}`}
        >
          🏪 Stands Locales
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`chat-nav-button ${activeTab === "events" ? "active" : ""}`}
        >
          📅 Eventos
        </button>
      </nav>

      {/* Contenido principal */}
      <div className="chat-content">
        
        {/* Área de mensajes */}
        {activeTab === "chat" && (
          <>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty-state">
                  <div className="chat-empty-icon">
                    <svg className="chat-icon" style={{color: theme.primary}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <h3 className="chat-empty-title">
                    ¡Bienvenido al {chatName}!
                  </h3>
                  <p className="chat-empty-description">
                    Conecta con otros usuarios de {locationInfo.city} y descubre los mejores stands locales.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="chat-message">
                    <div className="chat-message-avatar">
                      {message.avatar}
                    </div>
                    <div className="chat-message-content">
                      <div className="chat-message-header">
                        <span className="chat-message-name">
                          {message.userName}
                        </span>
                        <span className="chat-message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="chat-message-bubble">
                        <p className="chat-message-text">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input para escribir mensaje */}
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <div className="chat-input-field">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Escribe un mensaje en ${locationInfo.city}...`}
                    className="chat-textarea"
                    rows="1"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="chat-send-button"
                >
                  <svg className="chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Pestaña de Stands */}
        {activeTab === "stands" && (
          <div className="chat-tabs-content">
            <div className="chat-tab-empty">
              <svg className="chat-tab-icon chat-icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <h3 className="chat-tab-title">
                Stands en {locationInfo.city}
              </h3>
              <p className="chat-tab-description">
                Descubre los {locationInfo.activeStands} stands activos en tu localidad
              </p>
              <div className="chat-stands-grid">
                {/* Placeholder para stands - esto vendría de props */}
                {[1, 2, 3].map(stand => (
                  <div key={stand} className="chat-stand-card">
                    <div className="chat-stand-image">
                      🏪
                    </div>
                    <h4 className="chat-stand-title">Stand Ejemplo {stand}</h4>
                    <p className="chat-stand-subtitle">Categoría • {locationInfo.city}</p>
                    <button className="chat-stand-button">
                      Ver Stand
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pestaña de Eventos */}
        {activeTab === "events" && (
          <div className="chat-tabs-content">
            <div className="chat-tab-empty">
              <svg className="chat-tab-icon chat-icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3 className="chat-tab-title">
                Eventos en {locationInfo.city}
              </h3>
              <p className="chat-tab-description">
                Próximamente: eventos y actividades en tu localidad
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}