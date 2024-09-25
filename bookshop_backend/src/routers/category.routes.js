const { Router } = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getLeafCategories,
  getCategoriesOnParentId,
  getCategoriesOnIds,
} = require("../controllers/category/category.controller");

const router = new Router();

router.post("/", createCategory);

router.post("/get-categories", getCategories);

router.get("/:id", getCategoryById);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

router.get("/leaf-categories", getLeafCategories);

router.post("/get-on-parent-id", getCategoriesOnParentId);

router.post("/get-categories-on-ids", getCategoriesOnIds);
module.exports = router;
