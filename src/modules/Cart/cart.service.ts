import { prisma } from "../../lib/prisma";

const addCartItem = async (userId: string, mealId: string, quantity: number) => {
  let cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId: userId },
    });
  }

  const meal = await prisma.meal.findUnique({
    where: { mealId },
  });

  if (!meal) {
    throw new Error("Meal not found");
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.cartId,
      mealId,
    },
  });

  if (existingCartItem) {

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + quantity,
        subtotal: (existingCartItem.quantity + quantity) * meal.price,
      },
      include: { meal: true },
    });
    return updatedCartItem;
  }

  // Create new cart item
  const newCartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.cartId,
      mealId,
      quantity,
      unitPrice: meal.price,
      subtotal: quantity * meal.price,
    },
    include: { meal: true },
  });

  return newCartItem;
};

const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
    include: {
      cartItems: {
        include: { meal: true },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return { ...cart, totalPrice };
};

const removeCartItem = async (userId: string, cartItemId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem || cartItem.cartId !== cart.cartId) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { success: true, message: "Item removed from cart" };
};

const updateCartItemQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem || cartItem.cartId !== cart.cartId) {
    throw new Error("Cart item not found");
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity,
      subtotal: quantity * cartItem.unitPrice,
    },
    include: { meal: true },
  });

  return updatedCartItem;
};

const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.cartId },
  });

  return { success: true, message: "Cart cleared" };
};

export const CartService = {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
};