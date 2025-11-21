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
  getUserById,
  getAllCertificates,
  getCertificateById,
  getAllSchoolQuerys,
  getAllSchoolAdmissionQuerys,
  getSchoolGalleryImages,
  getSchoolFranchiseQuerys,
  getSchoolNewsEventsQuerys,
  getSchoolNoticeQuerys,
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
router.get("/getUser/:id", authenticateToken, getUserById);
router.get("/getAllCertificates", getAllCertificates);
router.get("/getCertificateById/:id", getCertificateById);

// +++++++++++++++++++++++++++++++++++++++++++++

// New route for school form submissions

router.get("/getAllSchoolQuerys", authenticateToken, getAllSchoolQuerys);
router.get(
  "/getAllSchoolAdmissionQuerys",
  authenticateToken,
  getAllSchoolAdmissionQuerys
);
router.get("/getSchoolGalleryImages", getSchoolGalleryImages);
router.get(
  "/getSchoolFranchiseQuerys",
  authenticateToken,
  getSchoolFranchiseQuerys
);
router.get("/getSchoolNewsEventsQuerys", getSchoolNewsEventsQuerys);
router.get("/getSchoolNoticeQuerys", getSchoolNoticeQuerys);

module.exports = router;
