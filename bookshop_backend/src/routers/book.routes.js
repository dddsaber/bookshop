const { Router } = require("express");
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book/book.controller");

const router = Router();

router.post("/get-books", getBooks);

router.get("/:id", getBookById);

router.post("/", createBook);

router.put("/update/:id", updateBook);

router.put("/delete/:id", deleteBook);

module.exports = router;
