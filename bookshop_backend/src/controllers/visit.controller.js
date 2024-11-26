const jwt = require("jsonwebtoken");
const Visit = require("../models/Visit.model"); // Import model Visit
const { User } = require("../models/User.model");
const { verifyToken } = require("../utils/protected");
const logVisit = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (token) {
      const user = await verifyToken(token);
      if (user && user.userType === "user") {
        const userId = user._id;
        const pageVisited = req.originalUrl;
        const action = req.method;

        // Chỉ ghi log cho các hành động quan trọng
        if (
          ["POST", "PUT"].includes(action) ||
          pageVisited.includes("product")
        ) {
          await Visit.create({
            userId,
            pageVisited,
            action,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error logging visit:", error.message);
  }
  next();
};

module.exports = logVisit;
