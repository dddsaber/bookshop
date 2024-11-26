const { Router } = require("express");
const {
  createCoupon,
  updateCoupon,
  getCouponById,
  getCoupons,
  deleteCoupon,
} = require("../controllers/coupon/coupon.controller");

const router = Router();

router.post("/", createCoupon);

router.get("/:id", getCouponById);

router.get("/", getCoupons);

router.put("/:id", updateCoupon);

router.put("/delete/:id", deleteCoupon);

module.exports = router;
