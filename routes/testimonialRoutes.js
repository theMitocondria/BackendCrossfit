import express from "express";
import { allTest, newTest } from "../controllers/testimonial.js";
import isLoggedIn from "../middlewares/isloggedIn.js";
const TestimonialROuter=express.Router();

TestimonialROuter.post("/review/new",isLoggedIn,newTest);
TestimonialROuter.get("/all",isLoggedIn,allTest);
export default TestimonialROuter;