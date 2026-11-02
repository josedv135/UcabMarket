const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(session({ secret: 'ucabmarket-dev', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de cada HU: src/routes/<meta>.js
// app.use('/api/chats', require('./routes/chats'));

io.on('connection', () => {});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`UcabMarket en http://localhost:${PORT}`));
