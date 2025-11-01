const { db } = require("./../connect");
const moment = require("moment-timezone");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.postData = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const values = [name, email, phone, subject, message];

    const query =
      "INSERT INTO contact (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";

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
