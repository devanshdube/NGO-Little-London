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
