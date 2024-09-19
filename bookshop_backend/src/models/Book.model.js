const { mongoose } = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    costPrice: {
      type: Number,
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
    },
    ibsn: {
      type: String,
      unique: true,
    },
    authorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    discount: {
      type: Number,
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
