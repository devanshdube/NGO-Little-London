const rateLimit = require("express-rate-limit");

const employeeLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 30,
  message: "Too many requests",
});

module.exports = { employeeLimiter };
