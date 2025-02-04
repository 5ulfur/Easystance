const express = require("express");
const { getComponent, listComponents, createComponent, setQuantity } = require("../controllers/warehouse");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /warehouse/component
router.get("/component", verifyToken, getComponent);

// Endpoint: /warehouse/list
router.post("/list", verifyToken, listComponents);

// Endpoint: /warehouse/create
router.post("/create", verifyToken, createComponent);

//Endpoint: /warehouse/quantity
router.patch("/quantity", verifyToken, setQuantity);

module.exports = router;