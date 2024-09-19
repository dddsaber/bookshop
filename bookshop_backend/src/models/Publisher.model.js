const mongoose = require("mongoose");

const publisherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          unique: true,
          required: true,
        },
        isbn: {
          type: String,
          unique: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Publisher = mongoose.model("Publisher", publisherSchema);

module.exports = { Publisher };
