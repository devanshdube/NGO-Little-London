const express = require("express");
const {
  getEmployees,
  getPaymentTransactions,
  getAllUser,
  getAllProjects,
  getProjectById,
  getApprovedProjects,
  getGalleryImages,
  getAllAdmin,
  getAllQuerys,
} = require("../Controller/controllerGet");
const { employeeLimiter } = require("../Middleware/rateLimiter");
const authenticateToken = require("../Middleware/authenticateToken");

const router = express.Router();

router.get("/getEmployees", employeeLimiter, getEmployees);
router.get(
  "/getPaymentTransactions",
  authenticateToken,
  getPaymentTransactions
);
router.get("/getAllUser", authenticateToken, getAllUser);
router.get("/getAllAdmin", authenticateToken, getAllAdmin);
router.get("/getAllQuerys", authenticateToken, getAllQuerys);
router.get("/getAllProjects", authenticateToken, getAllProjects);
router.get("/getProjectById/:id", authenticateToken, getProjectById);
router.get("/getApprovedProjects", authenticateToken, getApprovedProjects);
router.get("/getGalleryImages", authenticateToken, getGalleryImages);

module.exports = router;
