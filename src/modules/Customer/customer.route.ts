import express from "express";
import { CustomerController } from "./customer.controller";
import { auth, UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/",auth(UserRole.ADMIN) ,CustomerController.get_AllUsers);
router.get("/me", auth(UserRole.CUSTOMER,UserRole.ADMIN,UserRole.PROVIDER), CustomerController.get_UserById);
router.put("/me", auth(UserRole.CUSTOMER,UserRole.ADMIN,UserRole.PROVIDER), CustomerController.update_User);
router.delete("/:id", auth(UserRole.ADMIN), CustomerController.delete_User);

export const CustomerRouter = router;