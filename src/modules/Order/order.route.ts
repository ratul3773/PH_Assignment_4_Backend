import express from "express";
import { OrderController } from "./order.controller";
import { auth, UserRole } from "../../middlewares/auth.middleware";

const router = express.Router();


// Customer routes
router.post("/", auth(UserRole.CUSTOMER), OrderController.create_Order); // Create order from cart
router.get("/customer/orders", auth(UserRole.CUSTOMER), OrderController.get_CustomerOrders); // Get customer's orders
router.delete("/:orderId", auth(UserRole.CUSTOMER), OrderController.cancel_Order); // Cancel order

// Provider routes
router.get("/provider/orders", auth(UserRole.PROVIDER), OrderController.get_ProviderOrders); // Get provider's orders
router.get("/provider/stats", auth(UserRole.PROVIDER), OrderController.get_OrderStats); // Get order statistics
router.patch("/:orderId/payment-status", auth(UserRole.PROVIDER), OrderController.update_PaymentStatus); // Update payment status
router.patch("/:orderId/status", auth(UserRole.PROVIDER), OrderController.update_OrderStatus); // Update delivery status

// Common routes
router.get("/:orderId", auth(UserRole.CUSTOMER, UserRole.PROVIDER), OrderController.get_OrderById); // Get order by ID

export default router;