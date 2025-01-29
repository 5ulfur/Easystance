const express = require("express");
const { getUserData, setEmail, setPassword, deleteProfile } = require("../controllers/settings");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /settings/data
router.get("/data", verifyToken, getUserData);

// Endpoint: /settings/email
router.post("/email", verifyToken, setEmail);

// Endpoint: /settings/password
router.post("/password", verifyToken, setPassword);

// Endpoint: /settings/delete
//router.post("/delete", verifyToken, deleteProfile);

module.exports = router;