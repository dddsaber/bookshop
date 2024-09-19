const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Order } = require("../../models/Order.model");
const { Cart } = require("../../models/Cart.model");
const { ORDER_STATUS, PAYMENT_METHODS } = require("../../utils/constants");
const { Book } = require("../../models/Book.model");
const { Invoice } = require("../../models/Invoice.model");
const createOrder = async (req, res) => {
  const { userId, paymentMethod, orderDetails, ...objOrder } = req.body;

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (
    !userId ||
    !orderDetails ||
    orderDetails.length === 0 ||
    paymentMethod === undefined
  ) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Thiếu dữ liệu đơn hàng"
    );
  }

  try {
    const cart = await Cart.findOne({ userId });
    let books = [];
    let totalAmount = 0; // Tính tổng tiền sau khi đã kiểm tra

    // Duyệt qua danh sách chi tiết đơn hàng
    for (let i = 0; i < orderDetails.length; i++) {
      const book = await Book.findById(orderDetails[i].bookId);
      if (!book) {
        return response(
          res,
          StatusCodes.NOT_FOUND,
          false,
          {},
          `Không tìm thấy sách với ID ${orderDetails[i].bookId}`
        );
      }

      // Kiểm tra số lượng trong kho
      if (orderDetails[i].quantity > book.quantity) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          `Không đủ số lượng cho sách: ${book.name}`
        );
      }

      // Kiểm tra và cập nhật số lượng trong giỏ hàng
      const itemIndex = cart.items.findIndex(
        (item) => item.bookId.toString() === orderDetails[i].bookId.toString()
      );
      if (itemIndex === -1) {
        return response(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          {},
          "Không tìm thấy sách trong giỏ hàng"
        );
      }
      if (orderDetails[i].quantity > cart.items[itemIndex].quantity) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          `Không đủ số lượng sách trong giỏ hàng: ${book.name}`
        );
      }

      // Cập nhật số lượng trong giỏ hàng
      cart.items[itemIndex].quantity -= orderDetails[i].quantity;
      if (cart.items[itemIndex].quantity === 0) {
        cart.items.splice(itemIndex, 1);
      }

      // Tính tổng số tiền
      totalAmount += book.price * orderDetails[i].quantity;

      // Cập nhật số lượng sách sau khi tạo đơn hàng thành công
      book.quantity -= orderDetails[i].quantity;
      books.push(book);
    }

    // Tạo đơn hàng mới
    const newOrder = await Order.create({
      userId,
      orderDetails,
      paymentMethod,
      totalAmount,
      status: ORDER_STATUS.pending,
      ...objOrder,
    });

    if (!newOrder) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Không thể tạo đơn hàng"
      );
    }

    // Cập nhật số lượng sách vào cơ sở dữ liệu
    for (let i = 0; i < books.length; i++) {
      await books[i].save();
    }

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();

    // Trả về kết quả thành công
    return response(
      res,
      StatusCodes.CREATED,
      true,
      newOrder,
      "Đơn hàng được tạo thành công"
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

const cancelOrder = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra tính hợp lệ của orderId
  if (!orderId) {
    return response(res, StatusCodes.BAD_REQUEST, false, {}, "Thiếu order ID");
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Không tìm thấy đơn hàng"
      );
    }

    // Kiểm tra trạng thái đơn hàng trước khi huỷ
    if (order.status === ORDER_STATUS.cancelled) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Đơn hàng đã bị huỷ trước đó"
      );
    }

    // Cập nhật lại số lượng sách trong kho cho từng sản phẩm
    const updatedBooks = [];
    for (let i = 0; i < order.orderDetails.length; i++) {
      const book = await Book.findById(order.orderDetails[i].bookId);
      if (book) {
        // Cập nhật lại số lượng sách
        book.quantity += order.orderDetails[i].quantity;
        updatedBooks.push(book); // Lưu lại sách đã cập nhật để xử lý sau
      } else {
        return response(
          res,
          StatusCodes.NOT_FOUND,
          false,
          {},
          `Không tìm thấy sách với ID ${order.orderDetails[i].bookId}`
        );
      }
    }

    // Cập nhật trạng thái đơn hàng thành 'cancelled'
    order.status = ORDER_STATUS.cancelled;
    await order.save();

    // Lưu các thay đổi về số lượng sách trong cơ sở dữ liệu
    for (let i = 0; i < updatedBooks.length; i++) {
      await updatedBooks[i].save();
    }

    // Trả về kết quả thành công
    return response(
      res,
      StatusCodes.OK,
      true,
      order,
      "Huỷ đơn hàng thành công"
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

const getOrders = async (req, res) => {
  const { userId, status, paymentMethod, limit, sortBy, searchKey } = req.body;

  try {
    const total = await Order.countDocuments()
      .where(
        searchKey
          ? {
              $or: [{ customerNotes: { $regex: searchKey, options: "i" } }],
            }
          : null
      )
      .where(userId ? { userId } : null)
      .where(status ? { status } : null)
      .where(paymentMethod ? { paymentMethod } : null)
      .limit(limit ? { limit } : null)
      .sortBy(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 });

    const orders = await Order.find()
      .where(
        searchKey
          ? {
              $or: [{ customerNotes: { $regex: searchKey, options: "i" } }],
            }
          : null
      )
      .where(userId ? { userId } : null)
      .where(status ? { status } : null)
      .where(paymentMethod ? { paymentMethod } : null)
      .limit(limit ? { limit } : null)
      .sortBy(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .skip(skip ? { skip } : null);

    return response(
      res,
      StatusCodes.OK,
      true,
      { total: total, orders: orders },
      "Orders fetched successfully"
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

const getOrderDetail = async (req, res) => {
  const orderId = req.params.id;
  try {
    const newOrder = await Order.findById(orderId);
    if (!newOrder) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Order not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      newOrder,
      "Order fetched successfully"
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

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { order } = req.body;

  if (!order) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing order data"
    );
  }

  try {
    const newOrder = await Order.findByIdAndUpdate(orderId, order, {
      new: true,
    });

    if (!newOrder) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Order not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      newOrder,
      "Order updated successfully"
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

const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing order status"
    );
  }
  try {
    const newOrder = Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!newOrder) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Order not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      newOrder,
      "Order status updated successfully"
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

const deleteOrder = async (req, res) => {};

module.exports = {
  createOrder,
  cancelOrder,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
};
