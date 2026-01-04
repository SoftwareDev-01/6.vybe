import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import loopRouter from "./routes/loop.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";

import { app, server } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ======================
   🌐 CORS (FINAL FIX)
====================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://six-vybe-1-yyrg.onrender.com",
  "https://six-vybe-4kho.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

/* ======================
   🧩 Middlewares
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ======================
   🛣️ Routes
====================== */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

/* ======================
   ❤️ Health Check
====================== */
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/* ======================
   🚀 Start Server
====================== */
server.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`✅ Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ DB Connection Failed", err);
    process.exit(1);
  }
});
