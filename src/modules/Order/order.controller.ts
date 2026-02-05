import type { Request, Response } from "express";
import { OrderService } from "./order.service";

const create_Order = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { deliveryAddress, paymentMethod } = req.body;

    if (!deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Delivery address and payment method are required",
      });
    }

    const order = await OrderService.createOrderFromCart(
      userId,
      deliveryAddress,
      paymentMethod
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const get_CustomerOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const orders = await OrderService.getCustomerOrders(userId);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const get_ProviderOrders = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.id as string;
    const orders = await OrderService.getProviderOrders(providerId);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const get_OrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { orderId } = req.params;

    const order = await OrderService.getOrderById(orderId as string, userId);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const update_PaymentStatus = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.id as string;
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const order = await OrderService.updateOrderPaymentStatus(
      orderId as string,
      paymentStatus,
      providerId
    );

    res.status(200).json({
      success: true,
      message: "Order payment status updated",
      data: order,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const cancel_Order = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { orderId } = req.params;

    const result = await OrderService.cancelOrder(orderId as string, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const get_OrderStats = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.id as string;
    const stats = await OrderService.getProviderOrderStats(providerId);

    res.status(200).json({
      success: true,
      message: "Order statistics fetched successfully",
      data: stats,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const update_OrderStatus = async (req: Request, res: Response) => {
  try {
    const providerId = req.user?.id as string;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await OrderService.updateOrderStatus(orderId as string, status, providerId);

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const OrderController = {
  create_Order,
  get_CustomerOrders,
  get_ProviderOrders,
  get_OrderById,
  update_PaymentStatus,
  cancel_Order,
  get_OrderStats,
  update_OrderStatus,
};