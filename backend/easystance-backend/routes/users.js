const express = require("express");
const { listTechnicians } = require("../controllers/users");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /users/technicians/list
router.post("/technicians/list", verifyToken, listTechnicians);

module.exports = router;