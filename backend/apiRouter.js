const express = require("express");
const { postData, getData, updateData, deleteData } = require("./controller");

const router = express.Router();

router.post("/postData", postData);

router.get("/getData", getData);

router.put("/updateData/:id", updateData);

router.delete("/deleteData/:id", deleteData);

module.exports = router;

// URLs
// POST -> http://localhost:5555/test/postData
// GET -> http://localhost:5555/test/getData
// PUT -> http://localhost:5555/test/updateData/:id
// DELETE -> http://localhost:5555/test/deleteData/:id

// explain the request response cycle in a mern application. include react frontend request, express middlewware, node server, and mongodb query process.
