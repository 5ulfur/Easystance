const express = require("express");
const { getGraphs, getStatus } = require("../controllers/reports");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /reports/status
router.get("/status", verifyToken, getStatus);

module.exports = router;