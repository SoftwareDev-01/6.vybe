import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

import {
  sendMessage,
  getAllMessages,
  getPrevUserChats,
  deleteMessage, // ✅ ADD
} from "../controllers/message.controllers.js";

const messageRouter = express.Router();

/* ================= SEND MESSAGE ================= */
messageRouter.post(
  "/send/:receiverId",
  isAuth,
  upload.single("image"),
  sendMessage
);

/* ================= GET ALL MESSAGES ================= */
messageRouter.get(
  "/getAll/:receiverId",
  isAuth,
  getAllMessages
);

/* ================= PREVIOUS CHATS ================= */
messageRouter.get(
  "/prevChats",
  isAuth,
  getPrevUserChats
);

/* ================= DELETE MESSAGE ================= */
messageRouter.post(
  "/delete",
  isAuth,
  deleteMessage
);

export default messageRouter;
