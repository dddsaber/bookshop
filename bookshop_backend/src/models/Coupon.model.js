const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    type: {
      type: String,
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
    expiryDate: {
      type: Date,
      required: true,
      default: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
