const express = require("express");
const {
  deleteProject,
  deleteProjectDetail,
  deleteGalleryImage,
  deleteCertificate,
  deleteSchoolGalleryImage,
  deleteSchoolNewsEvents,
  deleteSchoolNotice,
} = require("../Controller/controllerDelete");

const router = express.Router();

router.delete("/deleteProject/:id", deleteProject);
router.delete("/deleteProjectDetail/:id", deleteProjectDetail);
router.delete("/deleteGalleryImage/:id", deleteGalleryImage);
router.delete("/deleteCertificate/:id", deleteCertificate);

// +++++++++++++++++++++++++++++++++++++++++++++

// New route for school form submissions

router.delete("/deleteSchoolGalleryImage/:id", deleteSchoolGalleryImage);
router.delete("/deleteSchoolNewsEvents/:id", deleteSchoolNewsEvents);
router.delete("/deleteSchoolNotice/:id", deleteSchoolNotice);

module.exports = router;
