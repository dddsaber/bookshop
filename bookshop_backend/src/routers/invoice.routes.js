const { Router } = require("express");
const {
  createInvoice,
  getInvoiceById,
  updateInvoicePaymentStatus,
  getInvoiceByOrderId,
  getInvoiceByUserId,
  getInvoiceByMonthOrYear,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoice/invoice.controller");

const router = Router();

router.post("/", createInvoice);

router.get("/:id", getInvoiceById);

router.put("/update-payment-status/:id", updateInvoicePaymentStatus);

router.get("/order/:id", getInvoiceByOrderId);

router.get("/user/:id", getInvoiceByUserId);

router.post("/invoices-per-time", getInvoiceByMonthOrYear);

router.put("/update/:id", updateInvoice);

router.put("/delete/:id", deleteInvoice);

module.exports = router;
