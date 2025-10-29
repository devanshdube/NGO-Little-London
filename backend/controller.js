const { db } = require("./connect");

exports.postData = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const values = [name, email, phone, subject, message];

    const query =
      "INSERT INTO emply (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";

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

exports.getData = async (req, res) => {
  const query = "SELECT * FROM emply";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Data fetch karne mein error: ", err);
      return res.status(500).json({ error: "Database fetch ka issue hai" });
    }
    res.status(200).json({ status: "Success", data: results });
  });
};

exports.updateData = async (req, res) => {
  const { id } = req.params;
  const { name, department, salary } = req.body;
  const query = `UPDATE emply SET name = ?, department = ?, salary = ? WHERE id = ?`;
  const values = [name, department, salary, id];
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Data update karne mein error: ", err);
      return res.status(500).json({ error: "Database update ka issue hai" });
    }
    res.status(200).json({
      status: "Success",
      message: "Data updated successfully",
      data: result,
    });
  });
};

exports.deleteData = async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM emply WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Data delete karne mein error: ", err);
      return res.status(500).json({ error: "Database delete ka issue hai" });
    }
    res.status(200).json({
      status: "Success",
      message: "Data deleted successfully",
      data: result,
    });
  });
};
