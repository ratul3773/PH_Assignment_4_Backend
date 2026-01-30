import type { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMeal = async (data: Omit<Meal, "mealId" | "createdAt" | "updatedAt">) => {
    const ifExists = await prisma.meal.findFirst(
        {
            where: {
                providerId:data.providerId,
                name:data.name
            }
        }
    );
    if (ifExists) {
        throw new Error(`A meal named "${data.name}" already exists in your menu.`);
    }
    const meal = await prisma.meal.create({
        data,
    });
    return meal;
}

const get_AllMeals = async () => {
    const meals = await prisma.meal.findMany();
    return meals;
}

const getMealById = async (mealId: string) => {
    const meal = await prisma.meal.findUnique({
        where: {
            mealId
        }
    });
    return meal;
}

const updateMeal = async(data: Partial<Omit<Meal, "mealId" | "createdAt" | "updatedAt">>, mealId: string)=>{
    const updatedMeal = await prisma.meal.update({
        where:{
            mealId
        },
        data
    });
    return updatedMeal;
}

const deleteMeal = async(mealId: string)=>{
    await prisma.meal.delete({
        where:{
            mealId
        }
    });
}

export const MealService = {
    createMeal,
    get_AllMeals,
    getMealById,
    updateMeal,
    deleteMeal
}