const { Router } = require("express");
const router = Router();

const {
  createConversation,
  getConversationById,
  getConversationByUserId,
  updateConversation,
  deleteConversation,
} = require("../controllers/conversation/conversation.controller");

router.post("/list", getConversationByUserId);
router.get("/:id", getConversationById);
router.post("/create", createConversation);
router.put("/", updateConversation);
router.delete("/", deleteConversation);
module.exports = router;
