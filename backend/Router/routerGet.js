const express = require("express");
const { getEmployees } = require("../Controller/controllerGet");
const { employeeLimiter } = require("../Middleware/rateLimiter");

const router = express.Router();

router.get("/getEmployees", employeeLimiter, getEmployees);

module.exports = router;