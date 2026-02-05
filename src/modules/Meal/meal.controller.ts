import type { Request, Response } from "express";
import { MealService } from "./meal.service"

const create_Meal = async(req: Request, res: Response)=>{
    try{
        const providerId = req.user?.id as string;  
        const meal = await MealService.createMeal(req.body, providerId);
        res.status(201).json({
            success: true,
            message: "Meal created successfully",
            data: meal
        });
    }catch(err : any){
        res.status(403).json({ 
            success: false,
            message: err.message
         });
    }
}

const get_AllMeals = async(req: Request, res: Response)=>{
    try{
        const meals = await MealService.get_AllMeals();
        res.status(200).json({
            success: true,
            message: "Meals fetched successfully",
            data: meals
        });
    }catch(err : any){
        res.status(500).json({ 
            success: false,
            message: err.message
         });
    }
}

const get_MealsByProvider = async(req: Request, res: Response)=>{
    try{
        const providerId = req.params.id as string;
        const meals = await MealService.get_MealsByProvider(providerId);
        res.status(200).json({
            success: true,
            message: "Meals fetched successfully",
            data: meals
        });
    }catch(err : any){
        res.status(500).json({ 
            success: false,
            message: err.message
         });
    }
}

const get_MealById = async(req: Request, res: Response)=>{
    try{
        const mealId = req.params.mealId as string;
        const meal = await MealService.getMealById(mealId);
        res.status(200).json({
            success: true,
            message: "Meal fetched successfully",
            data: meal
        });
    }catch(err : any){
        res.status(500).json({ 
            success: false,
            message: err.message
         });
    }
}

const update_Meal = async(req: Request, res: Response)=>{
    try{
        const mealId = req.params.mealId as string;
        const data = req.body;
        const updatedMeal = await MealService.updateMeal(data, mealId);
        res.status(200).json({
            success: true,
            message: "Meal updated successfully",
            data: updatedMeal
        });
    }catch(err : any){
        res.status(500).json({ 
            success: false,
            message: err.message
         });
    }
}

const delete_Meal = async(req: Request, res: Response)=>{
    try{
        const mealId = req.params.mealId as string;
        await MealService.deleteMeal(mealId);
        res.status(200).json({
            success: true,
            message: "Meal deleted successfully"
        });
    }catch(err : any){
        res.status(500).json({ 
            success: false,
            message: err.message
         });
    }
}

export const MealController = {
    create_Meal,
    get_AllMeals,
    get_MealsByProvider,
    get_MealById,
    update_Meal,
    delete_Meal
}