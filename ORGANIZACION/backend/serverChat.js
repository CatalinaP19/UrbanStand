 
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// ejemplo endpoint REST
app.get("/", (req, res) => {
  res.send("Servidor de chat funcionando 🚀");
});

// creamos server http a partir de express
const server = http.createServer(app);

// instanciamos socket.io sobre ese server
const io = new Server(server, {
  cors: {
    origin: "*", // en producción limita a tu dominio
    methods: ["GET", "POST", "DELETE"],
  },
});

// eventos de conexión Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id);

  // recibir mensajes desde cliente
  socket.on("chat_message", (msg) => {
    console.log("Mensaje recibido:", msg);

    // reenviar a todos los clientes conectados
    io.emit("chat_message", msg);
  });

  // desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// iniciar servidor
const PORT = 3005;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});