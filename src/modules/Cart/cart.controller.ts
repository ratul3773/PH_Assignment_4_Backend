import type { Request, Response } from "express";
import { CartService } from "./cart.service";

const add_CartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { mealId, quantity } = req.body;

    if (!mealId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Meal ID and quantity are required",
      });
    }

    const cartItem = await CartService.addCartItem(userId, mealId, quantity);
    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const get_Cart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const cart = await CartService.getCart(userId);
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const remove_CartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const cartItemId = req.params.cartItemId as string;

    const result = await CartService.removeCartItem(userId, cartItemId);
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

const update_CartItemQuantity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const cartItemId = req.params.cartItemId as string;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const cartItem = await CartService.updateCartItemQuantity(
      userId,
      cartItemId,
      quantity
    );
    res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      data: cartItem,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const clear_Cart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await CartService.clearCart(userId);
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

export const CartController = {
  add_CartItem,
  get_Cart,
  remove_CartItem,
  update_CartItemQuantity,
  clear_Cart,
};