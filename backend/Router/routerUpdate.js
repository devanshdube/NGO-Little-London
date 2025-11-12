const express = require("express");
const { updateCertificateStatus } = require("../Controller/controllerUpdate");

const router = express.Router();

router.put("/updateCertificateStatus/:id", updateCertificateStatus);

module.exports = router;
