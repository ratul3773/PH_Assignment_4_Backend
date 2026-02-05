import { prisma } from "../../lib/prisma"

const getAllCategories = async ()=>{
    const categories = await prisma.category.findMany();
    return categories;
}

const createCategory = async (name: string)=>{
    const category = await prisma.category.create({
        data:{
            name
        }
    });
    return category;
}

const updateCategory = async (categoryId: string, name: string)=>{
    const category = await prisma.category.update({
        where:{
            categoryId
        },
        data:{
            name
        }
    });
    return category;
}

const deleteCategory = async (categoryId: string)=>{
    await prisma.category.delete({
        where:{
            categoryId
        }
    });
}

export const CategoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}