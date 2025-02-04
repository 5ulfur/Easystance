const express = require("express");
const { getTicketsStatus, getTicketsInfo, getWarehouseInfo } = require("../controllers/reports");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endopoint: /reports/tickets/status
router.get("/tickets/status", verifyToken, getTicketsStatus);

// Endpoint: /reports/tickets/info
router.get("/tickets/info", verifyToken, getTicketsInfo);

// Endopoint: /reports/warehouse/info
router.get("/warehouse/info", verifyToken, getWarehouseInfo);

module.exports = router;