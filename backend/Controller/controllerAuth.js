const { db } = require("./../connect");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const unlinkAsync = util.promisify(fs.unlink);

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
    password,
  } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const domain = process.env.domain;
  const user_profile = req.files.user_profile
    ? `${domain}/uploads/${req.files.user_profile[0].filename}`
    : null;

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
          (name, f_name, mobile, email, designation, dob, aadhar, address, city, user_profile, password, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
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
            createdAt,
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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: "Failure", message: "User id is required in URL." });
    }

    const {
      name,
      f_name,
      mobile,
      email: rawEmail,
      designation,
      dob,
      aadhar,
      address,
      city,
      status,
    } = req.body || {};

    if (name && String(name).trim().length === 0) {
      return res
        .status(400)
        .json({ status: "Failure", message: "Name cannot be empty." });
    }

    const email = rawEmail ? String(rawEmail).trim().toLowerCase() : undefined;

    const allowedDesignations = ["Admin", "Employee"];
    if (designation && !allowedDesignations.includes(designation)) {
      return res.status(400).json({
        status: "Failure",
        message: "Invalid designation. Allowed: Admin, Employee.",
      });
    }

    if (mobile) {
      const onlyDigits = String(mobile).replace(/\D/g, "");
      if (onlyDigits.length !== 10) {
        return res.status(400).json({
          status: "Failure",
          message: "Mobile must be 10 digits long (numbers only).",
        });
      }
    }

    if (aadhar) {
      const onlyDigits = String(aadhar).replace(/\D/g, "");
      if (onlyDigits.length !== 12) {
        return res.status(400).json({
          status: "Failure",
          message: "Aadhar must be 12 digits long (numbers only).",
        });
      }
    }

    const domain = process.env.domain || "";
    let user_profile = null;
    try {
      if (req.files && req.files.user_profile) {
        const arr = Array.isArray(req.files.user_profile)
          ? req.files.user_profile
          : [req.files.user_profile];
        if (arr.length > 0 && arr[0].filename) {
          user_profile = `${domain}/uploads/${arr[0].filename}`;
        }
      } else if (req.file && req.file.filename) {
        user_profile = `${domain}/uploads/${req.file.filename}`;
      }
    } catch (fileErr) {
      console.error("File parse warning:", fileErr);
    }

    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (f_name !== undefined) {
      updates.push("f_name = ?");
      params.push(f_name || null);
    }
    if (mobile !== undefined) {
      updates.push("mobile = ?");
      params.push(String(mobile).replace(/\D/g, ""));
    }
    if (email !== undefined) {
      updates.push("email = ?");
      params.push(email);
    }
    if (designation !== undefined) {
      updates.push("designation = ?");
      params.push(designation);
    }
    if (dob !== undefined) {
      updates.push("dob = ?");
      params.push(dob || null);
    }
    if (aadhar !== undefined) {
      updates.push("aadhar = ?");
      params.push(String(aadhar).replace(/\D/g, ""));
    }
    if (address !== undefined) {
      updates.push("address = ?");
      params.push(address || null);
    }
    if (city !== undefined) {
      updates.push("city = ?");
      params.push(city || null);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
    }
    if (user_profile) {
      updates.push("user_profile = ?");
      params.push(user_profile);
    }

    const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    updates.push("updated_at = ?");
    params.push(updatedAt);

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ status: "Failure", message: "No fields provided to update." });
    }

    // push id for WHERE
    params.push(id);

    const sql = `UPDATE employee SET ${updates.join(", ")} WHERE id = ?`;

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("DB update error:", err);
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error occurred." });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "Failure", message: "User not found." });
      }

      return res
        .status(200)
        .json({ status: "Success", message: "User updated successfully." });
    });
  } catch (error) {
    console.error("UpdateUser error:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .json({ status: "Failure", message: "Valid user id required in URL." });
    }

    // 1) Find user and get user_profile
    const selectSql = "SELECT user_profile FROM employee WHERE id = ?";
    db.query(selectSql, [id], async (selErr, selResults) => {
      if (selErr) {
        console.error("DB select error (deleteUser):", selErr);
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error." });
      }

      if (!selResults || selResults.length === 0) {
        return res
          .status(404)
          .json({ status: "Failure", message: "User not found." });
      }

      const userProfile = selResults[0].user_profile; // may be null

      // 2) If there is a stored file path, try to delete the file from uploads
      if (userProfile) {
        try {
          // If user_profile is a full URL like https://domain/uploads/filename.jpg
          // we try to extract the filename after '/uploads/'
          let filename = null;

          // Look for '/uploads/' in the URL/path and extract trailing part
          const uploadsIndex = userProfile.indexOf("/uploads/");
          if (uploadsIndex !== -1) {
            filename = userProfile.slice(uploadsIndex + "/uploads/".length);
          } else {
            // fallback: last segment after slash
            filename = path.basename(userProfile);
          }

          // Construct absolute path to uploads folder (adjust if your uploads folder is elsewhere)
          const uploadsDir = path.join(__dirname, "..", "uploads"); // ../uploads relative to controller file
          const filePath = path.join(uploadsDir, filename);

          // Only attempt unlink if file exists
          if (fs.existsSync(filePath)) {
            await unlinkAsync(filePath);
            console.log("Deleted file:", filePath);
          } else {
            console.warn("File to delete not found:", filePath);
          }
        } catch (fileErr) {
          // Log warning but continue to delete DB row (don't block DB deletion due to file issues)
          console.error(
            "Warning: failed to remove user_profile file:",
            fileErr
          );
        }
      }

      // 3) Delete the DB record (hard delete)
      const deleteSql = "DELETE FROM employee WHERE id = ?";
      db.query(deleteSql, [id], (delErr, delResult) => {
        if (delErr) {
          console.error("DB delete error:", delErr);
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error." });
        }

        if (delResult.affectedRows === 0) {
          // unlikely because we selected earlier, but keep safe-check
          return res
            .status(404)
            .json({ status: "Failure", message: "User not found." });
        }

        return res
          .status(200)
          .json({ status: "Success", message: "User deleted successfully." });
      });
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error." });
  }
};
