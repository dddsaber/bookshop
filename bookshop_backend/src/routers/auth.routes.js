const { Router } = require("express");
const {
  register,
  login,
  reAuth,
  changePassword,
  resetPassword,
  forgotPassword,
  changePasswordOnConfirm,
} = require("../controllers/auth/auth.controller");
const { authValidation } = require("../controllers/auth/auth.validator");
const router = Router();

router.post("/register", authValidation, register);
router.post("/login", login);
router.post("/reauth", reAuth);
router.post("/change-password", changePassword);
router.post("/reset-password", resetPassword);

router.post("/forgot-password", forgotPassword);

router.post("/change-password-on-confirm", changePasswordOnConfirm);

module.exports = router;
