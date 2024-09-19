const { Router } = require("express");
const {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/author/author.controller");

const router = Router();

router.post("/", createAuthor);

router.post("/get-authors", getAllAuthors);

router.get("/:id", getAuthorById);

router.put("/update/:id", updateAuthor);

router.delete("/delete/:id", deleteAuthor);

module.exports = router;
