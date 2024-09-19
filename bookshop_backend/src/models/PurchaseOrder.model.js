const mongoose = require("mongoose");

const purchaseOrderSchema = mongoose.Schema(
  {
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["credit_card", "paypal", "cod", "bank_transfer"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "cancelled"],
    },
    orderDetails: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Sửa thành 'timestamps' để thêm tự động createdAt và updatedAt
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = { PurchaseOrder };
