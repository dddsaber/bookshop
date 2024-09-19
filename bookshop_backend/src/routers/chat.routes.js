const { Router } = require("express");
const router = Router();

const {
  createChat,
  getChatById,
  getChatByConversationId,
  updateChat,
  deleteChat,
} = require("../controllers/chat/chat.controller");

router.post("/list", getChatByConversationId);
router.get("/:id", getChatById);
router.post("/create", createChat);
router.put("/", updateChat);
router.delete("/", deleteChat);

module.exports = router;
