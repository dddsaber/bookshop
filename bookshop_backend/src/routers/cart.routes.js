const { Router } = require("express");
const {
  addCartItem,
  removeCartItem,
  deleteCartItem,
  getCartByUserId,
  updateCart,
  deleteCart,
} = require("../controllers/cart/cart.controller");

const router = new Router();

router.put("/add-item", addCartItem);

router.put("/remove-item", removeCartItem);

router.put("delete-item", deleteCartItem);

router.get("/:id", getCartByUserId);

router.put("/update", updateCart);

router.delete("/delete/:id", deleteCart);

module.exports = router;
