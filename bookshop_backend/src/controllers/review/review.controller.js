const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Review } = require("../../models/Review.model");

const createReview = async (req, res) => {
  const review = req.body;

  if (!review.userId || !review.bookId || !review.rating || !review.content) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing required fields"
    );
  }
  try {
    const newReview = await Review.create(review);

    if (!newReview) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create review"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newReview,
      "Review created successfully"
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
const getReviewsByBookId = async (req, res) => {
  const bookId = req.params.id;
  try {
    const reviews = await Review.find({ bookId, isDeleted: false })
      .populate("userId", "name") // Lấy thông tin `name` từ bảng User
      .exec();

    if (!reviews || reviews.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Reviews not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      reviews,
      "Reviews retrieved successfully"
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

const getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Review not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      review,
      "Review retrieved successfully"
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

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const updatedReview = req.body;
  console.log(reviewId, updatedReview);
  if (!updatedReview) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing required fields"
    );
  }

  try {
    const updateReview = await Review.findByIdAndUpdate(
      reviewId,
      updatedReview,
      { new: true }
    );

    if (!updateReview) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Review not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updateReview,
      "Review updated successfully"
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

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isDeleted: true },
      { new: true }
    );

    if (!review) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Review not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      review,
      "Review deleted successfully"
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
  createReview,
  getReviewsByBookId,
  getReviewById,
  updateReview,
  deleteReview,
};
