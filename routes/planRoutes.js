import { plan } from "../controllers/dietPlan.js";
import express from "express";
import isLoggedIn from "../middlewares/isloggedIn.js";

const planRouter = express.Router();

planRouter.post("/plan", isLoggedIn,plan);

export default planRouter;