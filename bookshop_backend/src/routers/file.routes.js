const { Router } = require("express");
const {
  uploadUserImage,
  uploadBookImage,
  uploadOtherImage,
  uploadBookImages,
  uploadResponse,
  uploadMultipleResponse,
} = require("../controllers/file.controller");
const router = new Router();

router.post("/user", uploadUserImage, uploadResponse);
router.post("/book", uploadBookImage, uploadResponse);
router.post("/others", uploadOtherImage, uploadResponse);
router.post("/books", uploadBookImages, uploadMultipleResponse);
module.exports = router;
