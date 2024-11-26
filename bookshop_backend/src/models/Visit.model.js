const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Kết nối tới collection users nếu cần
    default: null, // Nếu không có userId, gán là null (khách)
  },
  visitAt: {
    type: Date,
    default: Date.now, // Mặc định là thời gian hiện tại
  },
  pageVisited: {
    type: String,
    required: true, // URL của trang người dùng truy cập
  },
  action: {
    type: String,
    required: true, // Hành động thực hiện, ví dụ: 'view_product', 'add_to_cart'
  },
});

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
