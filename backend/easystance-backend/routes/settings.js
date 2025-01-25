const express = require("express");
const {getData, getEmail, getPassword, getDelete} = require("../controllers/settings");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /settings/data/user
router.get("/settings", verifyToken, getData);

// Endpoint: /settings/data/email
router.post("/settings", verifyToken, getEmail);

// Endpoint: /settings/data/password
router.post("/settings", verifyToken, getPassword);

// Endpoint: /settings/data/delete
router.post("/settings", verifyToken, getDelete);

module.exports = router;