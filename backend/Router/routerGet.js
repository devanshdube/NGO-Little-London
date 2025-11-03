const express = require("express");
const {
  getEmployees,
  getPaymentTransactions,
  getAllUser,
} = require("../Controller/controllerGet");
const { employeeLimiter } = require("../Middleware/rateLimiter");

const router = express.Router();

router.get("/getEmployees", employeeLimiter, getEmployees);
router.get("/getPaymentTransactions", getPaymentTransactions);
router.get("/getAllUser", getAllUser);

module.exports = router;
