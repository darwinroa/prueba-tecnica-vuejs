const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Usuario unido a la sala: ${room}`);
  });

  socket.on("chatMessage", (data) => {
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor Socket.io escuchando en el puerto ${port}`);
});
