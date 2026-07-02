import express from "express"
import { isAuth } from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { createPost, getPosts, likePost, commentPost } from "../controllers/post.controller.js"

const postRouter = express.Router()

postRouter.post("/create", isAuth, upload.single("image"), createPost)
postRouter.get("/get-posts", isAuth, getPosts)
postRouter.get("/like/:id", isAuth, likePost)
postRouter.post("/comment/:id", isAuth, commentPost)

export default postRouter