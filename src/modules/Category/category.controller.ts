import type { Request, Response } from "express";
import { CategoryService } from "./category.service";

const get_AllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryService.getAllCategories();
        return res.status(200).json({
            success: true,
            data: categories
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const create_Category = async (req: Request, res: Response) => {
    try{
        const { name } = req.body;
        const category = await CategoryService.createCategory(name);
        return res.status(201).json({
            success: true,
            data: category
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const update_Category = async (req: Request, res: Response) => {
    try{
        const { categoryId } = req.params;
        const { name } = req.body;
        const category = await CategoryService.updateCategory(categoryId as string, name);
        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message 
        });
    }
}

const delete_Category = async (req: Request, res: Response) => {
    try{
        const { categoryId } = req.params;
        await CategoryService.deleteCategory(categoryId as string);
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const CategoryController = {
    get_AllCategories,
    create_Category,
    update_Category,
    delete_Category
}