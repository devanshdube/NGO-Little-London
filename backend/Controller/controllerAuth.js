const { db } = require("./../connect");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
