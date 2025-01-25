const express = require("express");
const {getData, setEmail, setPassword, deleteProfile} = require("../controllers/settings");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /settings/data/user
router.get("/settings", verifyToken, getData);

// Endpoint: /settings/data/email
router.post("/settings", verifyToken, setEmail);

// Endpoint: /settings/data/password
router.post("/settings", verifyToken, setPassword);

// Endpoint: /settings/data/delete
router.post("/settings", verifyToken, deleteProfile);

module.exports = router;