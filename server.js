const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend files
app.use(express.static(path.join(__dirname)));

// Store connected users
let users = {};

io.on('connection', (socket) => {

  // User joins
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('message', {
      type: 'system',
      text: `${username} joined the chat`,
      time: getTime()
    });
    io.emit('userCount', Object.keys(users).length);
  });

  // User sends message
  socket.on('message', (text) => {
    io.emit('message', {
      type: 'user',
      user: users[socket.id] || 'Anonymous',
      text: text,
      time: getTime()
    });
  });

  // User disconnects
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      io.emit('message', {
        type: 'system',
        text: `${username} left the chat`,
        time: getTime()
      });
      io.emit('userCount', Object.keys(users).length);
    }
  });

});

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});