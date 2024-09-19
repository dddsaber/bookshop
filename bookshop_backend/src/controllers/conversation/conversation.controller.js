const { StatusCodes } = require("http-status-codes");
const { Conversation } = require("../../models/Conversation.model");
const { response } = require("../../utils/response");
const dayjs = require("dayjs");
const { request } = require("express");

const createConversation = async (req, res) => {
  const { name = "", participants, lastMessage = "" } = req.body;

  try {
    const newConversation = await Conversation.create({
      name,
      participants,
      lastMessage,
    });
    if (!newConversation) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to create conversation"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newConversation.toObject(),
      "Conversation created successfully"
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

const getConversationById = async (req, res) => {
  const { id } = req.params.id;

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Conversation not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      conversation,
      "Conversation retrieved successfully"
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

const getConversationByUserId = async (req, res) => {
  const { userId } = req.body;
  try {
    const conversation = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "name avatar email phone",
      })
      .sort({
        updatedAt: -1,
      });

    if (!conversation) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Conversation not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      conversation,
      "Conversations retrieved successfully"
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

const updateConversation = async (id, lastMessage) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      {
        lastMessage,
      },
      { new: true }
    );

    if (!conversation) {
      return null;
    }

    return 1;
  } catch (error) {
    return null;
  }
};

const deleteConversation = async (req, res) => {
  const { id } = req.params.id;
  try {
    const deletedConversation = await Conversation.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedConversation) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Conversation not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      deletedConversation,
      "Conversation deleted successfully"
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
  createConversation,
  getConversationById,
  getConversationByUserId,
  updateConversation,
  deleteConversation,
};
