const { StatusCodes } = require("http-status-codes");
const { verify } = require("jsonwebtoken");
const { User } = require("../models/User.model");
const { config } = require("./config");
const { response } = require("./response");
const { TYPE_USER } = require("./constants");

// Verify token of user request
const verifyToken = async (token) => {
  if (!token) {
    return;
  }
  try {
    const payload = await verify(token, config.secrets.jwt);
    const user = await User.findById(payload._id);
    if (user) {
      return user;
    } else {
      return;
    }
  } catch (error) {
    console.log(error.message);
    return;
  }
};

// Protected route for any user
const isUser = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const user = await verifyToken(
        req.headers.authorization.split("Bearer ")[1]
      );

      if (user) {
        req.user = user;
        next();
      } else {
        return response(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          {},
          "Not Authenticated"
        );
      }
    } catch (error) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        error,
        error.message
      );
    }
  } else {
    return response(
      res,
      StatusCodes.NOT_ACCEPTABLE,
      false,
      {},
      "Authentication Token not found"
    );
  }
};

// Protected route for super admin
const isAdmin = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const user = await verifyToken(
        req.headers.authorization.split("Bearer ")[1]
      );

      if (user && user.userType === TYPE_USER.admin) {
        req.user = user;
        next();
      } else {
        return response(
          res,
          StatusCodes.NOT_FOUND,
          false,
          {},
          "Not Authenticated"
        );
      }
    } catch (error) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        error,
        error.message
      );
    }
  } else {
    return response(
      res,
      StatusCodes.NOT_ACCEPTABLE,
      false,
      {},
      "Authentication Token not found"
    );
  }
};

module.exports = { verifyToken, isUser, isAdmin };
