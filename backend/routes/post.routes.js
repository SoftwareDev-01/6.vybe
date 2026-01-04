import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { deleteComment } from "../controllers/post.controllers.js";

import {
  comment,
  getAllPosts,
  like,
  saved,
  uploadPost,
} from "../controllers/post.controllers.js";

const postRouter = express.Router();

postRouter.post("/upload", isAuth, upload.single("media"), uploadPost);
postRouter.get("/", isAuth, getAllPosts);
postRouter.post("/like/:postId", isAuth, like);
postRouter.post("/save/:postId", isAuth, saved);
postRouter.post("/comment/:postId", isAuth, comment);
postRouter.delete(
  "/comment/:postId/:commentId",
  isAuth,
  deleteComment
);


export default postRouter;
