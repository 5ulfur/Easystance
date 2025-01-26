const express = require("express");
const { listComponents } = require("../controllers/warehouse");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /warehouse/list
router.post("/list", verifyToken, listComponents);

module.exports = router;