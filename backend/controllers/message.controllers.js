import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";

/* ================= SEND MESSAGE ================= */

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image = null;
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      image = uploaded?.secure_url || null;
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
      status: "sent",
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        ...newMessage._doc,
        status: "delivered",
      });
    }

    return res.status(200).json({
      ...newMessage._doc,
      status: receiverSocketId ? "delivered" : "sent",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Send message error" });
  }
};

/* ================= GET ALL MESSAGES ================= */

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    return res.status(200).json(conversation?.messages || []);

  } catch (error) {
    return res.status(500).json({ message: "Get messages error" });
  }
};

/* ================= GET PREVIOUS CHAT USERS ================= */

export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const userMap = {};

    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id.toString() !== currentUserId.toString()) {
          userMap[user._id] = user;
        }
      });
    });

    return res.status(200).json(Object.values(userMap));

  } catch (error) {
    return res.status(500).json({ message: "Previous chat users error" });
  }
};

/* ================= DELETE MESSAGE ================= */

export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageId, type } = req.body; // type = "me" | "everyone"

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 🔴 Delete for everyone (only sender)
    if (type === "everyone") {
      if (message.sender.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Not allowed to delete for everyone" });
      }

      message.isDeleted = true;
      await message.save();

      const receiverSocket = getSocketId(message.receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit("messageDeleted", {
          messageId,
        });
      }
    }

    // 🟡 Delete for me
    if (type === "me") {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Delete message failed" });
  }
};
