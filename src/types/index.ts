declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                emailVerified: boolean;
                role: string;
                phoneNumber?: string;
                address?: string;
            };
        }
    }
}