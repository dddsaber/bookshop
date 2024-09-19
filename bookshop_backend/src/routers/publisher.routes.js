const { Router } = require("express");
const {
  createPublisher,
  updatePublisher,
  deletePublisher,
  getPublishers,
  getPublisherById,
} = require("../controllers/publisher/publisher.controller");

const router = Router();

router.post("/get-publishers", getPublishers);

router.get("/:id", getPublisherById);

router.post("/", createPublisher);

router.put("/update/:id", updatePublisher);

router.put("/delete/:id", deletePublisher);

module.exports = router;
