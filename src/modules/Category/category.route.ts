import express from "express";

const router = express.Router();
import { CategoryController } from "./category.controller";
import { auth, UserRole } from "../../middlewares/auth.middleware";


router.get("/", auth(UserRole.ADMIN),CategoryController.get_AllCategories);
router.post("/", auth(UserRole.ADMIN),CategoryController.create_Category);
router.put("/:categoryId", auth(UserRole.ADMIN),CategoryController.update_Category);
router.delete("/:categoryId", auth(UserRole.ADMIN),CategoryController.delete_Category);

export const CategoryRouter = router;