import express from "express";
import { improvementPost } from "../controllers/improve.js";
import isLoggedIn from "../middlewares/isloggedIn.js";
const improveRouter=express.Router();
improveRouter.post("/post",isLoggedIn,improvementPost);
export default improveRouter