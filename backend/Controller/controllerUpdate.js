const { db } = require("./../connect");
const moment = require("moment-timezone");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.updateCertificateStatus = async (req, res) => {
  try {
    const { id } = req.params; // URL se id milegi
    const { status } = req.body; // body se status milega

    // ✅ Validate
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Allowed: active, inactive",
      });
    }

    const query = "UPDATE certificate SET status = ? WHERE id = ?";
    const values = [status, id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Update error: ", err);
        return res.status(500).json({ error: "Database update issue" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({
        status: "Success",
        message: "Status updated successfully",
      });
    });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: "Server side issue" });
  }
};
