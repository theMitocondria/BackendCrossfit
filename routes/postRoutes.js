import express from 'express';
import { addComment, allPosts, createPost,  deletePost, likeAndDislikePost, myPosts, userPosts } from '../controllers/post.js';
import multer from 'multer';
import upload from '../config/fileUpload.js';
import isloggedIn from '../middlewares/isloggedIn.js';

const postRouter = express.Router();

postRouter.post('/create', isloggedIn,upload.single("file"),createPost)
postRouter.delete("/:id", isloggedIn, deletePost)
postRouter.get("/all",isloggedIn, allPosts);
postRouter.get("/my",isloggedIn, myPosts);
postRouter.get("/user/:id",isloggedIn, userPosts);
postRouter.post("/comment/:id",isloggedIn, addComment)
postRouter.post("/likeAndDislike/:id",isloggedIn, likeAndDislikePost)

export default postRouter