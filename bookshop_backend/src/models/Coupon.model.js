const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  percent: {
    type: Number,
    required: true,
    default: 0,
  },
  flat: {
    type: Number,
    required: true,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
