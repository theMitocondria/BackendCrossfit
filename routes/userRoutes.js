import express from "express";
import { addShippingAddress, avatarUpload, forgetPassword, getMyProfile, login, logout, register, registerOtpVerify, resetPassword } from "../controllers/user.js";
import isLoggedIn from "../middlewares/isloggedIn.js";
import upload from "../config/fileUpload.js";
const UserRouter=express.Router();

UserRouter.post("/register", register)
UserRouter.post("/login",login)
UserRouter.post("/register/otp",registerOtpVerify);
UserRouter.post("/forget/password",forgetPassword);
UserRouter.post("/reset/password/:id",resetPassword);
UserRouter.post("/avatar",isLoggedIn,upload.single('file'), avatarUpload);
UserRouter.get("/myprofile",isLoggedIn,getMyProfile);
UserRouter.post("/address",isLoggedIn,addShippingAddress);
UserRouter.post("/logout",isLoggedIn,logout);

export default UserRouter;