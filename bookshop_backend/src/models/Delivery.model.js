const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 0,
    min: 0, // Đảm bảo phí vận chuyển không âm
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  predictedArrivedDate: {
    type: Date,
    required: true,
  },
  arrivedDate: {
    type: Date,
    default: null, // Ngày đến có thể không có ngay từ đầu
  },
  deliveryStatus: {
    type: String,
    enum: ["pending", "processing", "delivered", "cancelled"],
    default: "pending",
  },
  deliveryNotes: {
    type: String,
    default: "", // Có thể để trống nếu không có ghi chú
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true, // Kiểm tra xem đơn hàng đã xóa hay chưa
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
