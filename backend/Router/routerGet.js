const express = require("express");
const {
  getEmployees,
  getPaymentTransactions,
  getAllUser,
  getAllProjects,
  getProjectById,
  getApprovedProjects,
  getGalleryImages,
} = require("../Controller/controllerGet");
const { employeeLimiter } = require("../Middleware/rateLimiter");

const router = express.Router();

router.get("/getEmployees", employeeLimiter, getEmployees);
router.get("/getPaymentTransactions", getPaymentTransactions);
router.get("/getAllUser", getAllUser);
router.get("/getAllProjects", getAllProjects);
router.get("/getProjectById/:id", getProjectById);
router.get("/getApprovedProjects", getApprovedProjects);
router.get("/getGalleryImages", getGalleryImages);

module.exports = router;
