import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://six-vybe-1-yyrg.onrender.com",
      "https://six-vybe-4kho.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

/* 🔹 Helper */
export const getSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  /* 🟢 Online users */
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  /* ================= TYPING ================= */

  socket.on("typing", ({ to }) => {
    const receiverSocket = getSocketId(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("typing");
    }
  });

  socket.on("stopTyping", ({ to }) => {
    const receiverSocket = getSocketId(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("stopTyping");
    }
  });

  /* ================= MESSAGE SEEN ================= */

  socket.on("messageSeen", ({ messageId, to }) => {
    const senderSocket = getSocketId(to);
    if (senderSocket) {
      io.to(senderSocket).emit("messageSeen", { messageId });
    }
  });

  /* ================= MESSAGE DELETE ================= */

  socket.on("deleteMessage", ({ messageId, to }) => {
    const receiverSocket = getSocketId(to);
    if (receiverSocket) {
      io.to(receiverSocket).emit("messageDeleted", { messageId });
    }
  });

  /* ================= DISCONNECT ================= */

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
