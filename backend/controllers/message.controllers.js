import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";

/* ================= SEND MESSAGE ================= */

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId; // ✅ SAFE
    const receiverId = req.params.receiverId;
    const { text } = req.body; // ✅ CONSISTENT WITH FRONTEND

    let media = null;

    // ✅ SAFE MEDIA UPLOAD
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path); // returns URL string
    }

    // ❌ prevent empty messages
    if (!text && !media) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // ✅ FIND OR CREATE CONVERSATION
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // ✅ CREATE MESSAGE
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      media,
      status: "sent",
      conversationId: conversation._id,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    // 🔴 REALTIME DELIVERY
    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        ...newMessage._doc,
        status: "delivered",
      });
    }

    return res.status(201).json({
      ...newMessage._doc,
      status: receiverSocketId ? "delivered" : "sent",
    });
  } catch (error) {
    console.error("sendMessage ERROR:", error);
    return res.status(500).json({ message: "Send message failed" });
  }
};

/* ================= GET ALL MESSAGES ================= */

export const getAllMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await Message.find({
      _id: { $in: conversation.messages },
      deletedFor: { $nin: [userId] },
      isDeleted: { $ne: true },
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("getAllMessages ERROR:", error);
    return res.status(500).json({ message: "Get messages failed" });
  }
};

/* ================= GET PREVIOUS CHAT USERS ================= */

export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "name userName profileImage")
      .sort({ updatedAt: -1 });

    const usersMap = {};

    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id.toString() !== currentUserId.toString()) {
          usersMap[user._id] = user;
        }
      });
    });

    return res.status(200).json(Object.values(usersMap));
  } catch (error) {
    console.error("getPrevUserChats ERROR:", error);
    return res.status(500).json({ message: "Previous chat users error" });
  }
};

/* ================= DELETE MESSAGE ================= */

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { messageId, type } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 🔴 DELETE FOR EVERYONE
    if (type === "everyone") {
      if (message.sender.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Not allowed to delete for everyone",
        });
      }

      await Message.findByIdAndUpdate(messageId, {
        isDeleted: true,
      });

      const receiverSocketId = getSocketId(message.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeletedForEveryone", {
          messageId,
        });
      }
    }

    // 🟡 DELETE FOR ME
    if (type === "me") {
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: userId },
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteMessage ERROR:", error);
    return res.status(500).json({ message: "Delete message failed" });
  }
};
