const { Router } = require("express");
const {
  uploadUserImage,
  uploadBookImage,
  uploadOtherImage,
  uploadResponse,
} = require("../controllers/file.controller");
const router = new Router();

router.post("/upload/user", uploadUserImage, uploadResponse);
router.post("/upload/book", uploadBookImage, uploadResponse);
router.post("/upload/others", uploadOtherImage, uploadResponse);

module.exports = router;
