const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Book } = require("../../models/Book.model");
const { Category } = require("../../models/Category.model");

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

const getBooksOnCategories = async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "categoryId is required"
    );
  }

  try {
    // Bước 1: Tìm category mà bạn đã pass vào (có thể là Level 3)
    let category = await Category.findById(categoryId);
    if (!category) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Category not found"
      );
    }

    // Bước 2: Lấy các category cha (Level 2 và Level 1)
    const categoriesLevel2 = await Category.find({ parentId: categoryId });
    let categoriesId = [categoryId, ...categoriesLevel2.map((cat) => cat._id)];

    // Bước 3: Lấy category cha của category cha (Level 1)
    const categoriesLevel1 = await Category.find({
      parentId: { $in: categoriesId },
    });

    categoriesId = [
      ...categoriesId,
      ...categoriesLevel1.map((category) => category._id),
    ];

    // Bước 4: Tìm các sách có categoryId thuộc vào mảng categoriesId
    const books = await Book.find({
      categories: { $in: categoriesId }, // Sử dụng $in để tìm sách thuộc vào các categoryId
    });

    if (books.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "No books found in this category"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      books,
      "Books found successfully"
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
  const {
    skip,
    limit,
    sortBy,
    searchKey,
    price_low,
    price_high,
    costPrice_low,
    costPrice_high,
    isDeleted,
    categoryId,
  } = req.body;

  console.log(req.body);

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

    if (costPrice_low !== undefined && costPrice_high !== undefined) {
      filter.costPrice = {
        $gte: costPrice_low,
        $lte: costPrice_high,
      };
    }
    if (categoryId) {
      // Chuyển đổi categoryId thành ObjectId nếu cần
      const ObjectId = require("mongoose").Types.ObjectId;

      if (ObjectId.isValid(categoryId)) {
        filter.categories = new ObjectId(categoryId);
      } else {
        // Xử lý trường hợp categoryId không hợp lệ
        throw new Error("Invalid categoryId");
      }
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
  getBooksOnCategories,
};
