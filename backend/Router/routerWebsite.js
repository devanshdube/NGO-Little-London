const express = require("express");
const {
  getAllProjects,
  getProjectById,
  getGalleryImages,
  getAllTeam,
} = require("../Controller/controllerGet");

const router = express.Router();

router.get("/getAllTeam", getAllTeam);
router.get("/getAllProjects", getAllProjects);
router.get("/getProjectById/:id", getProjectById);
router.get("/getGalleryImages", getGalleryImages);

module.exports = router;
