const { sign } = require("jsonwebtoken");

const config = {
  secrets: {
    jwt: "PJaHvt8ASQvFgSgYI2gyc8a9TdHzLh5Rx98s7aB4nhUz4rvW92zsKvN6zbPIub",
    jwtExp: "30m",
    refreshTokenSecret:
      "2231652e642422ae4321ab9dab43eff28dcabd574e73f02f21f1d9d15c666ee7",
    refreshTokenExp: "15d",
  },
};

module.exports = { config };
