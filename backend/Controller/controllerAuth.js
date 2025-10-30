const { db } = require("./../connect");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

dotenv.config();

exports.register = async (req, res) => {
  const {
    name,
    f_name,
    mobile,
    email,
    designation,
    dob,
    aadhar,
    address,
    city,
    user_profile,
    password,
  } = req.body;

  // Validation
  if (!name || !email || !designation || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "Required fields: name, email, designation, and password.",
    });
  }

  try {
    // Check if already exists
    db.query(
      "SELECT * FROM employee WHERE email = ? OR name = ?",
      [email, name],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error", error: err });
        }

        if (results.length > 0) {
          return res.status(409).json({
            status: "Failure",
            message: "Employee already registered.",
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into employee table
        db.query(
          `INSERT INTO employee 
          (name, f_name, mobile, email, designation, dob, aadhar, address, city, user_profile, password, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [
            name,
            f_name || null,
            mobile || null,
            email,
            designation,
            dob || null,
            aadhar || null,
            address || null,
            city || null,
            user_profile || null,
            hashedPassword,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                status: "Failure",
                message: "Database insert error",
                error: err,
              });
            }

            res.status(201).json({
              status: "Success",
              message: "Employee registered successfully",
              data: { id: result.insertId, name, email, designation },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!email || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "Email and password are required.",
    });
  }

  try {
    const getUserQuery = "SELECT * FROM employee WHERE email = ?";
    db.query(getUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Internal server error.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: "Failure",
          message: "Invalid email or password.",
        });
      }

      const employee = results[0];

      // ✅ Check active status
      if (employee.status !== "active") {
        return res.status(403).json({
          status: "Failure",
          message: "Your account is inactive. Please contact admin.",
        });
      }

      // ✅ Compare password
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(401).json({
          status: "Failure",
          message: "Invalid email or password.",
        });
      }

      // ✅ Generate JWT token
      const payload = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
      });

      // ✅ Send response
      return res.status(200).json({
        status: "Success",
        message: "Login successful.",
        token,
        user: payload,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Server error.",
      error,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
});

const forgotOtpStore = new Map();
const otpRateLimitStore = new Map();

const sendPasswordOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Your Password OTP" <${process.env.EMAILSENDER}>`,
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset OTP code is: ${otp}`,
    html: `<b>Your password reset OTP code is: ${otp}</b>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

const generateOtp = () => {
  const n = crypto.randomInt(0, 1000000);
  return n.toString().padStart(6, "0");
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "Failure", message: "Email is required" });
    }

    const emailLower = String(email).trim().toLowerCase();

    const now = Date.now();
    const rate = otpRateLimitStore.get(emailLower) || {
      lastSentAt: 0,
      sentCount: 0,
    };

    if (now - rate.lastSentAt > 15 * 60 * 1000) {
      rate.sentCount = 0;
      rate.lastSentAt = now;
    }
    if (rate.sentCount >= 3) {
      return res.status(429).json({
        status: "Failure",
        message: "Too many requests. Try again later.",
      });
    }

    const getUserQuery = `SELECT * FROM employee WHERE email = ? LIMIT 1`;
    db.query(getUserQuery, [emailLower], async (err, result) => {
      const genericResponse = () =>
        res.status(200).json({
          status: "Success",
          message:
            "If the account exists, an OTP has been sent to the provided email.",
        });

      if (err) {
        console.error("DB error in forgotPassword:", err);
        return res
          .status(500)
          .json({ status: "Failure", message: "Internal server error" });
      }

      if (!result || result.length === 0) {
        return genericResponse();
      }

      const user = result[0];

      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);

      forgotOtpStore.set(emailLower, {
        otpHash,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
      });

      rate.sentCount += 1;
      rate.lastSentAt = now;
      otpRateLimitStore.set(emailLower, rate);

      try {
        await sendPasswordOtpEmail(user.email, otp);
        return genericResponse();
      } catch (mailErr) {
        console.error("Error sending OTP email:", mailErr);
        forgotOtpStore.delete(emailLower);
        return res.status(500).json({
          status: "Failure",
          message: "Failed to send OTP. Please try again later.",
        });
      }
    });
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error" });
  }
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: "Failure",
        message: "email, OTP, and new password are required",
      });
    }

    const emailLower = String(email).trim().toLowerCase();

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "Failure",
        message: "Password must be at least 6 characters",
      });
    }

    const otpData = forgotOtpStore.get(emailLower);
    if (!otpData || Date.now() > otpData.expiresAt) {
      forgotOtpStore.delete(emailLower);
      return res
        .status(400)
        .json({ status: "Failure", message: "OTP expired or invalid" });
    }

    otpData.attempts = (otpData.attempts || 0) + 1;
    if (otpData.attempts > 5) {
      forgotOtpStore.delete(emailLower);
      return res.status(429).json({
        status: "Failure",
        message: "Too many attempts. Request a new OTP.",
      });
    }
    forgotOtpStore.set(emailLower, otpData);

    const isOtpValid = await bcrypt.compare(String(otp), otpData.otpHash);
    if (!isOtpValid) {
      return res
        .status(400)
        .json({ status: "Failure", message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePasswordQuery = `UPDATE employee SET password = ? WHERE email = ?`;
    db.query(
      updatePasswordQuery,
      [hashedPassword, emailLower],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res
            .status(500)
            .json({ status: "Failure", message: "Failed to reset password" });
        }

        forgotOtpStore.delete(emailLower);

        return res
          .status(200)
          .json({ status: "Success", message: "Password reset successful" });
      }
    );
  } catch (error) {
    console.error("Error processing password reset:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error" });
  }
};
