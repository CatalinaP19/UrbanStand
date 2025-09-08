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
  onSendMessage = () => {}
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);

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
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
          🪙 Stands Locales
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
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
              <svg className="chat-tab-icon icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                      🪙
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
              <svg className="chat-tab-icon icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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