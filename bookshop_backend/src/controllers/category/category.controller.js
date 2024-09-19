const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Category } = require("../../models/Category.model");

const createCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const newCategory = await Category.create({ category });

    if (!newCategory) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create category"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newCategory,
      "Category created successfully"
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

const getCategories = async (req, res) => {
  const { searchKey } = req.body;
  try {
    const total = await Category.countDocuments().where(
      searchKey
        ? {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { description: { $regex: searchKey, $options: "i" } },
            ],
          }
        : null
    );

    const categories = await Category.find().where(
      searchKey
        ? {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { description: { $regex: searchKey, $options: "i" } },
            ],
          }
        : null
    );

    return response(
      res,
      StatusCodes.OK,
      true,
      { total, categories },
      "Categories retrieved successfully"
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

const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Category not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      category,
      "Category retrieved successfully"
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

const updateCategory = async (req, res) => {
  const { category } = req.body;
  const categoryId = req.params.id;

  if (!category) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing category"
    );
  }

  try {
    const updatedCategory = Category.findByIdAndUpdate(
      categoryId,
      { category },
      { new: true }
    ).exec();

    if (!updatedCategory) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to update category"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updatedCategory,
      "Category updated successfully"
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

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Category not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      {},
      "Category deleted successfully"
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

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
