const { StatusCodes } = require("http-status-codes");
const { Chat } = require("../../models/Chat.model");
const { response } = require("../../utils/response");
const {
  updateConversation,
} = require("../conversation/conversation.controller");

const createChat = async (message) => {
  try {
    const newChat = await Chat.create(message);
    updateConversation(newChat);
    return newChat;
  } catch (error) {
    return false;
  }
};

const getChatById = async (req, res) => {
  const id = req.params.id;
  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Chat not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      chat,
      "Chat retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error retrieving chat"
    );
  }
};

const getChatByConversationId = async (req, res) => {
  const conversationId = req.body;

  try {
    const chats = await Chat.find(
      { conversationId },
      {
        isDeleted: false,
      }
    )
      .populate({
        path: "sendBy",
        select: "name photo",
      })
      .populate({
        path: "sendTo",
        select: "name photo",
      })
      .sort({
        createdAt: -1,
      });

    if (!chats) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Chats not found for this conversation"
      );
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      chats,
      "Chats retrieved successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error retrieving chat by conversation ID"
    );
  }
};

const updateChat = async (req, res) => {
  const id = req.params.id;
  const { name, participants, lastMessage } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { name, participants, lastMessage },
      { new: true }
    );

    if (!updatedChat) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Chat not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      updatedChat,
      "Chat updated successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error updating chat"
    );
  }
};

const deleteChat = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedChat = await Chat.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedChat) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "Chat not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      deletedChat,
      "Chat deleted successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Error deleting chat"
    );
  }
};

module.exports = {
  createChat,
  getChatById,
  getChatByConversationId,
  updateChat,
  deleteChat,
};
