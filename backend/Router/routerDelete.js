const express = require("express");
const {
  deleteProject,
  deleteProjectDetail,
  deleteGalleryImage,
  deleteCertificate,
} = require("../Controller/controllerDelete");

const router = express.Router();

router.delete("/deleteProject/:id", deleteProject);
router.delete("/deleteProjectDetail/:id", deleteProjectDetail);
router.delete("/deleteGalleryImage/:id", deleteGalleryImage);
router.delete("/deleteCertificate/:id", deleteCertificate);

module.exports = router;
