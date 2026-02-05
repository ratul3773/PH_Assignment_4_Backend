import type { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
    const customers = await prisma.user.findMany();
    return customers;
}

const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    return user;
}

const updateUser = async (userId: string, data: Partial<Omit<User, "id" | "role" | "createdAt" | "updatedAt">>  ) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data
    });
    return updatedUser;
}

const deleteUser = async (userId: string) => {
    await prisma.user.delete({
        where: {
            id: userId
        }
    });
}

export const CustomerService = {
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}