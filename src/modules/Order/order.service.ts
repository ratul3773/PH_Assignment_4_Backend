import type { Order, OrderItem } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Create order from cart
const createOrderFromCart = async (
  userId: string,
  deliveryAddress: string,
  paymentMethod: "CASH_ON_DELIVERY" | "CREDIT_CARD" | "DIGITAL_WALLET"
) => {
  // Get user's cart with items
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
    include: {
      cartItems: {
        include: { meal: true },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Check if all items have same provider
  const providerIds = new Set(cart.cartItems.map((item) => item.meal.providerId));

  if (providerIds.size > 1) {
    throw new Error("All items in cart must be from the same provider");
  }

  const providerId = cart.cartItems[0]!.meal.providerId;

  // Calculate total amount
  const totalAmount = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Check minimum order amount
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  if (totalAmount < provider.minOrderAmount) {
    throw new Error(
      `Minimum order amount is ${provider.minOrderAmount}. Current total: ${totalAmount}`
    );
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId: userId,
      providerId,
      totalAmount: totalAmount + provider.deliveryFee,
      deliveryAddress,
      paymentMethod,
      paymentStatus: "PENDING",
      orderItems: {
        create: cart.cartItems.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      },
    },
    include: {
      orderItems: {
        include: { meal: true },
      },
      provider: true,
      customer: true,
    },
  });

  // Clear cart after order creation
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.cartId },
  });

  return order;
};

// Get all orders for a customer
const getCustomerOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      orderItems: {
        include: { meal: true },
      },
      provider: true,
      customer: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

// Get all orders for a provider
const getProviderOrders = async (providerId: string) => {
  const orders = await prisma.order.findMany({
    where: { providerId },
    include: {
      orderItems: {
        include: { meal: true },
      },
      provider: true,
      customer: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

// Get single order by ID
const getOrderById = async (orderId: string, userId?: string) => {
  const order = await prisma.order.findUnique({
    where: { orderId },
    include: {
      orderItems: {
        include: { meal: true },
      },
      provider: true,
      customer: true,
      reviews: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Verify user is either customer or provider of this order
  if (userId && order.customerId !== userId && order.providerId !== userId) {
    throw new Error("Unauthorized access to this order");
  }

  return order;
};

// Update order payment status
const updateOrderPaymentStatus = async (
  orderId: string,
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED",
  providerId?: string
) => {
  const order = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

//   // Verify provider can update their own order
//   if (providerId && order.providerId !== providerId) {
//     throw new Error("Unauthorized to update this order");
//   }

  const updatedOrder = await prisma.order.update({
    where: { orderId },
    data: { paymentStatus },
    include: {
      orderItems: {
        include: { meal: true },
      },
      provider: true,
      customer: true,
    },
  });

  return updatedOrder;
};

// Cancel order
const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Only customer can cancel
  if (order.customerId !== userId) {
    throw new Error("Unauthorized to cancel this order");
  }

  // Cannot cancel completed orders
  if (order.paymentStatus === "COMPLETED") {
    throw new Error("Cannot cancel a completed order");
  }

  // Delete order items and order
  await prisma.orderItem.deleteMany({
    where: { orderId },
  });

  await prisma.order.delete({
    where: { orderId },
  });

  return { success: true, message: "Order cancelled successfully" };
};

// Get order statistics for provider
const getProviderOrderStats = async (providerId: string) => {
  const orders = await prisma.order.findMany({
    where: { providerId },
    include: {
      orderItems: true,
    },
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.paymentStatus === "PENDING").length;
  const completedOrders = orders.filter((o) => o.paymentStatus === "COMPLETED").length;
  const failedOrders = orders.filter((o) => o.paymentStatus === "FAILED").length;
  const totalItems = orders.reduce(
    (sum, order) => sum + order.orderItems.reduce((s, item) => s + item.quantity, 0),
    0
  );

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    completedOrders,
    failedOrders,
    totalItemsSold: totalItems,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
};

// Update order delivery status (for providers)
const updateOrderStatus = async (
  orderId: string,
  status: string,
  providerId: string
) => {
  const order = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.providerId !== providerId) {
    throw new Error("Unauthorized to update this order");
  }

  // Store status in updatedAt as a simple solution
  // In production, add a separate 'deliveryStatus' or 'orderStatus' field
  const updatedOrder = await prisma.order.update({
    where: { orderId },
    data: { updatedAt: new Date() },
    include: {
      orderItems: {
        include: { meal: true },
      },
      provider: true,
      customer: true,
    },
  });

  return updatedOrder;
};

export const OrderService = {
  createOrderFromCart,
  getCustomerOrders,
  getProviderOrders,
  getOrderById,
  updateOrderPaymentStatus,
  cancelOrder,
  getProviderOrderStats,
  updateOrderStatus,
};