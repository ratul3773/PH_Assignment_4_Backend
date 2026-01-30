import express from "express";
import { MealRouter } from "./modules/Meal/meal.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
app.use(express.json())

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/meals", MealRouter)

export { app };