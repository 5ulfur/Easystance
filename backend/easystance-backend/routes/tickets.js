const express = require("express");
const { getTicket, listTickets, createTicket, editTicket, getTicketComments, createTicketComment, getTicketActions, createTicketAction } = require("../controllers/tickets");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /tickets/ticket
router.get("/ticket", verifyToken, getTicket);

// Endpoint: /tickets/list
router.post("/list", verifyToken, listTickets);

//Endpoint: /tickets/create
router.post("/create", verifyToken, createTicket)

//Endpoint: /tickets/edit
router.patch("/edit", verifyToken, editTicket);

// Endpoint: /tickets/comments/list
router.post("/comments/list", verifyToken, getTicketComments);

// Endpoint: /tickets/comments/create
router.post("/comments/create", verifyToken, createTicketComment);

// Endpoint: /tickets/actions/list
router.post("/actions/list", verifyToken, getTicketActions);

// Endpoint: /tickets/actions/create
router.post("/actions/create", verifyToken, createTicketAction);

module.exports = router;