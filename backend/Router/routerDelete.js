const express = require("express");
const {
  deleteProject,
  deleteProjectDetail,
  deleteGalleryImage,
} = require("../Controller/controllerDelete");

const router = express.Router();

router.delete("/deleteProject/:id", deleteProject);
router.delete("/deleteProjectDetail/:id", deleteProjectDetail);
router.delete("/deleteGalleryImage/:id", deleteGalleryImage);

module.exports = router;
