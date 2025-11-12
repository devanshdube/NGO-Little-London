const { db } = require("./../connect");
const moment = require("moment-timezone");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.postData = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const values = [name, email, phone, subject, message, createdAt];

    const query =
      "INSERT INTO contact (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("data insert nahi ho raha hai: ", err);
        return res
          .status(500)
          .json({ error: "Database insertion ka issue hai" });
      }
      res.status(201).json({
        status: "Success",
        message: "Data inserted successfully",
        data: result,
      });
    });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: "Server side ka issue hai" });
  }
};

exports.postPayment = async (req, res) => {
  try {
    const {
      name,
      phone,
      amount,
      paymentMethod,
      bankName,
      branchName,
      bankTxnRef,
      txnId,
      panNo,
      remarks,
    } = req.body;

    const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // const screenshot = req.file ? `/uploads/payments/${req.file.filename}` : null;
    const domain = process.env.domain;
    const screenshot = req.files.screenshot
      ? `${domain}/uploads/${req.files.screenshot[0].filename}`
      : null;

    if (!name || !phone || !amount || !paymentMethod) {
      return res.status(400).json({
        error: "name, phone, amount and paymentMethod are required",
      });
    }

    if (isNaN(amount)) {
      return res.status(400).json({ error: "amount must be a valid number" });
    }

    const pmRaw = String(paymentMethod).trim().toLowerCase();
    let pm;
    if (pmRaw === "cash") pm = "Cash";
    else if (pmRaw === "upi") pm = "UPI";
    else if (
      pmRaw === "net banking" ||
      pmRaw === "netbanking" ||
      pmRaw === "net_bank"
    )
      pm = "Net Banking";
    else
      return res.status(400).json({
        error: "Invalid paymentMethod. Allowed: Cash, UPI, Net Banking",
      });

    if (pm === "Cash") {
      if (!panNo)
        return res
          .status(400)
          .json({ error: "panNo is required for Cash payments" });
    } else if (pm === "UPI") {
      if (!txnId)
        return res
          .status(400)
          .json({ error: "txnId is required for UPI payments" });
      if (!panNo)
        return res
          .status(400)
          .json({ error: "panNo is required for UPI payments" });
      if (!screenshot)
        return res
          .status(400)
          .json({ error: "Screenshot is required for UPI payments" });
    } else if (pm === "Net Banking") {
      if (!bankName || !branchName)
        return res.status(400).json({
          error: "bankName and branchName are required for Net Banking",
        });
      if (!panNo)
        return res
          .status(400)
          .json({ error: "panNo is required for Net Banking payments" });
      if (!screenshot)
        return res
          .status(400)
          .json({ error: "Screenshot is required for Net Banking payments" });
    }

    const query = `
        INSERT INTO payment
        (name, phone, amount, paymentMethod, bankName, branchName, bankTxnRef, txnId, panNo, screenshot, remarks, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const values = [
      name,
      phone,
      parseFloat(amount),
      pm,
      bankName || null,
      branchName || null,
      bankTxnRef || null,
      txnId || null,
      panNo || null,
      screenshot || null,
      remarks || null,
      createdAt,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("DB insert error:", err);

        if (req.files?.screenshot) {
          const filePath = req.files.screenshot[0].path;
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        return res.status(500).json({ error: "Database insertion error" });
      }

      return res.status(201).json({
        status: "Success",
        message: "Payment recorded",
        insertedId: result.insertId,
        created_at: createdAt,
      });
    });
  } catch (error) {
    console.error("Server error:", error);

    if (req.files?.screenshot) {
      const filePath = req.files.screenshot[0].path;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.postProject = async (req, res) => {
  try {
    const { title } = req.body;

    const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const domain = process.env.domain;

    // ✅ file required check
    if (!req.files || !req.files.file_name) {
      return res.status(400).json({
        error: "File is required",
      });
    }

    const file_name = `${domain}/uploads/${req.files.file_name[0].filename}`;

    // ✅ title check
    if (!title || title.trim() === "") {
      // delete uploaded file if validation fails
      const filePath = req.files.file_name[0].path;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return res.status(400).json({
        error: "Title is required",
      });
    }

    const query = `
      INSERT INTO project
      (title, file_name, created_at)
      VALUES (?, ?, ?)
    `;

    const values = [title, file_name, createdAt];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("DB insert error:", err);

        // ✅ delete file if DB error occurs
        const filePath = req.files.file_name[0].path;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return res.status(500).json({ error: "Database insertion error" });
      }

      return res.status(201).json({
        status: "Success",
        message: "Project recorded",
        insertedId: result.insertId,
        created_at: createdAt,
      });
    });
  } catch (error) {
    console.error("Server error:", error);

    // ✅ delete file on server error
    if (req.files?.file_name) {
      const filePath = req.files.file_name[0].path;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.postProjectDetails = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { project_description } = req.body;

    if (!project_description) {
      return res.status(400).json({
        error: "project_description is required",
      });
    }

    // ✅ 1. Check if project ID exists
    const checkQuery = `SELECT id FROM project WHERE id = ?`;
    db.query(checkQuery, [project_id], (err, rows) => {
      if (err) {
        console.error("DB error:", err);
        return res
          .status(500)
          .json({ error: "Database error while checking project" });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Project ID does not exist",
        });
      }

      // ✅ Project exists → Now insert details
      const createdAt = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      const status = "Approve";

      const insertQuery = `
        INSERT INTO project_details
        (project_id, project_description, status, created_at)
        VALUES (?, ?, ?, ?)
      `;

      const values = [project_id, project_description, status, createdAt];

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ error: "Database insertion error" });
        }

        return res.status(201).json({
          status: "Success",
          message: "Project details added successfully",
          insertedId: result.insertId,
        });
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadGalleryImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "Error",
        message: "At least one image is required",
      });
    }

    const uploadsDir = path.join(__dirname, "../uploads");
    const domain = process.env.domain;
    const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // ✅ prepare values for bulk insert
    const values = req.files.map((f) => [
      `${domain}/uploads/${f.filename}`,
      createdAt,
    ]);

    const placeholders = values.map(() => "(?, ?)").join(", ");
    const flat = values.flat();

    const query = `INSERT INTO gallery (file_name, created_at) VALUES ${placeholders}`;

    db.query(query, flat, (err, result) => {
      if (err) {
        console.error("DB insert error:", err);

        // ✅ delete uploaded files
        req.files.forEach((f) => {
          const p = path.join(uploadsDir, f.filename);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        });

        return res
          .status(500)
          .json({ status: "Error", message: "Database insertion error" });
      }

      const insertedBaseId = result.insertId;
      const insertedCount = req.files.length;

      const inserted = req.files.map((f, i) => ({
        id: insertedBaseId + i,
        file_name: `${domain}/uploads/${f.filename}`,
        created_at: createdAt,
      }));

      return res.status(201).json({
        status: "Success",
        message: "Images uploaded successfully",
        count: insertedCount,
        inserted,
      });
    });
  } catch (error) {
    console.error("Server error:", error);

    const uploadsDir = path.join(__dirname, "../uploads");

    if (req.files) {
      req.files.forEach((f) => {
        const p = path.join(uploadsDir, f.filename);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      });
    }

    return res
      .status(500)
      .json({ status: "Error", message: "Internal server error" });
  }
};

exports.postCertificate = async (req, res) => {
  try {
    const { name } = req.body;

    const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    if (!name) {
      return res.status(400).json({ error: "Name are required" });
    }
    const values = [name, createdAt];

    const query = "INSERT INTO certificate (name, created_at) VALUES (?, ?)";

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("data insert nahi ho raha hai: ", err);
        return res
          .status(500)
          .json({ error: "Database insertion ka issue hai" });
      }
      res.status(201).json({
        status: "Success",
        message: "Data inserted successfully",
        data: result,
      });
    });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: "Server side ka issue hai" });
  }
};
