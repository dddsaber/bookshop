const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Book } = require("../../models/Book.model");

const createBook = async (req, res) => {
  const { book } = req.body;
  if (!book.title || !book.photos || !Array.isArray(book.photos)) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Title is required"
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
  const { skip, limit, sortBy, searchKey, price, isDeleted } = req.body;

  try {
    const total = await Book.countDocuments()
      .where(
        searchKey
          ? {
              $or: [
                {
                  title: { $regex: searchKey, options: "i" },
                },
                {
                  description: { $regex: searchKey, options: "i" },
                },
              ],
            }
          : null
      )
      .where(price ? { price: { $gt: price } } : null)
      .where(isDeleted ? { isDeleted: isDeleted } : { isDeleted: false });

    const books = await Book.find()
      .where(
        searchKey
          ? {
              $or: [
                {
                  title: { $regex: searchKey, options: "i" },
                },
                {
                  description: { $regex: searchKey, options: "i" },
                },
              ],
            }
          : null
      )
      .where(price ? { price: { $gt: price } } : null)
      .where(isDeleted ? { isDeleted: isDeleted } : { isDeleted: false })
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .skip(skip ? skip : null)
      .limit(limit ? limit : null);

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
  const { book } = req.body;

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
