const { db } = require("./../connect");
const fs = require("fs");
const path = require("path");

function tryRemoveUploadFile(fileUrl) {
  try {
    if (!fileUrl) return;
    const uploadsMarker = "/uploads/";
    const idx = fileUrl.indexOf(uploadsMarker);
    if (idx === -1) return;

    const filename = fileUrl.slice(idx + uploadsMarker.length);
    const safeFilename = path.basename(filename);
    const uploadPath = path.join(__dirname, "..", "uploads", safeFilename);

    if (fs.existsSync(uploadPath)) {
      fs.unlinkSync(uploadPath);
    }
  } catch (err) {
    console.error("Error removing upload file:", err);
  }
}

// replace only the deleteProject function with this
exports.deleteProject = (req, res) => {
  const projectId = Number(req.params.id);
  if (!projectId || Number.isNaN(projectId)) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid project id" });
  }

  // 1) fetch file_name for later removal
  const selectQuery = "SELECT file_name FROM project WHERE id = ?";
  db.query(selectQuery, [projectId], (selErr, selRows) => {
    if (selErr) {
      console.error("Select error:", selErr);
      return res
        .status(500)
        .json({ status: "Error", message: "Database error" });
    }

    if (!selRows || selRows.length === 0) {
      return res
        .status(404)
        .json({ status: "Not Found", message: "Project not found" });
    }

    const file_name = selRows[0].file_name;

    // 2) delete project (project_details removed by FK ON DELETE CASCADE)
    const deleteQuery = "DELETE FROM project WHERE id = ?";
    db.query(deleteQuery, [projectId], (delErr, delResult) => {
      if (delErr) {
        console.error("Delete error:", delErr);
        return res
          .status(500)
          .json({ status: "Error", message: "Database deletion error" });
      }

      if (delResult.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "Not Found", message: "Project not found" });
      }

      // 3) remove upload file (best-effort, non-blocking)
      try {
        tryRemoveUploadFile(file_name);
      } catch (fileErr) {
        // log only — do not fail the request because file removal failed
        console.error("File removal error:", fileErr);
      }

      return res.status(200).json({
        status: "Success",
        message: "Project and its details deleted",
      });
    });
  });
};

exports.deleteProjectDetail = async (req, res) => {
  const detailId = Number(req.params.id);
  if (!detailId || Number.isNaN(detailId)) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid detail id" });
  }

  const query = "DELETE FROM project_details WHERE id = ?";
  db.query(query, [detailId], (err, result) => {
    if (err) {
      console.error("DB delete detail error:", err);
      return res
        .status(500)
        .json({ status: "Error", message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "Not Found", message: "Project detail not found" });
    }
    return res
      .status(200)
      .json({ status: "Success", message: "Project detail deleted" });
  });
};

exports.deleteGalleryImage = (req, res) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ status: "Error", message: "Invalid id" });
  }

  // 1) get file_name
  const selectQ = "SELECT file_name FROM gallery WHERE id = ?";
  db.query(selectQ, [id], (selErr, selRows) => {
    if (selErr) {
      console.error("DB select error:", selErr);
      return res
        .status(500)
        .json({ status: "Error", message: "Database error" });
    }
    if (!selRows || selRows.length === 0) {
      return res
        .status(404)
        .json({ status: "Not Found", message: "Image not found" });
    }

    const file_name = selRows[0].file_name;

    // 2) delete row
    const delQ = "DELETE FROM gallery WHERE id = ?";
    db.query(delQ, [id], (delErr, delRes) => {
      if (delErr) {
        console.error("DB delete error:", delErr);
        return res
          .status(500)
          .json({ status: "Error", message: "Database deletion error" });
      }
      if (delRes.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "Not Found", message: "Image not found" });
      }

      // 3) remove file (best-effort)
      tryRemoveUploadFile(file_name);

      return res
        .status(200)
        .json({ status: "Success", message: "Image deleted" });
    });
  });
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const query = "DELETE FROM certificate WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Delete error: ", err);
        return res.status(500).json({ error: "Database delete issue" });
      }

      // ✅ If no record found
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({
        status: "Success",
        message: "Certificate deleted successfully",
      });
    });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: "Server side issue" });
  }
};

// ================================

// ###### School Project Posting APIs ######

function trySchoolRemoveUploadFile(fileUrl) {
  try {
    if (!fileUrl) return;
    const uploadsMarker = "/schoolUpload/";
    const idx = fileUrl.indexOf(uploadsMarker);
    if (idx === -1) return;

    const filename = fileUrl.slice(idx + uploadsMarker.length);
    const safeFilename = path.basename(filename);
    const uploadPath = path.join(__dirname, "..", "schoolUpload", safeFilename);

    if (fs.existsSync(uploadPath)) {
      fs.unlinkSync(uploadPath);
    }
  } catch (err) {
    console.error("Error removing upload file:", err);
  }
}

exports.deleteSchoolGalleryImage = (req, res) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ status: "Error", message: "Invalid id" });
  }

  // 1) get file_name
  const selectQ = "SELECT file_name FROM school_gallery WHERE id = ?";
  db.query(selectQ, [id], (selErr, selRows) => {
    if (selErr) {
      console.error("DB select error:", selErr);
      return res
        .status(500)
        .json({ status: "Error", message: "Database error" });
    }
    if (!selRows || selRows.length === 0) {
      return res
        .status(404)
        .json({ status: "Not Found", message: "Image not found" });
    }

    const file_name = selRows[0].file_name;

    // 2) delete row
    const delQ = "DELETE FROM school_gallery WHERE id = ?";
    db.query(delQ, [id], (delErr, delRes) => {
      if (delErr) {
        console.error("DB delete error:", delErr);
        return res
          .status(500)
          .json({ status: "Error", message: "Database deletion error" });
      }
      if (delRes.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "Not Found", message: "Image not found" });
      }

      // 3) remove file (best-effort)
      trySchoolRemoveUploadFile(file_name);

      return res
        .status(200)
        .json({ status: "Success", message: "Image deleted" });
    });
  });
};

exports.deleteSchoolNewsEvents = (req, res) => {
  const projectId = Number(req.params.id);
  if (!projectId || Number.isNaN(projectId)) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid News Events id" });
  }

  const selectQuery = "SELECT file_name FROM school_news_events WHERE id = ?";
  db.query(selectQuery, [projectId], (selErr, selRows) => {
    if (selErr) {
      console.error("Select error:", selErr);
      return res
        .status(500)
        .json({ status: "Error", message: "Database error" });
    }

    if (!selRows || selRows.length === 0) {
      return res
        .status(404)
        .json({ status: "Not Found", message: "Project not found" });
    }

    const file_name = selRows[0].file_name;

    const deleteQuery = "DELETE FROM school_news_events WHERE id = ?";
    db.query(deleteQuery, [projectId], (delErr, delResult) => {
      if (delErr) {
        console.error("Delete error:", delErr);
        return res
          .status(500)
          .json({ status: "Error", message: "Database deletion error" });
      }

      if (delResult.affectedRows === 0) {
        return res
          .status(404)
          .json({ status: "Not Found", message: "News Events not found" });
      }

      try {
        trySchoolRemoveUploadFile(file_name);
      } catch (fileErr) {
        console.error("File removal error:", fileErr);
      }

      return res.status(200).json({
        status: "Success",
        message: "News Events deleted",
      });
    });
  });
};

exports.deleteSchoolNotice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Notice ID is required" });
    }

    const query = "DELETE FROM school_notice WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Notice delete nahi ho raha hai: ", err);
        return res.status(500).json({ error: "Database ka issue hai" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Notice not found" });
      }

      res.status(200).json({
        status: "Success",
        message: "Notice deleted successfully",
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server side ka issue hai" });
  }
};
