import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

/* ================= UPLOAD POST ================= */
export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Media is required" });
    }

    const media = await uploadOnCloudinary(req.file.path);

    if (!media) {
      return res.status(500).json({ message: "Media upload failed" });
    }

    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: post._id },
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name userName profileImage"
    );

    return res.status(201).json(populatedPost);
  } catch (error) {
    console.error("uploadPost ERROR:", error);
    return res.status(500).json({ message: "Upload post failed" });
  }
};

/* ================= GET ALL POSTS ================= */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Get posts failed" });
  }
};

/* ================= LIKE POST ================= */
export const like = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);

      if (post.author.toString() !== req.userId.toString()) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author,
          type: "like",
          post: post._id,
          message: "liked your post",
        });

        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver post");

        const receiverSocketId = getSocketId(post.author);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", populatedNotification);
        }
      }
    }

    await post.save();

    io.emit("likedPost", {
      postId: post._id,
      likes: post.likes,
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error("like ERROR:", error);
    return res.status(500).json({ message: "Like failed" });
  }
};

/* ================= COMMENT ================= */
export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      author: req.userId,
      message,
    });

    if (post.author.toString() !== req.userId.toString()) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: post.author,
        type: "comment",
        post: post._id,
        message: "commented on your post",
      });

      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender receiver post");

      const receiverSocketId = getSocketId(post.author);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await post.save();
    await post.populate("author", "name userName profileImage");
    await post.populate("comments.author", "name userName profileImage");

    io.emit("commentedPost", {
      postId: post._id,
      comments: post.comments,
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error("comment ERROR:", error);
    return res.status(500).json({ message: "Comment failed" });
  }
};

/* ================= SAVE POST ================= */
export const saved = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const postId = req.params.postId;

    const alreadySaved = user.saved.some(
      (id) => id.toString() === postId.toString()
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId.toString()
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();
    await user.populate("saved");

    return res.status(200).json(user);
  } catch (error) {
    console.error("save ERROR:", error);
    return res.status(500).json({ message: "Save failed" });
  }
};

/* ================= DELETE COMMENT ================= */
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // find comment
    const comment = post.comments.find(
      (c) => c._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // only author of comment OR post author can delete
    if (
      comment.author.toString() !== req.userId.toString() &&
      post.author.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // remove comment
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId
    );

    await post.save();
    await post.populate("comments.author", "name userName profileImage");

    // 🔴 emit realtime update
    io.emit("commentedPost", {
      postId: post._id,
      comments: post.comments,
    });

    // ✅ return updated comments array
    return res.status(200).json(post.comments);
  } catch (error) {
    console.error("deleteComment ERROR:", error);
    return res.status(500).json({ message: "Delete comment failed" });
  }
};
