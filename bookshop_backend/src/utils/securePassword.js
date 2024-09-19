const { hash } = require("bcrypt");
const crypto = require("crypto");
const securePassword = async (password) => {
  const hashPassword = await hash(password, 9);
  return hashPassword;
};
const generateRandomPassword = (length) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
module.exports = { securePassword, generateRandomPassword };
