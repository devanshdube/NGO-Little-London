const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  register,
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
  updateUser,
  deleteUser,
} = require("../Controller/controllerAuth");

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

router.post(
  "/register",
  upload.fields([{ name: "user_profile", maxCount: 1 }]),
  register
);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtpAndResetPassword", verifyOtpAndResetPassword);
router.put("/updateUser/:id", upload.single("user_profile"), updateUser);
router.delete("/deleteUser/:id", deleteUser);

module.exports = router;

// # URL Source
// register : http://localhost:5555/auth/api/ngo/login/register
// login : http://localhost:5555/auth/api/ngo/login/login
// Forgot Password : http://localhost:5555/auth/api/ngo/login/forgotPassword
// Verify OTP & ResetPassword : http://localhost:5555/auth/api/ngo/login/verifyOtpAndResetPassword
