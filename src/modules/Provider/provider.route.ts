import express from "express";
const router = express.Router();
import { ProviderController } from "./provider.controller";
import { auth, UserRole } from "../../middlewares/auth.middleware";

router.post("/", auth(UserRole.PROVIDER), ProviderController.register_Provider);
router.get("/:providerId", ProviderController.get_ProviderById);
router.get("/", ProviderController.get_AllProviders);
router.put("/",auth(UserRole.PROVIDER) ,ProviderController.update_Provider);
router.delete("/:providerId", auth(UserRole.PROVIDER,UserRole.ADMIN), ProviderController.delete_Provider);

export const ProviderRouter = router;