const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar base de datos SQLite
const dbPath = path.join(__dirname, "chat.db");
const db = new sqlite3.Database(dbPath);

// Crear tabla de mensajes si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      avatar TEXT,
      text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      chatRoom TEXT DEFAULT 'general'
    )
  `);
});

// Endpoint REST para obtener mensajes históricos
app.get("/api/messages/:chatRoom?", (req, res) => {
  const chatRoom = req.params.chatRoom || "general";
  const limit = req.query.limit || 50;
  
  db.all(
    `SELECT * FROM messages WHERE chatRoom = ? ORDER BY timestamp DESC LIMIT ?`,
    [chatRoom, limit],
    (err, rows) => {
      if (err) {
        console.error("Error al obtener mensajes:", err);
        return res.status(500).json({ error: "Error del servidor" });
      }
      
      // Convertir timestamp a objeto Date para el frontend
      const messages = rows.reverse().map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      
      res.json(messages);
    }
  );
});

// Endpoint para obtener estadísticas del chat
app.get("/api/stats/:chatRoom?", (req, res) => {
  const chatRoom = req.params.chatRoom || "general";
  
  db.get(
    `SELECT COUNT(DISTINCT userId) as activeUsers, COUNT(*) as totalMessages 
     FROM messages WHERE chatRoom = ? AND timestamp > datetime('now', '-1 day')`,
    [chatRoom],
    (err, row) => {
      if (err) {
        console.error("Error al obtener estadísticas:", err);
        return res.status(500).json({ error: "Error del servidor" });
      }
      
      res.json({
        activeUsers: row.activeUsers || 0,
        totalMessages: row.totalMessages || 0,
        activeStands: Math.floor(Math.random() * 10) + 1 // Placeholder
      });
    }
  );
});

// Endpoint raíz
app.get("/", (req, res) => {
  res.send("Servidor de chat funcionando 🚀");
});

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST", "DELETE"],
  },
});

// Eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id);
  
  // Unirse a una sala de chat específica
  socket.on("joinRoom", (chatRoom) => {
    socket.join(chatRoom);
    console.log(`Usuario ${socket.id} se unió a la sala: ${chatRoom}`);
  });
  
  // ⚠️ CAMBIO IMPORTANTE: El evento debe ser "chatMessage" (como en tu React)
  socket.on("chatMessage", (msg) => {
    console.log("Mensaje recibido:", msg);
    
    // Validar datos del mensaje
    if (!msg.text || !msg.userId || !msg.userName) {
      socket.emit("error", "Datos del mensaje incompletos");
      return;
    }
    
    // Guardar mensaje en la base de datos
    const chatRoom = msg.chatRoom || "general";
    
    db.run(
      `INSERT INTO messages (userId, userName, avatar, text, chatRoom) 
       VALUES (?, ?, ?, ?, ?)`,
      [msg.userId, msg.userName, msg.avatar || "👤", msg.text, chatRoom],
      function(err) {
        if (err) {
          console.error("Error al guardar mensaje:", err);
          socket.emit("error", "Error al guardar el mensaje");
          return;
        }
        
        // Crear objeto mensaje completo con ID de base de datos
        const savedMessage = {
          id: this.lastID,
          userId: msg.userId,
          userName: msg.userName,
          avatar: msg.avatar || "👤",
          text: msg.text,
          timestamp: new Date(),
          type: "user",
          chatRoom: chatRoom
        };
        
        // Enviar mensaje a todos los usuarios en la sala
        if (chatRoom === "general") {
          io.emit("chatMessage", savedMessage);
        } else {
          io.to(chatRoom).emit("chatMessage", savedMessage);
        }
        
        console.log("Mensaje guardado y enviado:", savedMessage);
      }
    );
  });
  
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Base de datos configurada en: ${dbPath}`);
});

// Manejar cierre graceful
process.on("SIGINT", () => {
  console.log("\nCerrando servidor...");
  db.close((err) => {
    if (err) {
      console.error("Error al cerrar la base de datos:", err);
    } else {
      console.log("Base de datos cerrada correctamente.");
    }
    process.exit(0);
  });
});