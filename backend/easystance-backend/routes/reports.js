const express = require("express");
const { getTicketsStatus, getTicketsInfo } = require("../controllers/reports");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endopoint: reports/tickets/status
router.get("/tickets/status", verifyToken, getTicketsStatus);

// Endpoint: reports/tickets/info
router.get("/tickets/info", verifyToken, getTicketsInfo);

module.exports = router;