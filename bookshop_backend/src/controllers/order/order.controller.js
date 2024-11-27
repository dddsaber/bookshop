const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Order } = require("../../models/Order.model");
const { Cart } = require("../../models/Cart.model");
const {
  ORDER_STATUS,
  PAYMENT_METHODS,
  STATUS_MAP,
} = require("../../utils/constants");
const { Book } = require("../../models/Book.model");
const { Invoice } = require("../../models/Invoice.model");
const Visit = require("../../models/Visit.model");
const Coupon = require("../../models/Coupon.model");
const createOrder = async (req, res) => {
  const {
    userId,
    paymentMethod,
    orderDetails,
    shippingFee,
    address,
    couponId,
    ...objOrder
  } = req.body;

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (
    !userId ||
    !orderDetails ||
    orderDetails.length === 0 ||
    !address ||
    !paymentMethod
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
      console.log(orderDetails[i]);
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
      totalAmount +=
        book.price * orderDetails[i].quantity * (1 - orderDetails[i].discount);

      // Cập nhật số lượng sách sau khi tạo đơn hàng thành công
      book.quantity -= orderDetails[i].quantity;
      books.push(book);
    }

    if (couponId) {
      const coupon = await Coupon.findById(couponId);
      if (!coupon || coupon.isDeleted) {
        return response(
          res,
          StatusCodes.NOT_FOUND,
          false,
          {},
          "Mã coupon không tồn tại"
        );
      }
      if (coupon.expiryDate < new Date()) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Mã coupon đã hết hạn"
        );
      }
      if (coupon.percent) {
        totalAmount = totalAmount * (1 - coupon.percent / 100);
      }
      if (coupon.flat) {
        totalAmount = totalAmount - coupon.flat;
        if (totalAmount < 0) {
          totalAmount = 0;
        }
      }
    }

    totalAmount += shippingFee ? shippingFee : 0;

    // Tạo đơn hàng mới
    const newOrder = await Order.create({
      userId,
      orderDetails,
      paymentMethod,
      totalAmount,
      shippingFee: shippingFee,
      address,
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
  const { cancelNote } = req.body;

  // Kiểm tra tính hợp lệ của orderId
  if (!id) {
    return response(res, StatusCodes.BAD_REQUEST, false, {}, "Thiếu order ID");
  }

  try {
    const order = await Order.findById(id);

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
    order.cancelNote = cancelNote;
    order.isNotice = true;
    order.notice = `Đơn hàng ${order._id} đã bị hủy với lí do: ${order.cancelNote}`;
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
  const { userId, status, paymentMethod, limit, sortBy, searchKey, skip } =
    req.body;
  try {
    // Tính tổng số đơn hàng
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
      .limit(limit ? limit : null)
      .sort(sortBy ? { [sortBy.field]: sortBy.order } : { createdAt: -1 });

    // Lấy danh sách đơn hàng với thông tin user.name
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
      .limit(limit ? limit : null)
      .skip(skip ? skip : null)
      .sort(sortBy ? { [sortBy.field]: sortBy.order } : { createdAt: -1 })
      .populate({
        path: "userId", // Liên kết với trường userId trong bảng Order
        select: "name", // Chỉ lấy trường name của người dùng
      });

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
    // Sử dụng await để đợi kết quả
    const updateOrder = await Order.findById(orderId);

    if (updateOrder.status !== ORDER_STATUS.cancelled) {
      updateOrder.status = status;
    }
    updateOrder.isNotice = true;
    updateOrder.notice = `Đơn hàng ${orderId} đã thay đổi trạng thái thành ${STATUS_MAP[status].label}`;
    await updateOrder.save();

    if (!updateOrder) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Order not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updateOrder,
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

const getOrderStats = async (req, res) => {
  try {
    // Danh sách tất cả trạng thái đơn hàng
    const allStatuses = [
      "pending",
      "confirm",
      "shipped",
      "delivered",
      "complete",
      "cancelled",
    ];

    // Lấy dữ liệu thống kê từ MongoDB
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Chuẩn hóa kết quả để đảm bảo tất cả trạng thái đều xuất hiện
    const normalizedStats = allStatuses.map((status) => {
      const stat = stats.find((item) => item._id === status);
      return {
        status,
        count: stat ? stat.count : 0, // Gán giá trị 0 nếu không tồn tại
      };
    });

    return response(
      res,
      StatusCodes.OK,
      true,
      normalizedStats,
      "Order stats fetched successfully"
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

const getRevenueByDay = async (req, res) => {
  try {
    const { year, month } = req.body; // Năm và tháng được truyền từ client

    // Kiểm tra nếu không có năm và tháng được cung cấp
    if (!year || !month) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Missing year or month parameter"
      );
    }

    // Lấy ngày đầu tiên và cuối cùng trong tháng
    const startOfMonth = new Date(
      `${year}-${month < 10 ? "0" + month : month}-01`
    );
    const endOfMonth = new Date(
      `${year}-${month < 10 ? "0" + month : month}-01`
    );
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Chuyển đến tháng tiếp theo và trừ 1 giây để lấy hết ngày trong tháng

    // Lấy doanh thu theo ngày trong tháng
    const revenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ["complete", "delivered"] }, // Chỉ lấy đơn hàng hợp lệ
          createdAt: {
            $gte: startOfMonth, // Từ đầu tháng
            $lt: endOfMonth, // Đến cuối tháng
          },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" } }, // Nhóm theo ngày trong tháng
          totalRevenue: { $sum: { $multiply: ["$totalAmount", 0.9] } },
          orderCount: { $sum: 1 }, // Số lượng đơn hàng
        },
      },
      { $sort: { "_id.day": 1 } }, // Sắp xếp theo ngày
    ]);

    // Đảm bảo trả về đủ 31 ngày (kể cả ngày không có dữ liệu)
    const dailyData = Array.from({ length: 31 }, (_, index) => {
      const day = index + 1;
      const data = revenue.find((item) => item._id.day === day);
      return {
        day,
        totalRevenue: data ? data.totalRevenue : 0,
        orderCount: data ? data.orderCount : 0,
      };
    });

    return response(
      res,
      StatusCodes.OK,
      true,
      dailyData,
      "Revenue by day fetched successfully"
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

const getRevenueByMonth = async (req, res) => {
  try {
    const { year } = req.body; // Năm được truyền từ client

    // Kiểm tra nếu không có năm được cung cấp
    if (!year) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Missing year parameter"
      );
    }

    const revenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ["complete", "delivered"] }, // Chỉ lấy đơn hàng hợp lệ
          createdAt: {
            $gte: new Date(`${year}-01-01`), // Từ đầu năm
            $lt: new Date(`${parseInt(year) + 1}-01-01`), // Đến cuối năm
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } }, // Nhóm theo tháng
          totalRevenue: { $sum: { $multiply: ["$totalAmount", 0.9] } },
          orderCount: { $sum: 1 }, // Số lượng đơn hàng
        },
      },
      { $sort: { "_id.month": 1 } }, // Sắp xếp theo tháng
    ]);

    // Đảm bảo trả về đủ 12 tháng (kể cả tháng không có dữ liệu)
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const data = revenue.find((item) => item._id.month === month);
      return {
        month,
        totalRevenue: data ? data.totalRevenue : 0,
        orderCount: data ? data.orderCount : 0,
      };
    });

    return response(
      res,
      StatusCodes.OK,
      true,
      monthlyData,
      "Revenue by month fetched successfully"
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

const getRevenueByYear = async (req, res) => {
  try {
    const { years } = req.body;

    if (!years || typeof years !== "number" || years <= 0) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Missing years parameter or it's not a positive number"
      );
    }

    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
    const startYear = currentYear - years + 1; // Tính năm bắt đầu (năm hiện tại - số năm + 1)

    const revenue = await Order.aggregate([
      {
        $match: {
          status: { $in: ["complete", "delivered"] }, // Chỉ lấy các đơn hàng hợp lệ
          createdAt: {
            $gte: new Date(`${startYear}-01-01`), // Lấy từ đầu năm bắt đầu
            $lt: new Date(`${currentYear + 1}-01-01`), // Đến hết năm hiện tại
          },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } }, // Nhóm theo năm
          totalRevenue: { $sum: { $multiply: ["$totalAmount", 0.9] } },
          orderCount: { $sum: 1 }, // Số lượng đơn hàng trong năm
        },
      },
      { $sort: { "_id.year": 1 } }, // Sắp xếp theo năm tăng dần
    ]);

    // Xử lý thêm các năm không có doanh thu
    const fullYears = Array.from({ length: years }, (_, i) => startYear + i); // Danh sách các năm từ startYear đến currentYear
    const revenueWithMissingYears = fullYears.map((year) => {
      const existing = revenue.find((r) => r._id.year === year);
      return existing || { _id: { year }, totalRevenue: 0, orderCount: 0 };
    });

    return response(
      res,
      StatusCodes.OK,
      true,
      revenueWithMissingYears,
      "Revenue by year fetched successfully"
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

const calculateMonthlyConversionRate = async (req, res) => {
  const { year } = req.body;
  if (!year) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing year parameter"
    );
  }
  try {
    // Khởi tạo mảng để lưu tỷ lệ mua hàng cho từng tháng (12 tháng)
    const monthlyConversionRates = [];

    // Lặp qua từng tháng trong năm
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
      const endDate = new Date(year, month, 0); // Ngày cuối tháng

      // Lấy số lượt thêm sản phẩm vào giỏ hàng trong tháng
      const cartVisits = await Visit.find({
        pageVisited: "/cart/add-item", // URL cho việc thêm sản phẩm vào giỏ hàng
        visitAt: { $gte: startDate, $lt: endDate },
      });

      const cartVisitCount = cartVisits.length; // Tổng số lượt thêm sản phẩm vào giỏ hàng

      // Lấy số đơn hàng thành công trong tháng
      const completedOrders = await Order.find({
        status: { $in: ["complete", "delivered"] }, // Trạng thái đơn hàng thành công
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const completedOrderCount = completedOrders.length; // Tổng số đơn hàng thành công

      // Tính tỷ lệ mua hàng (conversion rate) cho tháng này
      const conversionRate =
        cartVisitCount === 0 ? 0 : (completedOrderCount / cartVisitCount) * 100;

      // Lưu kết quả cho tháng này
      monthlyConversionRates.push({
        month,
        cartVisitCount,
        completedOrderCount,
        conversionRate: conversionRate.toFixed(2), // Làm tròn tỷ lệ mua hàng đến 2 chữ số thập phân
      });
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      monthlyConversionRates,
      "Conversion rates by month fetched successfully"
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

const getTopSellingBooks = async (req, res) => {
  try {
    const limit = parseInt(req.params.id, 10) || 10;

    const topBooks = await Order.aggregate([
      { $unwind: "$orderDetails" },
      {
        $group: {
          _id: "$orderDetails.bookId",
          totalSold: { $sum: "$orderDetails.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: "$bookDetails.title",
          totalSold: 1,
        },
      },
    ]);

    return response(
      res,
      StatusCodes.OK,
      true,
      topBooks,
      "Top selling books fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching top selling books:", error);
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error fetching top selling books"
    );
  }
};

const getOrdersByUserId = async (req, res) => {
  const { id } = req.params; // Lấy userId từ req.params.id
  const { status, isNotice, paymentMethod, limit, sortBy, searchKey, skip } =
    req.body;

  try {
    const orders = await Order.find()
      .where(
        searchKey
          ? {
              $or: [{ customerNotes: { $regex: searchKey, options: "i" } }],
            }
          : null
      )
      .where({ userId: id }) // Lọc theo userId từ params
      .where(status ? { status } : null)
      .where(paymentMethod ? { paymentMethod } : null)
      .where(isNotice ? { isNotice } : null)
      .limit(limit ? limit : null)
      .skip(skip ? skip : null)
      .sort(sortBy ? { [sortBy.field]: sortBy.order } : { createdAt: -1 })
      .populate({
        path: "userId", // Liên kết với trường userId trong bảng Order
        select: "name", // Chỉ lấy trường name của người dùng
      })
      .populate({
        path: "orderDetails.bookId", // Populated từ bookId trong orderDetails
        select: "coverPhoto", // Chọn các trường cần thiết từ sách (ví dụ: title, author, price)
      });
    return response(
      res,
      StatusCodes.OK,
      true,
      { orders },
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

const turnOffNotice = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isNotice: false },
      { new: true }
    );
    if (!order) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Order not found");
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      { order },
      "Order notice turned off successfully"
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

module.exports = {
  createOrder,
  cancelOrder,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  updateOrder,
  getOrderStats,
  getRevenueByDay,
  getRevenueByMonth,
  getRevenueByYear,
  calculateMonthlyConversionRate,
  getTopSellingBooks,
  getOrdersByUserId,
  turnOffNotice,
};
