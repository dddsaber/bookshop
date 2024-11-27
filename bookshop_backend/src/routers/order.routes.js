const { Router } = require("express");
const {
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
} = require("../controllers/order/order.controller");

const router = Router();

router.post("/", createOrder);

router.post("/get-orders", getOrders);

router.get("/:id", getOrderDetail);

router.put("/update-status/:id", updateOrderStatus);

router.put("/cancel-order/:id", cancelOrder);

router.put("/update/:id", updateOrder);

router.put("/turn-off-notice/:id", turnOffNotice);

router.post("/stats", getOrderStats);

router.post("/revenue/day", getRevenueByDay);

router.post("/revenue/month", getRevenueByMonth);

router.post("/revenue/year", getRevenueByYear);

router.post("/conversion-rate", calculateMonthlyConversionRate);

router.post("/top-selling-books/:id", getTopSellingBooks);

router.post("/orders-by-user/:id", getOrdersByUserId);

module.exports = router;
