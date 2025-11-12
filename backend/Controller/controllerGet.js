const { db } = require("./../connect");
const cache = require("../config/cache");

exports.getEmployees = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const q = req.query.q || "";
    const status = req.query.status || "active";

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: "Limit must be between 1-100" });
    }

    if (offset < 0) {
      return res.status(400).json({ error: "Offset must be >= 0" });
    }

    if (q.length > 100) {
      return res.status(400).json({ error: "Search query too long" });
    }

    // ✅ Cache key
    const cacheKey = `employees:${limit}:${offset}:${q}:${status}`;

    // ✅ Cache check
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("✅ Data from cache");
      return res.status(200).json({ status: "Success", data: cachedData });
    }

    // ✅ Build SQL
    let sql = `
      SELECT id, name, f_name, mobile, email, designation, dob, aadhar,
             address, city, status, user_profile
      FROM employee 
      WHERE status = ?
    `;

    const params = [status];

    if (q) {
      sql += `
        AND (name LIKE ? OR email LIKE ? OR mobile LIKE ?)
      `;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    sql += `
      ORDER BY id DESC
      LIMIT ?
      OFFSET ?
    `;

    params.push(limit, offset);

    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      // ✅ Save to cache
      cache.set(cacheKey, results);

      res.status(200).json({ status: "Success", data: results });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPaymentTransactions = async (req, res) => {
  try {
    const query = "SELECT * FROM payment ORDER BY id DESC";

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "Payment transactions fetched successfully",
        count: results.length,
        data: results,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID is required in URL.",
      });
    }

    // SQL query for single user
    const query = `SELECT * FROM employee WHERE id = ?`;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred.",
          error: err.message,
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          status: "Failure",
          message: "User not found.",
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "User fetched successfully.",
        data: results[0], // return only one user
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    // const query = `SELECT * FROM employee WHERE designation = 'Employee' ORDER BY id DESC `;
    const query = `SELECT * FROM employee ORDER BY id DESC `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "All User fetched successfully",
        count: results.length,
        data: results,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllTeam = async (req, res) => {
  try {
    const query = `SELECT * FROM employee WHERE designation = 'Employee' ORDER BY id DESC `;
    // const query = `SELECT * FROM employee ORDER BY id DESC `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "All User fetched successfully",
        count: results.length,
        data: results,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const query = `SELECT * FROM employee WHERE designation = 'Admin' ORDER BY id DESC `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "All User fetched successfully",
        count: results.length,
        data: results,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const query = `
      SELECT
        p.id AS project_id,
        p.title,
        p.file_name,
        p.created_at AS project_created_at,
        p.updated_at AS project_updated_at,
        pd.id AS detail_id,
        pd.project_description,
        pd.status,
        pd.created_at AS detail_created_at,
        pd.updated_at AS detail_updated_at
      FROM project p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.created_at DESC, pd.created_at ASC
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error("DB query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      const projectsMap = new Map();
      rows.forEach((r) => {
        if (!projectsMap.has(r.project_id)) {
          projectsMap.set(r.project_id, {
            project_id: r.project_id,
            title: r.title,
            file_name: r.file_name || null,
            created_at: r.project_created_at,
            updated_at: r.project_updated_at,
            details: [],
          });
        }

        if (r.detail_id) {
          projectsMap.get(r.project_id).details.push({
            detail_id: r.detail_id,
            project_description: r.project_description,
            status: r.status,
            created_at: r.detail_created_at,
            updated_at: r.detail_updated_at,
          });
        }
      });

      const projects = Array.from(projectsMap.values());
      return res.status(200).json({
        status: "Success",
        count: projects.length,
        projects,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "project_id is required" });

    const query = `
      SELECT
        p.id AS project_id,
        p.title,
        p.file_name,
        p.created_at AS project_created_at,
        p.updated_at AS project_updated_at,
        pd.id AS detail_id,
        pd.project_description,
        pd.status,
        pd.created_at AS detail_created_at,
        pd.updated_at AS detail_updated_at
      FROM project p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      WHERE p.id = ?
      ORDER BY pd.created_at ASC
    `;

    db.query(query, [id], (err, rows) => {
      if (err) {
        console.error("DB query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ status: "Not Found", message: "Project not found" });
      }

      const first = rows[0];
      const project = {
        project_id: first.project_id,
        title: first.title,
        file_name: first.file_name || null,
        created_at: first.project_created_at,
        updated_at: first.project_updated_at,
        details: [],
      };

      rows.forEach((r) => {
        if (r.detail_id) {
          project.details.push({
            detail_id: r.detail_id,
            project_description: r.project_description,
            status: r.status,
            created_at: r.detail_created_at,
            updated_at: r.detail_updated_at,
          });
        }
      });

      return res.status(200).json({ status: "Success", project });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getApprovedProjects = async (req, res) => {
  try {
    const query = `
      SELECT
        p.id AS project_id,
        p.title,
        p.file_name,
        p.created_at AS project_created_at,
        p.updated_at AS project_updated_at,
        pd.id AS detail_id,
        pd.project_description,
        pd.status,
        pd.created_at AS detail_created_at,
        pd.updated_at AS detail_updated_at
      FROM project p
      INNER JOIN project_details pd 
        ON p.id = pd.project_id 
        AND pd.status = 'Approve'
      ORDER BY p.created_at DESC, pd.created_at ASC
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error("DB query error:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      const projectsMap = new Map();
      rows.forEach((r) => {
        if (!projectsMap.has(r.project_id)) {
          projectsMap.set(r.project_id, {
            project_id: r.project_id,
            title: r.title,
            file_name: r.file_name || null,
            created_at: r.project_created_at,
            updated_at: r.project_updated_at,
            details: [],
          });
        }

        projectsMap.get(r.project_id).details.push({
          detail_id: r.detail_id,
          project_description: r.project_description,
          status: r.status,
          created_at: r.detail_created_at,
          updated_at: r.detail_updated_at,
        });
      });

      const projects = Array.from(projectsMap.values());
      return res.status(200).json({
        status: "Success",
        count: projects.length,
        projects,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGalleryImages = (req, res) => {
  const query = "SELECT * FROM gallery ORDER BY created_at DESC";
  db.query(query, (err, rows) => {
    if (err) {
      console.error("DB gallery select error:", err);
      return res
        .status(500)
        .json({ status: "Error", message: "Database error" });
    }
    return res.status(200).json({
      status: "Success",
      count: Array.isArray(rows) ? rows.length : 0,
      images: rows || [],
    });
  });
};

exports.getAllQuerys = async (req, res) => {
  try {
    const query = `SELECT * FROM contact ORDER BY id DESC `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "All Querys fetched successfully",
        count: results.length,
        data: results,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const query = "SELECT * FROM certificate ORDER BY id DESC";

    db.query(query, (err, result) => {
      if (err) {
        console.error("Fetch error: ", err);
        return res.status(500).json({ error: "Database fetch issue" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No certificates found" });
      }

      res.status(200).json({
        status: "Success",
        count: result.length,
        data: result,
      });
    });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: "Server side issue" });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const query = "SELECT * FROM certificate WHERE id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Fetch by ID error: ", err);
        return res.status(500).json({ error: "Database fetch issue" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.status(200).json({
        status: "Success",
        data: result[0],
      });
    });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: "Server side issue" });
  }
};
