const express = require("express");
const { getTicket, listTickets, createTicket } = require("../controllers/tickets");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /tickets/ticket
router.get("/ticket", verifyToken, getTicket);

// Endpoint: /tickets/list
router.post("/list", verifyToken, listTickets);

//Endpoint: /tickets/create
router.post("/create", verifyToken, createTicket)

module.exports = router;