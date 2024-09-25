const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Book } = require("../../models/Book.model");

const createBook = async (req, res) => {
  const book = req.body;

  if (!book.title || !book.photos || !Array.isArray(book.photos)) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Title is required/Photos is required"
    );
  }
  try {
    const newBook = await Book.create(book);

    if (!newBook) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create book"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newBook,
      "Book created successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const getBooks = async (req, res) => {
  const { skip, limit, sortBy, searchKey, price_low, price_high, isDeleted } =
    req.body;

  try {
    // Tạo đối tượng filter để chứa các điều kiện lọc
    let filter = {};

    // Thêm điều kiện tìm kiếm theo title hoặc description nếu có searchKey
    if (searchKey) {
      filter.$or = [
        { title: { $regex: searchKey, $options: "i" } },
        { description: { $regex: searchKey, $options: "i" } },
      ];
    }

    // Thêm điều kiện lọc theo giá nếu có giá trị price_low và price_high
    if (price_low !== undefined && price_high !== undefined) {
      filter.price = {
        $gte: price_low,
        $lte: price_high,
      };
    }

    // Thêm điều kiện isDeleted
    filter.isDeleted = isDeleted !== undefined ? isDeleted : false;

    // Đếm tổng số lượng sách thỏa mãn điều kiện
    const total = await Book.countDocuments(filter);

    // Lấy danh sách các sách thỏa mãn điều kiện
    const books = await Book.find(filter)
      .sort(sortBy ? { [sortBy.field]: sortBy.order } : { createdAt: -1 })
      .skip(skip || 0) // Đặt giá trị mặc định là 0 nếu không có skip
      .limit(limit || 100) // Đặt giá trị mặc định là 10 nếu không có limit
      .populate({
        path: "categories",
        select: "name description _id parentId", // Lấy cả name và description của category
      })
      .populate({
        path: "authors",
        select: "name _id", // Lấy cả name và description của author
      })
      .exec();

    return response(
      res,
      StatusCodes.OK,
      true,
      { total, books },
      "Books fetched successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const getBookById = async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Book not found");
    }

    return response(res, StatusCodes.OK, true, book, "Book found successfully");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const book = req.body;

  if (!book) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Book data is required"
    );
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, book, {
      new: true,
    });
    if (!updatedBook) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Book not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updatedBook,
      "Book updated successfully"
    );
  } catch (errors) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { errors },
      "Failed to update book"
    );
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findByIdAndUpdate(bookId, {
      isDeleted: true,
    });

    if (!book) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Book not found");
    }

    return response(res, StatusCodes.OK, true, {}, "Book deleted successfully");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
