const { db } = require("./../connect");

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
