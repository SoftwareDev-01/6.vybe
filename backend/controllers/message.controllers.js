import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { getSocketId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { text } = req.body;

    let media = null;

    // ✅ SAFE MEDIA HANDLING
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    }

    if (!text && !media) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // ✅ FIND OR CREATE CONVERSATION
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    // ✅ CREATE MESSAGE
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      media,
      conversationId: conversation._id,
    });

    conversation.messages.push(message._id);
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name userName profileImage")
      .populate("receiver", "name userName profileImage");

    // 🔴 REALTIME DELIVERY
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("sendMessage ERROR:", error);
    return res.status(500).json({ message: "Send message failed" });
  }
};
