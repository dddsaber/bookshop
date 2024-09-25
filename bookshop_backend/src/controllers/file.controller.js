const { StatusCodes } = require("http-status-codes");
const { response } = require("../utils/response");
// const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

// const blobString = ""; // Blob Connection String

// Using multer
const multer = require("multer");
const path = require("path");
const { required } = require("joi");

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "upload/others"; // Default folder

    // Check type of image
    if (req.url.includes("/user")) {
      folder = "upload/user";
    } else if (req.url.includes("/book")) {
      folder = "upload/book";
    }

    cb(null, folder); // Save files in respective folders
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Create multer instance with storage configuration
const upload = multer({ storage: storage });

// Upload handler functions
const uploadUserImage = upload.single("user");
const uploadBookImage = upload.single("book");
const uploadOtherImage = upload.single("file");
const uploadBookImages = upload.array("books", 10);

// Response handler for successful upload
const uploadResponse = (req, res) => {
  if (!req.file && !req.user && !req.book) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "No file uploaded"
    );
  }

  // Determine the folder path
  let folder = "others"; // Default folder
  if (req.url.includes("/user")) {
    folder = "user";
  } else if (req.url.includes("/book")) {
    folder = "book";
  }

  return response(
    res,
    StatusCodes.OK,
    true,
    {
      image_url: `http://localhost:${
        process.env.PORT || 5000
      }/upload/${folder}/${
        req.file.filename || req.book.filename || req.user.filename
      }`,
      image_name: `${
        req.file.filename || req.book.filename || req.user.filename
      }`,
    },
    null
  );
};

// Response handler for multiple files upload
const uploadMultipleResponse = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "No files uploaded"
    );
  }

  const folder = "book";
  // Create an array of file information to send in the response
  const fileDetails = req.files.map((file) => ({
    image_url: `http://localhost:${process.env.PORT || 5000}/upload/${folder}/${
      file.filename
    }`,
    image_name: `${file.filename}`,
  }));

  response(
    res,
    StatusCodes.OK,
    true,
    { files: fileDetails },
    "Files uploaded successfully"
  );
};

//Upload Files to Local Directory
const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    let msg = "No file found !";
    return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
  }

  try {
    const file = req.files.file;

    const fileName = file.name;
    const filePath = `${uuidv4()}-${fileName}`;
    file.mv(`uploads/${filePath}`, (err) => {
      if (err) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          { err: err },
          "Could not upload"
        );
      }
      const photoURL = filePath;
      return response(
        res,
        StatusCodes.ACCEPTED,
        true,
        { fileURLs: [photoURL] },
        null
      );
    });
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

const uploadFiles = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    let msg = "No files found!";
    return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
  }

  try {
    const files = req.files["files[]"]; // Assuming the file input field name is 'files'

    // Process each uploaded file
    const fileUploadPromises = files.map(async (file) => {
      const fileName = file.name;
      const filePath = `${uuidv4()}-${fileName}`;

      // Move the uploaded file to the 'uploads' folder
      await file.mv(`uploads/${filePath}`);

      return filePath;
    });

    // Wait for all file uploads to complete
    const uploadedFiles = await Promise.all(fileUploadPromises);

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { fileURLs: uploadedFiles },
      null
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

//Upload Files to Microsoft Azure Blob Storage
// const uploadFile = async (req, res) => {
//   if (req.files === undefined || !req.files.image) {
//     let msg = "No file found !";
//     return response(res, StatusCodes.BAD_REQUEST, false, null, msg);
//   }
//   const file = req.files.image;

//   const blobServiceClient = BlobServiceClient.fromConnectionString(blobString);
//   const containerName = ""; //Blob Container Name
//   const containerClient = blobServiceClient.getContainerClient(containerName);

//   const blobName = `${uuidv4()}.` + file.name.split(".").pop();

//   try {
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.upload(file.data, file.data.length);

//     let data = { photoURL: blockBlobClient.url, fileName: blobName };
//     return response(res, StatusCodes.ACCEPTED, true, data, null);
//   } catch (err) {
//     return response(
//       res,
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       false,
//       err,
//       err.message
//     );
//   }
// };

module.exports = {
  uploadFile,
  uploadFiles,
  uploadUserImage,
  uploadBookImage,
  uploadOtherImage,
  uploadBookImages,
  uploadResponse,
  uploadMultipleResponse,
};
