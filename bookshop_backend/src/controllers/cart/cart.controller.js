const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Cart } = require("../../models/Cart.model");
const { Book } = require("../../models/Book.model");
// Add an item to the cart
const addCartItem = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    // 1. Check if a cart already exists for the user
    let cart = await Cart.findOne({ userId });

    const book = await Book.findById(bookId);
    if (!book) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Book not found");
    }

    // If the cart does not exist, create a new cart for the user
    if (!cart) {
      const validQuantity =
        quantity <= book.quantity ? quantity : book.quantity;

      const newCart = new Cart({
        userId,
        items: [{ bookId, quantity: validQuantity }],
      });

      // Save the new cart
      await newCart.save();

      // Return Response
      return response(
        res,
        StatusCodes.CREATED,
        true,
        newCart,
        "Cart created successfully"
      );
    }

    // If the cart exists, check if the book is already in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
      // If the book exists in the cart, update the quantity
      const validQuantity =
        cart.items[itemIndex].quantity + quantity <= book.quantity
          ? cart.items[itemIndex].quantity + quantity
          : book.quantity;
      cart.items[itemIndex].quantity = validQuantity;
    } else {
      // If the book does not exist, add it to the cart
      const validQuantity =
        quantity <= book.quantity ? quantity : book.quantity;
      cart.items.push({ bookId, quantity: validQuantity });
    }

    // Save the updated cart
    cart = await cart.save();
    return response(
      res,
      StatusCodes.OK,
      true,
      cart,
      "Item added to cart successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// Remove an item from the cart
const removeCartItem = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({
        userId,
        items: [{}],
      });
      newCart.save();

      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "User's cart created"
      );
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
      const updatedQuantity = cart.items[itemIndex].quantity - quantity;
      if (updatedQuantity > 0) {
        cart.items[itemIndex].quantity = updatedQuantity;
      } else if (updatedQuantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }

      // Save the updated cart
      cart = await cart.save();

      return response(
        res,
        StatusCodes.OK,
        true,
        cart,
        "Item removed from cart successfully"
      );
    } else {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Item not found in the cart"
      );
    }
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const deleteCartItem = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({
        userId,
        items: [{}],
      });
      newCart.save();

      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "User's cart created"
      );
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart = await cart.save();
      return response(
        res,
        StatusCodes.OK,
        true,
        cart,
        "Item deleted from cart successfully"
      );
    } else {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Item not found in the cart"
      );
    }
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const getCartByUserId = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  if (!userId) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "User ID is required"
    );
  }
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const items = [];
      const newCart = Cart.create({ userId: userId, items });
      return response(
        res,
        StatusCodes.CREATED,
        true,
        newCart,
        "Cart created successfully"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      cart,
      "Cart retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const updateCart = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  if (quantity < 0) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Quantity must be a positive integer"
    );
  }

  try {
    const book = await Book.findById(item.bookId);

    if (!book) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Book not found");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const validQuantity =
        quantity <= book.quantity ? quantity : book.quantity;

      const newCart = Cart.create({
        userId,
        items: [
          {
            bookId,
            quantity: validQuantity,
          },
        ],
      });
      return response(
        res,
        StatusCodes.CREATED,
        true,
        newCart,
        "Cart created successfully"
      );
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
      const validQuantity =
        quantity <= book.quantity ? quantity : book.quantity;
      cart.items[itemIndex].quantity = validQuantity;

      // If quantity becomes 0, remove the item from the cart
      if (cart.items[itemIndex].quantity === 0) {
        cart.items.splice(itemIndex, 1);
      }

      // Save the updated cart
      cart = await cart.save();

      return response(
        res,
        StatusCodes.OK,
        true,
        cart,
        "Item removed from cart successfully"
      );
    } else {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Item not found in the cart"
      );
    }
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const deleteCart = async (req, res) => {};

module.exports = {
  addCartItem,
  removeCartItem,
  deleteCartItem,
  getCartByUserId,
  updateCart,
  deleteCart,
};
