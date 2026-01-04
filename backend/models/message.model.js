import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    /* 🗑 DELETE LOGIC */
    isDeleted: {
      type: Boolean,
      default: false, // delete for everyone
    },

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // delete for me
      },
    ],

    /* 👀 SEEN / DELIVERED */
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

/* 🚀 PERFORMANCE INDEX */
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

/* ❌ PREVENT EMPTY MESSAGE */
messageSchema.pre("save", function (next) {
  if (!this.message && !this.image) {
    return next(new Error("Message cannot be empty"));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
