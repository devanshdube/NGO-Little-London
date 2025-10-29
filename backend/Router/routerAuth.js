const express = require("express");
const { register, login } = require("../Controller/controllerAuth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;

// # URL Source
// register : http://localhost:5555/auth/api/ngo/login/register
// login : http://localhost:5555/auth/api/ngo/login/login
