const { mongoose } = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
      default: "default.png",
    },
    photos: {
      type: [String],
      required: true,
    },
    costPrice: {
      type: Number,
    },
    ibsn: {
      type: String,
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
    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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
    language: {
      type: [String],
    },
    weight: {
      type: Number,
    },
    pages: {
      type: Number,
    },
    format: {
      type: [String],
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    ageRange: {
      type: String,
    },
    publishYear: {
      type: Date,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
