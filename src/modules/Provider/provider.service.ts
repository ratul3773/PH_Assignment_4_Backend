import { Prisma, type Provider } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const registerProvider = async (providerId: string, data: Omit<Provider, "id" | "createdAt" | "updatedAt">) => {
    
    // Check if providerId is provided
    if (!providerId) {
        throw new Error("providerId (User ID) is required to create a provider.");
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: {
            id: providerId
        }
    });

    if (!user) {
        throw new Error("User with the given providerId does not exist.");
    }

    // Check if provider already exists
    const isExist = await prisma.provider.findFirst({
        where: {
            OR: [
                { email: data.email },
                { providerId: providerId },
                { restaurantName: data.restaurantName }
            ]
        }
    });

    if(isExist){
        throw new Error("Provider with given details already exists.");
    }

    const provider = await prisma.provider.create({
        data: {
            restaurantName: data.restaurantName,
            description: data.description,
            cuisineType: data.cuisineType,
            address: data.address,
            contact: data.contact,
            email: data.email,
            deliveryFee: data.deliveryFee,
            openingHours: data.openingHours ?? Prisma.JsonNull,
            isOpen: data.isOpen,
            logoUrl: data.logoUrl ?? null,
            bannerUrl: data.bannerUrl ?? null,
            minOrderAmount: data.minOrderAmount,
            isApproved: data.isApproved,
            rating: data.rating,
            totalReviews: data.totalReviews,
            provider: {
                connect: {
                    id: providerId
                }
            }
        }
    });
    return provider;
}

const getProviderById = async (providerId: string) => {
    const provider = await prisma.provider.findUnique({
        where: {
            id: providerId
        }
    });
    return provider;
}

const getAllProviders = async () => {
    const providers = await prisma.provider.findMany();
    return providers;
}

const updateProvider = async (providerId: string, data: Partial<Omit<Provider, "id" | "createdAt" | "updatedAt">>) => {
    const provider = await prisma.provider.update({
        where: {
            id: providerId
        },
        data: data as any
    });
    return provider;
}

const deleteProvider = async (providerId: string) => {
    const provider = await prisma.provider.delete({
        where: {
            id: providerId
        }
    });
    return provider;
}

export const ProviderService = {
    registerProvider,
    getProviderById,
    getAllProviders,
    updateProvider,
    deleteProvider
};