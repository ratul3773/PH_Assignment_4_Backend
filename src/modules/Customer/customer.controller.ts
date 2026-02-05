import type { Request, Response } from "express";
import { CustomerService } from "./customer.service";

const get_AllUsers = async (req: Request, res: Response) => {
    try{
        const customers = await CustomerService.getAllUser();
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (err : any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const get_UserById = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id as string;
        const user = await CustomerService.getUserById(userId);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err : any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const update_User = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id as string;
        const data = req.body;
        const updatedUser = await CustomerService.updateUser(userId, data);
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (err : any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const delete_User = async (req: Request, res: Response) => {
    try{
        const userId = req.params.id as string;
        await CustomerService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err : any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const CustomerController = {
    get_AllUsers,
    get_UserById,
    update_User,
    delete_User
}