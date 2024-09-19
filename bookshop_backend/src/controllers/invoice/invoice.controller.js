const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Invoice } = require("../../models/Invoice.model");
const { TAX_RATE_VAC } = require("../../utils/constants");

// ----------------------------------------------------------------
// Create a new Invoice
// ----------------------------------------------------------------
const createInvoice = async (req, res) => {
  const { orderId, invoiceDate, totalAmount, paymentStatus, paymentDetails } =
    req.body;
  if (!orderId || !totalAmount || !paymentStatus) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing required fields"
    );
  }

  invoiceDate = new Date();

  try {
    const newInvoice = await Invoice.create({
      orderId,
      invoiceDate,
      totalAmount,
      taxAmount: totalAmount * TAX_RATE_VAC,
      paymentStatus,
      paymentDetails,
    });

    if (!newInvoice) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create invoice"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newInvoice,
      "Invoice created successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Get a invoice by its ID
// ----------------------------------------------------------------
const getInvoiceById = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invoice not found"
      );
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      invoice,
      "Invoice fetched successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Update a invoice's payment status
// ----------------------------------------------------------------
const updateInvoicePaymentStatus = async (req, res) => {
  const invoiceId = req.params.id;
  const { paymentStatus } = req.body;
  if (!paymentStatus) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing required fields"
    );
  }
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { paymentStatus },
      { new: true }
    );
    if (!updatedInvoice) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invoice not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updatedInvoice,
      "Payment status updated successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Get a invoice by its order ID
// ----------------------------------------------------------------
const getInvoiceByOrderId = async (req, res) => {
  const orderId = req.params.id;
  try {
    const invoice = await Invoice.findOne({ orderId });

    if (!invoice) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invoice not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      invoice,
      "Invoice fetched successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Get invoices by its user's ID
// ----------------------------------------------------------------
const getInvoiceByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    const invoices = await Invoice.find().populate({
      path: "orderId",
      match: { userId: userId },
    });

    if (!invoices) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invoices not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      invoices,
      "Invoices fetched successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Get Invoices for a month or a year
// ----------------------------------------------------------------
const getInvoiceByMonthOrYear = async (req, res) => {
  const { month, year } = req.body;

  // Validate the year
  const currentYear = new Date().getFullYear();
  if (!year || year > currentYear) {
    return response(res, StatusCodes.BAD_REQUEST, false, {}, "Invalid year");
  }

  let startOfPeriod, endOfPeriod;

  if (month) {
    // If a month is provided, validate the month
    if (month < 1 || month > 12) {
      return response(res, StatusCodes.BAD_REQUEST, false, {}, "Invalid month");
    }

    const currentMonth = month - 1; // JavaScript uses 0-based months
    // Set the start date as the 1st of the provided month
    startOfPeriod = new Date(year, currentMonth, 1);
    // Set the end date as the 1st of the next month
    endOfPeriod = new Date(year, currentMonth + 1, 1);
  } else {
    // If no month is provided, fetch data for the entire year
    // Start from January 1st of the given year
    startOfPeriod = new Date(year, 0, 1);
    // End at January 1st of the next year
    endOfPeriod = new Date(year + 1, 0, 1);
  }

  try {
    // Aggregate invoices and calculate total amount and tax in a single query
    const result = await Invoice.aggregate([
      {
        $match: {
          date: {
            $gte: startOfPeriod,
            $lt: endOfPeriod,
          },
        },
      },
      {
        $group: {
          _id: null, // No specific grouping, just summing up
          invoices: { $push: "$$ROOT" }, // Push all invoice documents to an array
          totalAmount: { $sum: "$totalAmount" }, // Sum of totalAmount field
          totalTaxAmount: { $sum: "$taxAmount" }, // Sum of taxAmount field
        },
      },
    ]);

    // Extract results from the aggregation
    const invoices = result[0] ? result[0].invoices : [];
    const totalAmount = result[0] ? result[0].totalAmount : 0;
    const totalTaxAmount = result[0] ? result[0].totalTaxAmount : 0;

    // Return the result with invoices and total amounts
    return response(
      res,
      StatusCodes.OK,
      true,
      {
        invoices: invoices,
        totalAmount: totalAmount,
        totalTaxAmount: totalTaxAmount,
      },
      "Invoices fetched successfully"
    );
  } catch (error) {
    // Handle errors
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Update a invoice ? Not in use yet
// ----------------------------------------------------------------
const updateInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  const { invoice } = req.body;
  // Chua xu ly kiem tra loi
  if (!invoice) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing invoice data"
    );
  }
  try {
    const updatedInvoide = await findByIdAndUpdate(invoiceId, invoice, {
      new: true,
    });
    if (!updatedInvoide) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invoice not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updatedInvoide,
      "Invoice updated successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Delete a invoice - turn it "isDeleted" field on
// ----------------------------------------------------------------
const deleteInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const deletedInvoice = await Invoice.findByIdAndUpdate(invoiceId, {
      isDeleted: true,
    });
    if (!deletedInvoice) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invoice not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      deletedInvoice,
      "Invoice deleted successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

// ----------------------------------------------------------------
// Export functions
// ----------------------------------------------------------------

module.exports = {
  createInvoice,
  getInvoiceById,
  updateInvoicePaymentStatus,
  getInvoiceByOrderId,
  getInvoiceByUserId,
  getInvoiceByMonthOrYear,
  updateInvoice,
  deleteInvoice,
};
