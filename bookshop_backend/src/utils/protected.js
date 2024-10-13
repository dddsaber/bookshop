const { StatusCodes } = require("http-status-codes");
const { verify, sign } = require("jsonwebtoken");
const { User } = require("../models/User.model");
const { config } = require("./config");
const { response } = require("./response");
const { TYPE_USER } = require("./constants");

//Generate Access Token
const generateAccessToken = (payload) => {
  return sign(payload, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

// Generate Refresh Token
const generateRefreshToken = (payload) => {
  return sign(payload, config.secrets.refreshTokenSecret, {
    expiresIn: config.secrets.refreshTokenExp,
  });
};
// Create a new token
const createToken = (user) => {
  const payload = {
    _id: user._id,
  };

  if (user.phone) {
    payload.phone = user.phone;
  } else if (user.email) {
    payload.email = user.email;
  } else {
    console.log("Invalid");
    return null;
  }

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

// Create a new access token
const createAccessToken = (user) => {
  const payload = {
    _id: user.id,
  };
  if (user.phone) {
    payload.phone = user.phone;
  } else if (user.email) {
    payload.email = user.email;
  } else {
    console.log("Invalid");
    return null;
  }
  const accessToken = generateAccessToken(payload);
  return accessToken;
};

// Verify token of requesting access token
const verifyRefreshToken = async (token) => {
  if (!token) return;
  try {
    const payload = await verify(token, config.secrets.refreshTokenSecret);
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

module.exports = {
  createToken,
  verifyToken,
  isUser,
  isAdmin,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  createAccessToken,
};
