import express from "express";
import { CartController } from "./cart.controller";
import { auth, UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();

// Add item to cart
router.post("/",auth(UserRole.CUSTOMER) ,CartController.add_CartItem);

// Get user's cart
router.get("/",auth(UserRole.CUSTOMER), CartController.get_Cart);

// Update cart item quantity
router.patch("/:cartItemId",auth(UserRole.CUSTOMER), CartController.update_CartItemQuantity);

// Remove item from cart
router.delete("/:cartItemId",auth(UserRole.CUSTOMER), CartController.remove_CartItem);

// Clear entire cart
router.delete("/",auth(UserRole.CUSTOMER), CartController.clear_Cart);

export const CartRoute = router;