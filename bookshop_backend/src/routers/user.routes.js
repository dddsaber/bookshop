const { Router } = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  softDeleteUser,
  updateStatus,
} = require("../controllers/user/user.controller");
const { isUser, isAdmin } = require("../utils/protected");
const { userValidation } = require("../controllers/user/user.validator");

const router = Router();

router.post("/get-users", getUsers);

router.get("/:id", getUserById);

router.post("/", isAdmin, userValidation, createUser);

router.put("/update/:id", isUser, updateUser);

router.delete("/delete/:id", isAdmin, deleteUser);

router.put("/delete/:id", isAdmin, softDeleteUser);

router.put("/update-status/:id", isAdmin, updateStatus);

module.exports = router;
