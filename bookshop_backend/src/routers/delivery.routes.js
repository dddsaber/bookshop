const { Router } = require("express");
const {
  createDelivery,
  updateDeliverStatus,
  getDeliverByOrderId,
  getDeliverById,
  deleteDelivery,
  getDeliveries,
} = require("../controllers/deliver/deliver.controller");

const router = Router();

router.post("/", createDelivery);

router.put("/update-status/:id", updateDeliverStatus);

router.get("/order/:id", getDeliverByOrderId);

router.get("/:id", getDeliverById);

router.delete("/delete/:id", deleteDelivery);

router.post("/get-deliveries", getDeliveries);

module.exports = router;
