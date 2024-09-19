const { User } = require("../../models/User.model");
const { compare } = require("bcrypt");
const { createToken } = require("../../utils/config");
const { verifyToken } = require("../../utils/protected");
const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response");
const crypto = require("crypto");

const {
  securePassword,
  generateRandomPassword,
} = require("../../utils/securePassword");
const nodemailer = require("nodemailer");
const {
  PASSWORD_DEFAULT,
  htmlContentForConfirmPassword,
  confirmationUrl,
  TYPE_USER,
  BOOK_SHOP_EMAIL,
  BOOK_SHOP_PASSWORD,
} = require("../../utils/constants");

// ----------------------------------------------------------------
// User registers a new account
// ----------------------------------------------------------------
const register = async (req, res) => {
  const { phone, password, email } = req.body;

  try {
    const oldUserPhone = await User.findOne({ phone: phone });
    if (oldUserPhone) {
      return response(
        res,
        StatusCodes.CONFLICT,
        false,
        {},
        "Phone number is already exists"
      );
    }
    if (email !== undefined) {
      const oldUser = await User.findOne({ email: email });
      if (oldUser) {
        return response(
          res,
          StatusCodes.CONFLICT,
          false,
          {},
          "Email is already exists"
        );
      }
    }

    const hashedPassword = await securePassword(password);
    console.log(hashedPassword);

    const user = await User.create({
      email: email ? email : "",
      phone: phone,
      password: hashedPassword,
      name: `User_${generateRandomPassword(8)}`,
      userType: TYPE_USER.user,
      status: "active",
      avatar: "http://localhost:5000/images/user/default_avatar.png",
    });
    console.log(user);
    const token = createToken(user);

    if (!user) {
      return response(
        res,
        StatusCodes.FORBIDDEN,
        false,
        {},
        "Could not create user do to user'serror"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      { user, token },
      "User created successfully"
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

// ----------------------------------------------------------------
// User logs in account
// ----------------------------------------------------------------
const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing phone, email, or password"
    );
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    const isMatch = await compare(password, user.password);

    if (isMatch) {
      const token = createToken(user);
      if (user.isActive) {
        if (token) {
          return response(
            res,
            StatusCodes.OK,
            true,
            { user, token },
            "Logged in successfully"
          );
        }

        return response(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          {},
          "Invalid credentials"
        );
      } else {
        return response(
          res,
          StatusCodes.FORBIDDEN,
          false,
          {},
          "User account is blocked"
        );
      }
    } else {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "Incorrect passwords"
      );
    }
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

// ----------------------------------------------------------------
// Re-authentication
// ----------------------------------------------------------------
const reAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return response(res, StatusCodes.BAD_REQUEST, false, {}, "Missing token");
  }
  try {
    const result = await verifyToken(token);

    if (result) {
      const user = await User.findById(result._id);
      if (!user) {
        return response(
          res,
          StatusCodes.NOT_FOUND,
          false,
          {},
          "User not found"
        );
      }
      if (!user.isActive) {
        return response(
          res,
          StatusCodes.FORBIDDEN,
          false,
          {},
          "User account is blocked"
        );
      }

      const newToken = createToken(user);
      if (newToken) {
        return response(
          res,
          StatusCodes.OK,
          true,
          { user: user, token: newToken },
          "User re-authenticated successfully"
        );
      } else {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Please login again"
        );
      }
    }
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

// ----------------------------------------------------------------
// User changes password
// ----------------------------------------------------------------
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return response(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        {},
        "Incorrect passwords"
      );
    }

    const hashedPassword = await securePassword(newPassword);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updateUser) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to update user's password"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { user: updateUser },
      "User's password changed successfully"
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

// ----------------------------------------------------------------
// Reset user's password (send reset link)
// ----------------------------------------------------------------
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    const password = generateRandomPassword(8);
    const hashedPassword = await securePassword(password);
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );
    if (!updateUser) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Failed to update user's password"
      );
    }

    // Tạo đối tượng transporter với thông tin về email server
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: BOOK_SHOP_EMAIL,
        pass: BOOK_SHOP_PASSWORD,
      },
    });

    // Cấu hình email
    let mailOptions = {
      from: BOOK_SHOP_EMAIL, // Email người gửi
      to: email, // Email người nhận
      subject: "Password reset from Book Shop", // Tiêu đề của email
      text: `Your new password: ${password}`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return response(
      res,
      StatusCodes.OK,
      true,
      {},
      "Reset password email sent successfully"
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

// ----------------------------------------------------------------
// Send mail with the link direct to change password
// ----------------------------------------------------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        { success: false },
        "User not found"
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = tokenExpiry;
    await user.save();

    // URL navigate to the FORM from FRONTEND
    const ConfirmURL = `${confirmationUrl}/${user._id}?token=${token}`;

    // Tạo đối tượng transporter với thông tin về email server
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: BOOK_SHOP_EMAIL,
        pass: BOOK_SHOP_PASSWORD,
      },
    });

    // Cấu hình email
    let mailOptions = {
      from: BOOK_SHOP_EMAIL, // Email người gửi
      to: email, // Email người nhận
      subject: "Password reset from Book Shop", // Tiêu đ�� của email
      html: `
        <p>Click the link below to confirm and set a new password:</p>
        <a href="${ConfirmURL}">${ConfirmURL}</a>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return response(
      res,
      StatusCodes.OK,
      true,
      { userId: user._id },
      "Send Mail successfully"
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
// ----------------------------------------------------------------
// Confirm Password
// ----------------------------------------------------------------
const changePasswordOnConfirm = async (req, res) => {
  const { userId, token, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (
      !user ||
      user.resetPasswordToken !== token ||
      user.resetPasswordExpiry < Date.now()
    ) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Invalid or exprired token"
      );
    }

    const hashedPassword = await securePassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return response(
      res,
      StatusCodes.OK,
      true,
      { user },
      "Password changed successfully"
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
// ----------------------------------------------------------------
// Exports functions
// ----------------------------------------------------------------
module.exports = {
  register,
  login,
  reAuth,
  changePassword,
  resetPassword,
  forgotPassword,
  changePasswordOnConfirm,
};
