import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
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

export default postRouter;
