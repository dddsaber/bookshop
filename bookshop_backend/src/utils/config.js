const { sign } = require("jsonwebtoken");

const config = {
  secrets: {
    jwt: "PJaHvt8ASQvFgSgYI2gyc8a9TdHzLh5Rx98s7aB4nhUz4rvW92zsKvN6zbPIub",
    jwtExp: "30d",
  },
};

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

  return sign(payload, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

module.exports = { createToken, config };
