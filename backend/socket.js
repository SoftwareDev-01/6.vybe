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
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* userId -> socketId */
const userSocketMap = {};

/* 🔹 Helper: get receiver socket id */
export const getSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  /* 🔹 Save user socket */
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  /* 🔹 Send online users */
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  /* =============================
     ✍️ Typing indicator
  ============================== */

  socket.on("typing", ({ to }) => {
    const receiverSocketId = getSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        from: userId,
      });
    }
  });

  socket.on("stopTyping", ({ to }) => {
    const receiverSocketId = getSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", {
        from: userId,
      });
    }
  });

  /* =============================
     🔌 Disconnect
  ============================== */

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };
