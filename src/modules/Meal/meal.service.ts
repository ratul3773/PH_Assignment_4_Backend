import type { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMeal = async (
  data: Omit<Meal, "mealId" | "createdAt" | "updatedAt" | "providerId">,
  providerId: string
) => {
  // Validate required fields
  if (!data.name || !data.description || !data.price || !data.categoryId) {
    throw new Error(
      "Missing required fields: name, description, price, and categoryId are required"
    );
  }

  // Verify provider exists and get their Provider record ID
  const provider = await prisma.provider.findUnique({
    where: {
      providerId, 
    },
  });

  if (!provider) {
    throw new Error(
      "You must create a provider account before adding meals. Please complete your provider profile."
    );
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: {
      categoryId: data.categoryId,
    },
  });

  if (!category) {
    throw new Error(
      `Category with ID "${data.categoryId}" does not exist. Please select a valid category.`
    );
  }
  const ifExists = await prisma.meal.findFirst({
    where: {
      providerId: provider.id, 
      name: data.name,
    },
  });

  if (ifExists) {
    throw new Error(`A meal named "${data.name}" already exists in your menu.`);
  }

  // Create meal
  const meal = await prisma.meal.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      providerId: provider.id, // Use provider.id (not user's providerId)
      diaetaryTags: data.diaetaryTags || [],
      imageUrl: data.imageUrl ?? null,
      isAvailable: true,
    },
    include: {
      provider: true,
      category: true,
    },
  });

  return meal;
};

const get_AllMeals = async () => {
  const meals = await prisma.meal.findMany({
    // include: {
    // //   provider: true,
    // //   category: true,
    // },
  });
  return meals;
};

const get_MealsByProvider = async (providerId: string) => {

  const meals = await prisma.meal.findMany({
    where: {
      providerId: providerId,
    },
    orderBy: { createdAt: "desc" },
  });

  return meals;
};

const getMealById = async (mealId: string) => {
  const meal = await prisma.meal.findUnique({
    where: {
      mealId,
    },
    // include: {
    //   provider: true,
    //   category: true,
    // },
  });

  if (!meal) {
    throw new Error("Meal not found");
  }

  return meal;
};

const updateMeal = async (
  data: Partial<Omit<Meal, "mealId" | "createdAt" | "updatedAt" | "providerId">>,
  mealId: string,
  providerId?: string
) => {
  const meal = await prisma.meal.findUnique({
    where: {
      mealId,
    },
  });

  if (!meal) {
    throw new Error("Meal not found");
  }

  // Verify provider ownership if providerId is provided
  if (providerId) {
    const provider = await prisma.provider.findUnique({
      where: { providerId },
    });

    if (!provider || meal.providerId !== provider.id) {
      throw new Error("Unauthorized: You can only update your own meals");
    }
  }

  // Verify category exists if provided
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        categoryId: data.categoryId,
      },
    });

    if (!category) {
      throw new Error(
        `Category with ID "${data.categoryId}" does not exist. Please select a valid category.`
      );
    }
  }

  const updatedMeal = await prisma.meal.update({
    where: {
      mealId,
    },
    data,
    // include: {
    //   provider: true,
    //   category: true,
    // },
  });

  return updatedMeal;
};

const deleteMeal = async (mealId: string, providerId?: string) => {
  const meal = await prisma.meal.findUnique({
    where: {
      mealId,
    },
  });

  if (!meal) {
    throw new Error("Meal not found");
  }

  // Verify provider ownership if providerId is provided
  if (providerId) {
    const provider = await prisma.provider.findUnique({
      where: { providerId },
    });

    if (!provider || meal.providerId !== provider.id) {
      throw new Error("Unauthorized: You can only delete your own meals");
    }
  }

  await prisma.meal.delete({
    where: {
      mealId,
    },
  });

  return { success: true, message: "Meal deleted successfully" };
};

// Get meals by category
const getMealsByCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const meals = await prisma.meal.findMany({
    where: {
      categoryId,
      isAvailable: true,
    },
    include: {
      provider: true,
      category: true,
    },
  });

  return meals;
};

// Search meals
const searchMeals = async (query: string) => {
  const meals = await prisma.meal.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
      isAvailable: true,
    },
    include: {
      provider: true,
      category: true,
    },
  });

  return meals;
};

export const MealService = {
  createMeal,
  get_AllMeals,
  get_MealsByProvider,
  getMealById,
  updateMeal,
  deleteMeal,
  getMealsByCategory,
  searchMeals,
};