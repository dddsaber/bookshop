const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Cart } = require("../../models/Cart.model");
const { Book } = require("../../models/Book.model");
// Add an item to the cart
const addCartItem = async (req, res) => {
  const { userId, bookId, quantity } = req.body;
  if (quantity <= 0) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Quantity must be a positive integer"
    );
  }

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

      if (validQuantity <= 0) {
        return response(
          res,
          StatusCodes.NOT_ACCEPTABLE,
          false,
          {},
          "Sản phẩm hiện không khả dụng."
        );
      }
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
      if (cart.items[itemIndex].quantity == book.quantity) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Số lượng sản phẩm đã đạt tối đa."
        );
      }
      const validQuantity =
        cart.items[itemIndex].quantity + quantity <= book.quantity
          ? cart.items[itemIndex].quantity + quantity
          : book.quantity;

      if (validQuantity <= 0) {
        return response(
          res,
          StatusCodes.NOT_ACCEPTABLE,
          false,
          {},
          "Sản phẩm hiện không khả dụng."
        );
      }
      cart.items[itemIndex].quantity = validQuantity;
    } else {
      // If the book does not exist, add it to the cart
      const validQuantity =
        quantity <= book.quantity ? quantity : book.quantity;
      if (validQuantity <= 0) {
        return response(
          res,
          StatusCodes.NOT_ACCEPTABLE,
          false,
          {},
          "Sản phẩm hiện không khả dụng."
        );
      }
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
  const { userId, bookId } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({
        userId,
        items: [], // Khởi tạo mảng items là rỗng
      });
      await newCart.save(); // Đảm bảo lưu cart mới

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
      cart.items.splice(itemIndex, 1);
      await cart.save(); // Lưu cart đã cập nhật

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

  // Kiểm tra userId
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
    // Tìm kiếm giỏ hàng của user
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.bookId",
      model: "Book",
    });

    // Nếu không tìm thấy giỏ hàng, tạo mới
    if (!cart) {
      const items = [];
      const newCart = await Cart.create({ userId, items });
      return response(
        res,
        StatusCodes.CREATED,
        true,
        newCart,
        "Cart created successfully"
      );
    }

    // Kiểm tra từng mục sách trong giỏ hàng
    const validItems = []; // Danh sách các mục sách hợp lệ
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];

      // Kiểm tra sách tồn tại và chưa bị xóa
      const book = await Book.findOne({
        _id: item.bookId._id,
        isDeleted: false,
      });
      if (!book) {
        // Nếu sách không tồn tại, loại bỏ khỏi giỏ hàng
        continue;
      }

      // Điều chỉnh số lượng nếu lớn hơn số lượng hiện có
      if (item.quantity > book.quantity) {
        item.quantity = book.quantity;
      }

      // Thêm vào danh sách hợp lệ
      validItems.push(item);
    }

    // Cập nhật lại giỏ hàng với danh sách sách hợp lệ
    cart.items = validItems;
    await cart.save();

    // Định dạng các mục trong giỏ hàng trước khi trả về
    const formattedItems = cart.items.map((item) => ({
      _id: item.bookId._id, // bookId từ đối tượng book
      title: item.bookId.title,
      price: item.bookId.price,
      discount: item.bookId.discount,
      image: item.bookId.coverPhoto,
      quantity: item.quantity, // quantity từ giỏ hàng
    }));

    // Trả về kết quả
    return response(
      res,
      StatusCodes.OK,
      true,
      {
        _id: cart._id,
        userId: cart.userId,
        items: formattedItems,
      },
      "Cart retrieved successfully"
    );
  } catch (error) {
    // Xử lý lỗi
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
    const book = await Book.findById(bookId);

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
      await cart.save();

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
