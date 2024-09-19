const joi = require("joi");
const { response } = require("../../utils/response");
const { StatusCodes } = require("http-status-codes");

const validation = joi.object({
  password: joi.string().min(8).required(),
  phone: joi.string().pattern(/^[0-9]{10,15}$/),
  email: joi.string().email(),
});

const authValidation = async (req, res, next) => {
  const identifier = req.body.identifier;
  const phone = req.body.phone;
  const email = req.body.email;

  const isEmail = /\S+@\S+\.\S+/.test(email ? email : identifier);
  const isPhoneNumber = /^[0-9]{10,15}$/.test(phone ? phone : identifier);

  const data = {
    password: req.body.password,
    phone: isPhoneNumber ? (phone ? phone : identifier) : undefined,
    email: isEmail ? (email ? email : identifier) : undefined,
  };
  console.log(data);

  if (!data.phone) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      false,
      {},
      "Phone is required"
    );
  }

  const { error } = validation.validate(data);
  if (error) {
    const message = `Error in User Data: ${error.message}`;
    return response(res, StatusCodes.NOT_ACCEPTABLE, false, {}, message);
  } else {
    next();
  }
};

module.exports = { authValidation };
