import { auth as betterAuth } from "../lib/auth";
import type { NextFunction, Request, Response } from "express";

export enum UserRole {
    ADMIN = "ADMIN",
    PROVIDER = "PROVIDER",
    CUSTOMER = "CUSTOMER"
}

const auth = (...roles: UserRole[])=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })
            if(!session){
                return res.status(401).json({ 
                    success: false,
                    message: "Unauthorized" 
                });
            }
            if(!session.user.emailVerified){
                return res.status(401).json({ 
                    success: false,
                    message: "Email not verified" 
                });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                emailVerified: session.user.emailVerified,
                role: session.user.role as string,
                phoneNumber: session.user.phoneNumber as string,
                address: session.user.address as string
            };
            if(roles.length && !roles.includes(req.user.role as UserRole)){
                return res.status(403).json({ 
                    success: false,
                    message: "Forbidden Access - You don't have permission to access this resource" 
                });
            };
            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export { auth };