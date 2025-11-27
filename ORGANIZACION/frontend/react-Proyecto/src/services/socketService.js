import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(serverUrl = 'http://localhost:3006') {
    if (this.socket && this.connected) {
      console.log('Socket ya está conectado');
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor de chat:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor de chat');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    return this.socket;
  }

  joinRoom(localidad, userId, userName) {
    if (!this.socket) {
      console.error('Socket no está inicializado');
      return;
    }

    this.socket.emit('joinRoom', {
      localidad: localidad.toLowerCase(),
      userId,
      userName
    });

    console.log(`🚪 Uniéndose a la sala de: ${localidad}`);
  }

  sendMessage(messageData) {
    if (!this.socket) {
      console.error('Socket no está inicializado');
      return;
    }

    this.socket.emit('chatMessage', {
      ...messageData,
      localidad: messageData.localidad.toLowerCase()
    });
  }

  onMessage(callback) {
    if (!this.socket) return;
    this.socket.on('chatMessage', callback);
  }

  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on('userJoined', callback);
  }

  onUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on('userLeft', callback);
  }

  onError(callback) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

// Exportar instancia singleton
export default new SocketService();