const express = require("express");
const {
  register,
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
} = require("../Controller/controllerAuth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtpAndResetPassword", verifyOtpAndResetPassword);

module.exports = router;

// # URL Source
// register : http://localhost:5555/auth/api/ngo/login/register
// login : http://localhost:5555/auth/api/ngo/login/login
// Forgot Password : http://localhost:5555/auth/api/ngo/login/forgotPassword
// Verify OTP & ResetPassword : http://localhost:5555/auth/api/ngo/login/verifyOtpAndResetPassword
