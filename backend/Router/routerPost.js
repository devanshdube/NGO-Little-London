const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  postData,
  postPayment,
  postProject,
  postProjectDetails,
  uploadGalleryImages,
} = require("../Controller/controllerPost");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

router.post("/postData", postData);

router.post(
  "/postPayment",
  upload.fields([{ name: "screenshot", maxCount: 1 }]),
  postPayment
);

router.post(
  "/postProject",
  upload.fields([{ name: "file_name", maxCount: 1 }]),
  postProject
);

router.post("/postProjectDetails/:project_id", postProjectDetails);

// allow only images
function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file_name"));
  }
  cb(null, true);
}

const fileupload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { files: 20, fileSize: 2 * 1024 * 1024 },
});

router.post(
  "/uploadGalleryImages",
  (req, res, next) => {
    fileupload.array("file_name", 20)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // ✅ File type error
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            status: "Error",
            message: "Only image files are allowed",
          });
        }

        // ✅ File size / limit error
        return res.status(400).json({
          status: "Error",
          message: err.message,
        });
      }

      if (err) {
        return res.status(400).json({
          status: "Error",
          message: err.message,
        });
      }

      next();
    });
  },
  uploadGalleryImages
);

module.exports = router;
