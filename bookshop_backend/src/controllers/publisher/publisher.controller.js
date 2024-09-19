const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const { Publisher } = require("../../models/Publisher.model");

const createPublisher = async (req, res) => {
  const publisher = req.body;
  if (!publisher.name) {
    return response(res, StatusCodes.BAD_REQUEST, false, {}, "Missing name");
  }

  try {
    const newPublisher = await Publisher.create(publisher);

    if (!newPublisher) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create publisher"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newPublisher,
      "Publisher created successfully"
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

const updatePublisher = async (req, res) => {
  const publisherId = req.params.id;
  const publisher = req.body;

  if (!publisher) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing publisher data"
    );
  }

  try {
    const newPublisher = await Publisher.findByIdAndUpdate(
      publisherId,
      publisher,
      { new: true }
    );

    if (!newPublisher) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Publisher not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      newPublisher,
      "Publisher updated successfully"
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

const deletePublisher = async (req, res) => {
  const publisherId = req.params.id;
  try {
    const deletedPublisher = await Publisher.findByIdAndUpdate(publisherId, {
      isDeleted: true,
    });

    if (!deletedPublisher) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Publisher not found"
      );
    }

    return response(
      res,
      StatusCodes.NO_CONTENT,
      true,
      {},
      "Publisher deleted successfully"
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

const getPublishers = async (req, res) => {
  const { sortBy, address, searchKey, isDeleted } = req.params;

  try {
    const total = await Publisher.countDocuments()
      .where(
        searchKey
          ? {
              name: { $regex: searchKey, $options: "i" },
              address: { $regex: address, $options: "i" },
              description: { $regex: description, $options: "i" },
            }
          : null
      )
      .where(address ? { address } : null)
      .where(isDeleted ? { isDeleted } : null);

    const publishers = await Publisher.find()
      .where(
        searchKey
          ? {
              name: { $regex: searchKey, $options: "i" },
              address: { $regex: address, $options: "i" },
              description: { $regex: description, $options: "i" },
            }
          : null
      )
      .where(address ? { address } : null)
      .where(isDeleted ? { isDeleted } : null)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 });

    return response(
      res,
      StatusCodes.OK,
      true,
      {
        total,
        publishers,
      },
      "Publishers retrieved successfully"
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

const getPublisherById = async (req, res) => {
  const publisherId = req.params.id;
  try {
    const publisher = await Publisher.findById(publisherId);

    if (!publisher) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Publisher not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      publisher,
      "Publisher retrieved successfully"
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

module.exports = {
  createPublisher,
  updatePublisher,
  deletePublisher,
  getPublishers,
  getPublisherById,
};
