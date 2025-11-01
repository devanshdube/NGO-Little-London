const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { postData, postPayment } = require("../Controller/controllerPost");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/postData", postData);
router.post(
  "/postPayment",
  upload.fields([{ name: "screenshot", maxCount: 1 }]),
  postPayment
);

module.exports = router;
