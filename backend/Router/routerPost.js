const express = require("express");
const { postData } = require("../Controller/controllerPost");

const router = express.Router();

router.post("/postData", postData);

module.exports = router;
