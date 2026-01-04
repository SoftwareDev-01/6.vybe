import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import loopRouter from "./routes/loop.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";

import { app, server } from "./socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

/* ======================
   🌐 CORS (PRO SAFE)
====================== */
app.use(
  cors({
    origin: [
      "https://six-vybe-1-yyrg.onrender.com",
      "http://localhost:5173",
    ],
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
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

/* ======================
   🚀 Server + DB
====================== */
server.listen(port, async () => {
  try {
    await connectDb();
    console.log(`✅ Server running on port ${port}`);
  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
});
