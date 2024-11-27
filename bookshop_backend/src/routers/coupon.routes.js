const { Router } = require("express");
const {
  createCoupon,
  updateCoupon,
  getCouponById,
  getCoupons,
  getCouponsForManage,
  deleteCoupon,
} = require("../controllers/coupon/coupon.controller");

const router = Router();

router.post("/", createCoupon);

router.get("/:id", getCouponById);

router.get("/", getCoupons);

router.get("/manage/get", getCouponsForManage);

router.put("/:id", updateCoupon);

router.put("/delete/:id", deleteCoupon);

module.exports = router;
