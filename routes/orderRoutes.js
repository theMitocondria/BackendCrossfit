import  express  from "express";
import { createOrder, getAllOrder, getSingleOrder } from "../controllers/order.js";
import isLoggedIn from "../middlewares/isloggedIn.js";

const orderRouter = express.Router();

orderRouter.get('/all',isLoggedIn, getAllOrder)
orderRouter.get('/:id', isLoggedIn, getSingleOrder)
orderRouter.post("/new",isLoggedIn ,createOrder);

export default orderRouter;