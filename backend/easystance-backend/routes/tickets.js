const express = require("express");
const { getTicket, list } = require("../controllers/tickets");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /tickets/ticket
router.get("/ticket", verifyToken, getTicket);

// Endpoint: /tickets/list
router.post("/list", verifyToken, list);

module.exports = router;