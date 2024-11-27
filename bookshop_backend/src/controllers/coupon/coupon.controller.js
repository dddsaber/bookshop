const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");
const Coupon = require("../../models/Coupon.model");

// Tạo mới coupon
const createCoupon = async (req, res) => {
  const { type, percent, flat, expiryDate } = req.body;
  if (!type || percent === null || flat === null) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing coupon data"
    );
  }

  try {
    const newCoupon = await Coupon.create({
      type,
      percent,
      flat,
      expiryDate: expiryDate,
    });

    if (!newCoupon) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create coupon"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newCoupon,
      "Coupon created successfully"
    );
  } catch (error) {
    console.error(error);
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error creating coupon"
    );
  }
};

// Cập nhật coupon
const updateCoupon = async (req, res) => {
  const couponId = req.params.id;
  const { type, percent, flat } = req.body;

  if (!type || !percent || !flat) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing coupon data"
    );
  }

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { type, percent, flat },
      { new: true }
    );

    if (!updatedCoupon) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Coupon not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updatedCoupon,
      "Coupon updated successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error updating coupon"
    );
  }
};

// Lấy coupon theo ID
const getCouponById = async (req, res) => {
  const couponId = req.params.id;

  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Coupon not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      coupon,
      "Coupon retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error retrieving coupon"
    );
  }
};

// Lấy danh sách coupon
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isDeleted: false });

    if (!coupons || coupons.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "No coupons found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      coupons,
      "Coupons retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      `${error.message}`
    );
  }
};

const getCouponsForManage = async (req, res) => {
  console.log("ok");

  try {
    const coupons = await Coupon.find();
    console.log("coupons");
    if (!coupons || coupons.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "No coupons found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      coupons,
      "Coupons retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      `${error.message}`
    );
  }
};

// Xóa coupon
const deleteCoupon = async (req, res) => {
  const couponId = req.params.id;
  console.log(couponId);
  try {
    const deletedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        isDeleted: true,
      },
      { new: true }
    );

    console.log(deletedCoupon);
    if (!deletedCoupon) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Coupon not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      {},
      "Coupon deleted successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error deleting coupon"
    );
  }
};

module.exports = {
  createCoupon,
  updateCoupon,
  getCouponById,
  getCoupons,
  deleteCoupon,
  getCouponsForManage,
};
