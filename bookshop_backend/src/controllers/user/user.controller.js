const { StatusCodes } = require("http-status-codes");
const { User } = require("../../models/User.model");
const { response } = require("../../utils/response");
const { securePassword } = require("../../utils/securePassword");
const { TYPE_USER, PASSWORD_DEFAULT } = require("../../utils/constants");

const createUser = async (req, res) => {
  const { email, phone, password, userType, ...objUser } = req.body;
  if ((!email && !phone) || !password || !userType) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Missing required fields"
    );
  }

  try {
    let oldUser;
    if (email) {
      oldUser = await User.findOne({ email });
    } else if (phone) {
      oldUser = await User.findOne({ phone });
    }
    if (oldUser) {
      return response(
        res,
        StatusCodes.CONFLICT,
        false,
        {},
        "Email or phone already exists"
      );
    }

    if (password.length < 8) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Password must be at least 8 characters long"
      );
    }

    const hashedPassword = await securePassword(password);

    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
      userType,
      isActive: true,
      status: "active",
      ...objUser,
    });

    if (!newUser) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Create user failed"
      );
    }

    return response(
      res,
      StatusCodes.CREATED,
      true,
      { user: newUser },
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

const updateUser = async (req, res) => {
  const user = req.body;
  const userId = req.params.id;
  if (!user) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "No user's data updated"
    );
  }
  try {
    const newUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    }).exec();
    if (!newUser) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      { user: newUser },
      "User updated successfully"
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

const getUsers = async (req, res) => {
  const {
    skip,
    limit,
    isActive,
    userType,
    searchKey,
    sortBy,
    userTypes,
    isActives,
  } = req.body;

  try {
    const total = await User.countDocuments()
      .where(
        searchKey
          ? {
              $or: [
                { name: { $regex: searchKey, $options: "i" } },
                { email: { $regex: searchKey, $options: "i" } },
                { phone: { $regex: searchKey, $options: "i" } },
              ],
            }
          : null
      )
      .where(isActive !== undefined ? { isActive } : null)
      .where(userType !== undefined ? { userType } : null)
      .where(userTypes ? { userType: { $in: userTypes } } : null)
      .where(isActives ? { isActive: { $in: isActives } } : null);

    const users = await User.find()
      .where(
        searchKey
          ? {
              $or: [
                { name: { $regex: searchKey, $options: "i" } },
                { email: { $regex: searchKey, $options: "i" } },
                { phone: { $regex: searchKey, $options: "i" } },
              ],
            }
          : null
      )
      .where(isActive !== undefined ? { isActive } : null)
      .where(userType !== undefined ? { userType } : null)
      .where(userTypes ? { userType: { $in: userTypes } } : null)
      .where(isActives ? { isActive: { $in: isActives } } : null)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .skip(skip ? skip : null)
      .limit(limit ? limit : null);

    return response(
      res,
      StatusCodes.OK,
      true,
      { users: users, total: total },
      "Users retrieved successfully"
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

const getUserById = async (req, res) => {
  const { userId } = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { user },
      "User retrieved successfully"
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

const deleteUser = async (req, res) => {
  const { userId } = req.params.id;
  try {
    const user = await User.findOneAndDelete(userId);
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      { user },
      "User deleted successfully"
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

const softDeleteUser = async (req, res) => {
  const { userId } = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return response(res, StatusCodes.NOT_FOUND, false, {}, "User not found");
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      { user },
      "User soft deleted successfully"
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

// Update Status
const updateStatus = async (req, res) => {
  const { activeStatus } = req.body;

  const id = req.params.id;

  let user = {};

  if (activeStatus !== undefined) {
    user.activeStatus = activeStatus;
  }

  if (user) {
    user.updatedAt = new Date();
    try {
      const newUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      }).exec();
      if (!newUser) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Could not update!"
        );
      }

      return response(res, StatusCodes.ACCEPTED, true, { user: newUser }, null);
    } catch (error) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        error.message
      );
    }
  } else {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Could not update!"
    );
  }
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUserById,
  deleteUser,
  softDeleteUser,
  updateStatus,
};
