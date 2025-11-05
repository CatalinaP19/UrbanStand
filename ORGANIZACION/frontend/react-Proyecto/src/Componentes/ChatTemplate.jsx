import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

// Conectar con el backend
const socket = io("http://localhost:3006");

const generateUniqueId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
    id: generateUniqueId(),
    name: "Usuario Actual",
    avatar: "👤"
  },
  chatRoom = "general"
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [stats, setStats] = useState(locationInfo);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Configurar conexiones Socket.IO
  useEffect(() => {
    // Manejar conexión
    socket.on("connect", () => {
      console.log("Conectado al servidor");
      setConnectionStatus("connected");
      socket.emit("joinRoom", chatRoom);
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
      setConnectionStatus("disconnected");
    });

    // Escuchar mensajes entrantes
    socket.on("chatMessage", (msg) => {
      console.log("Mensaje recibido:", msg);
      setMessages((prev) => {
        // Evitar duplicados
        if (prev.some(m => m.id === msg.id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    // Manejar errores
    socket.on("error", (error) => {
      console.error("Error del socket:", error);
      alert("Error: " + error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chatMessage");
      socket.off("error");
    };
  }, [chatRoom]);

  // Cargar mensajes históricos al montar
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3006/api/messages/${chatRoom}`);
        if (response.ok) {
          const historicalMessages = await response.json();
          setMessages(historicalMessages);
        }
      } catch (error) {
        console.error("Error al cargar mensajes históricos:", error);
      }
    };

    const loadStats = async () => {
      try {
        const response = await fetch(`http://localhost:3006/api/stats/${chatRoom}`);
        if (response.ok) {
          const statsData = await response.json();
          setStats(prev => ({ ...prev, ...statsData }));
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    loadMessages();
    loadStats();
  }, [chatRoom]);

  // Enviar mensaje al servidor
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (connectionStatus !== "connected") {
      alert("No hay conexión con el servidor. Intentando reconectar...");
      socket.connect();
      return;
    }

    const message = {
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      text: newMessage.trim(),
      chatRoom: chatRoom,
      type: "user"
    };

    console.log("Enviando mensaje:", message);
    socket.emit("chatMessage", message);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Determinar el color del indicador de conexión
  const getConnectionColor = () => {
    switch(connectionStatus) {
      case "connected": return "#10b981"; 
      case "connecting": return "#f59e0b"; 
      case "disconnected": return "#ef4444"; 
      default: return "#6b7280"; 
    }
  };

  return (
    <div style={{
      height: "100vh",
      width: "60vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, -apple-system, sans-serif",
      backgroundColor: "#f9fafb"
    }}>
      
      {/* Header del Chat */}
      <header style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ 
            backgroundColor: "#3b82f6", 
            color: "white", 
            width: "40px", 
            height: "40px", 
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            📍
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: "1.125rem", 
              fontWeight: "600",
              color: "#111827"
            }}>
              {chatName}
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: "0.875rem", 
              color: "#6b7280"
            }}>
              {locationInfo.city}, {locationInfo.province}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Indicador de conexión */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: getConnectionColor()
            }} />
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {connectionStatus === "connected" ? "En línea" : 
               connectionStatus === "connecting" ? "Conectando..." : "Desconectado"}
            </span>
          </div>
          
          <div style={{ 
            fontSize: "0.875rem", 
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            👥 {stats.activeUsers} activos
          </div>
        </div>
      </header>

      {/* Navegación de pestañas */}
      <nav style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 1rem",
        display: "flex"
      }}>
        {["chat", "stands", "events"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "1rem",
              cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid #3b82f6" : "2px solid transparent",
              color: activeTab === tab ? "#3b82f6" : "#6b7280",
              fontWeight: activeTab === tab ? "600" : "400",
              fontSize: "0.875rem"
            }}
          >
            {tab === "chat" && "💬 Chat General"}
            {tab === "stands" && "🪙 Stands Locales"}
            {tab === "events" && "📅 Eventos"}
          </button>
        ))}
      </nav>

      {/* Contenido principal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Área de mensajes */}
        {activeTab === "chat" && (
          <>
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              backgroundColor: "#f9fafb"
            }}>
              {messages.length === 0 ? (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  textAlign: "center",
                  color: "#6b7280"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</div>
                  <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#374151" }}>
                    ¡Bienvenido al {chatName}!
                  </h3>
                  <p style={{ margin: 0 }}>
                    Conecta con otros usuarios de {locationInfo.city} y descubre los mejores stands locales.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={`${message.id}-${message.timestamp}`} style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                    alignItems: "flex-start"
                  }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      flexShrink: 0
                    }}>
                      {message.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.25rem"
                      }}>
                        <span style={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#374151"
                        }}>
                          {message.userName}
                        </span>
                        <span style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af"
                        }}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div style={{
                        backgroundColor: "white",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        border: "1px solid #e5e7eb",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        hyphens: "auto",
                        maxWidth: "100%",
                        boxSizing: "border-box"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#374151", lineHeight: 1.5,  whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          wordBreak: "break-word"
}}>
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input para escribir mensaje */}
            <div style={{
              backgroundColor: "white",
              borderTop: "1px solid #e5e7eb",
              padding: "1rem"
            }}>
              <div style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-end"
              }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Escribe un mensaje en ${locationInfo.city}...`}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    resize: "none",
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                    outline: "none",
                    minHeight: "40px",
                    maxHeight: "120px"
                  }}
                  rows={1}
                  disabled={connectionStatus !== "connected"}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || connectionStatus !== "connected"}
                  style={{
                    backgroundColor: !newMessage.trim() || connectionStatus !== "connected" ? "#d1d5db" : "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    cursor: !newMessage.trim() || connectionStatus !== "connected" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  📤
                </button>
              </div>
            </div>
          </>
        )}

        {/* Pestaña de Stands */}
        {activeTab === "stands" && (
          <div style={{ 
            flex: 1, 
            padding: "2rem", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🪙</div>
            <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#374151" }}>
              Stands en {locationInfo.city}
            </h3>
            <p style={{ margin: 0, marginBottom: "2rem", color: "#6b7280" }}>
              Descubre los {stats.activeStands} stands activos en tu localidad
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              width: "100%",
              maxWidth: "600px"
            }}>
              {[1, 2, 3].map(stand => (
                <div key={stand} style={{
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🪙</div>
                  <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#374151" }}>
                    Stand Ejemplo {stand}
                  </h4>
                  <p style={{ margin: 0, marginBottom: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                    Categoría • {locationInfo.city}
                  </p>
                  <button style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    cursor: "pointer"
                  }}>
                    Ver Stand
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pestaña de Eventos */}
        {activeTab === "events" && (
          <div style={{ 
            flex: 1, 
            padding: "2rem", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📅</div>
            <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#374151" }}>
              Eventos en {locationInfo.city}
            </h3>
            <p style={{ margin: 0, color: "#6b7280" }}>
              Próximamente: eventos y actividades en tu localidad
            </p>
          </div>
        )}

      </div>
    </div>
  );
}