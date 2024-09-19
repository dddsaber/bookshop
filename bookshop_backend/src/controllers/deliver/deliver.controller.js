const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");
const { Delivery } = require("../../models/Delivery.model");
const { DELIVERY_STATUS } = require("../../utils/constants");

const createDelivery = async (req, res) => {
  const { orderId, location, shippingFee, deliveryDate, ...objDelivery } =
    req.body;

  if (!orderId || !location || !shippingFee || !deliveryDate) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing delivery data"
    );
  }

  try {
    const newDelivery = await Delivery.create({
      orderId,
      location,
      shippingFee,
      deliveryDate,
      predictedArrivedData: addDaysToDate(deliveryDate, 10),
      deliveryStatus: "pending",
      ...objDelivery,
    });

    if (!newDelivery) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create delivery"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newDelivery,
      "Delivery created successfully"
    );
  } catch (error) {
    console.error(error);
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error creating delivery"
    );
  }
};

const updateDeliverStatus = async (req, res) => {
  const deliveryId = req.params.id;
  const { deliveryStatus } = req.body;
  if (!deliveryStatus) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing delivery status"
    );
  }

  try {
    let delivery;
    if (
      deliveryStatus === DELIVERY_STATUS.processing ||
      deliveryStatus === DELIVERY_STATUS.cancelled
    ) {
      delivery = await Delivery.findByIdAndUpdate(
        deliveryId,
        { deliveryStatus },
        { new: true }
      );
    } else if (deliveryStatus === DELIVERY_STATUS.delivered) {
      delivery = await Delivery.findByIdAndUpdate(
        deliveryId,
        { deliveryStatus, arrivedDate: new Date() },
        { new: true }
      );
    } else {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Invalid delivery status"
      );
    }

    if (!delivery) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Delivery not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      delivery,
      "Delivery status updated successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error updating delivery status"
    );
  }
};

const getDeliverByOrderId = async (req, res) => {
  const orderId = req.params.id;

  try {
    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Delivery not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      delivery,
      "Delivery retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error retrieving deliveries by order ID"
    );
  }
};

const getDeliverById = async (req, res) => {
  const deliveryId = req.params.id;
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Delivery not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      delivery,
      "Delivery retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error retrieving delivery by ID"
    );
  }
};

const deleteDelivery = async (req, res) => {
  const deliveryId = req.params.id;

  try {
    const deletedDelivery = await Delivery.findByIdAndUpdate(deliveryId, {
      isDeleted: true,
    });

    if (!deletedDelivery) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Delivery not found"
      );
    }

    return response(
      res,
      StatusCodes.NO_CONTENT,
      true,
      {},
      "Delivery deleted successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error deleting delivery"
    );
  }
};

const getDeliveries = async (req, res) => {
  const {
    limit = 100,
    status,
    note,
    deliveryDateStart,
    deliveryDateEnd,
    arrivedDateStart,
    arrivedDateEnd,
    sortBy,
    searchKey,
  } = req.query;

  try {
    const deliveries = Delivery.find()
      .where(
        searchKey
          ? {
              $or: [
                { location: { $regex: searchKey, $options: "i" } },
                { deliveryNotes: { $regex: searchKey, $options: "i" } },
              ],
            }
          : null
      )
      .where(status ? { deliveryStatus: status } : null)
      .where(note ? { deliveryNotes: note } : null)
      .where(
        deliveryDateStart && deliveryDateEnd
          ? { deliveryDate: { $gte: deliveryDateStart, $lte: deliveryDateEnd } }
          : null
      )
      .where(
        arrivedDateStart && arrivedDateEnd
          ? { arrivedDate: { $gte: arrivedDateStart, $lte: arrivedDateEnd } }
          : null
      )
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .limit(limit);

    const total = deliveries.length;

    if (!deliveries) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "No delivery found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { deliveries, total },
      "Deliveries retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error retrieving deliveries"
    );
  }
};

module.exports = {
  createDelivery,
  updateDeliverStatus,
  getDeliverByOrderId,
  getDeliverById,
  deleteDelivery,
  getDeliveries,
};
