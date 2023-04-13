import { allCategory, createCategory, deleteCategory, particularCategoryProduct } from "../controllers/category.js";
import express from "express";
import isLoggedIn from "../middlewares/isloggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../config/fileUpload.js";

const categoryRouter = express.Router();

categoryRouter.post("/new",isLoggedIn, isAdmin , upload.single('file') ,createCategory);
categoryRouter.get("/all",isLoggedIn,allCategory);
categoryRouter.delete("/:id",isLoggedIn, isAdmin , deleteCategory);
categoryRouter.get("/:id",isLoggedIn , particularCategoryProduct)


export default categoryRouter;