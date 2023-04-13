import express  from "express";
import { chatService } from "../controllers/chat.js";
import isLoggedIn from "../middlewares/isloggedIn.js";
const chatRouter = express.Router();

chatRouter.post('/chat',isLoggedIn, chatService)

export default chatRouter;