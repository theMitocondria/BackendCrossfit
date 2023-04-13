import express from "express";
import { allProduct, createProduct, giveReview, singleProduct } from "../controllers/product.js";
import upload from "../config/fileUpload.js";
import isLoggedIn from "../middlewares/isloggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
const ProductRouter=express.Router();

ProductRouter.post("/new",isLoggedIn,isAdmin,upload.single('file'),createProduct);
ProductRouter.get("/all",allProduct);
ProductRouter.post("/review/:id",isLoggedIn,giveReview);
ProductRouter.get("/:id",isLoggedIn,singleProduct);

export default ProductRouter;