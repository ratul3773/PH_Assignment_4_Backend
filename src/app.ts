import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import { CategoryRouter } from "./modules/Category/category.route";
import { MealRouter } from "./modules/Meal/meal.route";
import { CustomerRouter } from "./modules/Customer/customer.route";
import { ProviderRouter } from "./modules/Provider/provider.route";


const app = express();
app.use(express.json())

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/users", CustomerRouter)
app.use("/api/meals", MealRouter)
app.use("/api/categories", CategoryRouter)
app.use("/api/providers", ProviderRouter)


export { app };