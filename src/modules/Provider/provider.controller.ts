import type { Request, Response } from "express";
import { ProviderService } from "./provider.service";

const get_AllProviders = async (req: Request, res: Response) => {
    try {
        const providers = await ProviderService.getAllProviders();
        res.status(200).json({
            success: true,
            data: providers
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message});
    }
}

const get_ProviderById = async (req: Request, res: Response) => {
    try {
        const providerId = (req.params.providerId) as string;
        const provider = await ProviderService.getProviderById(providerId);
        res.status(200).json({
            success: true,
            data: provider
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message});
    }
}

const register_Provider = async (req: Request, res: Response) => {
    try {
        const providerId = req.user?.id as string;
        const provider = await ProviderService.registerProvider(providerId, req.body);
        res.status(201).json({
            success: true,
            data: provider
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message});
    }
}

const update_Provider = async (req: Request, res: Response) => {
    try {
        const providerId = (req.user?.id) as string;
        const provider = await ProviderService.updateProvider(providerId, req.body);
        res.status(200).json({
            success: true,
            data: provider
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message});
    }
}

const delete_Provider = async (req: Request, res: Response) => {
    try {
        const providerId = (req.user?.id || req.params.providerId) as string;
        const provider = await ProviderService.deleteProvider(providerId);
        res.status(200).json({
            success: true,
            data: provider
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message});
    }
}

export const ProviderController = {
    get_AllProviders,
    get_ProviderById,
    register_Provider,
    update_Provider,
    delete_Provider
};