const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDetails: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        title: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
        },
      },
    ],
    address: {
      province: {
        type: String,
      },
      district: {
        type: String,
      },
      ward: {
        type: String,
      },
      detail: {
        type: String,
      },
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirm",
        "shipped",
        "delivered",
        "complete",
        "cancelled",
      ],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["credit_card", "paypal", "cod", "bank_transfer", "cash"],
    },
    customerNotes: {
      type: String,
    },
    cancelNote: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingFree: {
      type: Number,
      default: 0,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    statusTimestamps: {
      pending: { type: Date },
      confirm: { type: Date },
      delivered: { type: Date },
      shipped: { type: Date },
      complete: { type: Date },
      cancelled: { type: Date },
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  const currentStatus = this.status;
  if (!this.statusTimestamps[currentStatus]) {
    this.statusTimestamps[currentStatus] = new Date();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
