import express from "express";
import { MealController } from "./meal.controller";
import { auth, UserRole } from "../../middlewares/auth.middleware";


const router = express.Router();

router.get("/", MealController.get_AllMeals);
router.get("/:mealId", MealController.get_MealById);
router.post("/", auth(UserRole.PROVIDER), MealController.create_Meal);
router.put("/:mealId", auth(UserRole.PROVIDER), MealController.update_Meal);
router.delete("/:mealId", auth(UserRole.PROVIDER), MealController.delete_Meal);
export const MealRouter = router;