const { StatusCodes } = require("http-status-codes");
const { Author } = require("../../models/Author.model");
const { response } = require("../../utils/response");
const { User } = require("../../models/User.model");

// ----------------------------------------------------------------
// Create a new author record
// ----------------------------------------------------------------
const createAuthor = async (req, res) => {
  const { author } = req.body;
  if (!author.name) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing author name"
    );
  }

  try {
    const newAuthor = Author.create(author);

    if (!newAuthor) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create author"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      { author: newAuthor },
      "Author created successfully"
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

// ----------------------------------------------------------------
// Get users from database by searchKey
// ----------------------------------------------------------------
const getAllAuthors = async (req, res) => {
  const { limit, sortBy, searchKey, skip, isDeleted } = req.body;
  try {
    const total = await Author.countDocuments()
      .where(
        searchKey
          ? {
              $or: [
                { name: { $regex: searchKey, $options: "i" } },
                { description: { $regex: searchKey, $options: "i" } },
              ],
            }
          : null
      )
      .where(isDeleted ? { isDeleted } : null);

    const authors = await Author.find()
      .where(
        searchKey
          ? {
              $or: [
                { name: { $regex: searchKey, $options: "i" } },
                { description: { $regex: searchKey, $options: "i" } },
              ],
            }
          : null
      )
      .where(isDeleted ? { isDeleted } : null)
      .skip(skip ? skip : null)
      .limit(limit ? limit : null)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 });

    return response(
      res,
      StatusCodes.OK,
      true,
      { authors: authors, total: total },
      "Authors retrieved successfully"
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

// ----------------------------------------------------------------
// Get a author record by ID
// ----------------------------------------------------------------
const getAuthorById = async (req, res) => {
  const id = req.params.id;
  try {
    const author = await Author.findById(id);

    if (!author) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Author not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { author: author },
      "Author retrieved successfully"
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

const updateAuthor = async (req, res) => {
  const userId = req.params.id;
  const { author } = req.body;
  try {
    if (!author) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Missing author data"
      );
    }
    const updatedAuthor = await Author.findByIdAndUpdate(userId, author, {
      new: true,
    });

    if (!updatedAuthor) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Author can not updated"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { author: updatedAuthor },
      "Author updated successfully"
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
// ----------------------------------------------------------------
// Delete author from server (HARD)
// ----------------------------------------------------------------
const deleteAuthor = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    return response(res, StatusCodes.OK, true, {}, "User deleted successfully");
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

// ----------------------------------------------------------------
// Delete author from server (SOFT)
// ----------------------------------------------------------------

const softDeleteAuthor = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    return response(res, StatusCodes.OK, true, {}, "User deleted successfully");
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
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
