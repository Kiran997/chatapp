// server.js
import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';

const app = express();
const server = createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
