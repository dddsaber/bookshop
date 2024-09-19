const { Router } = require("express");
const {
  createReview,
  getReviewsByBookId,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/review/review.controller");

const router = new Router();

router.post("/", createReview);

router.get("/book/:id", getReviewsByBookId);

router.get("/:id", getReviewById);

router.put("/update/:id", updateReview);

router.put("/delete/:id", deleteReview);

module.exports = router;
