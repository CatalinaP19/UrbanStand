import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


// instancia global del socket
const socket  = io(
  "http://localhost:3005"
);


const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // escuchar mensajes entrantes
    socket.on("chat_message", (msg ) => {
      setMessages((prev) => [...prev, msg]);
    });

    // limpiar listener al desmontar
    return () => {
      socket.off("chat_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chat_message", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 400 }}>
      <h2>Chat en tiempo real</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "200px",
          overflowY: "scroll",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        placeholder="Escribe un mensaje"
        style={{ width: "70%", marginRight: "0.5rem" }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;