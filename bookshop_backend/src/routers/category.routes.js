const { Router } = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category/category.controller");

const router = new Router();

router.post("/", createCategory);

router.post("/get-categories", getCategories);

router.get("/:id", getCategoryById);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

module.exports = router;
