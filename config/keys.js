require("dotenv").config();
const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_MS: process.env.JWT_EXPIRATION_MS,
};

if (!config.JWT_EXPIRATION_MS || !config.JWT_SECRET) {
  console.log("ENV value missing ");
  process.exit(1);
}

module.exports = config;
