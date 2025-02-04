const express = require("express");
const { createCustomer, listTechnicians, createEmployee } = require("../controllers/users");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /users/customers/create
router.post("/customers/create", verifyToken, createCustomer);

// Endpoint: /users/technicians/list
router.post("/technicians/list", verifyToken, listTechnicians);

// Endpoint: /users/employee/create
router.post("/employee/create", verifyToken, createEmployee);

module.exports = router;