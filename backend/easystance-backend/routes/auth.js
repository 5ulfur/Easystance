const express = require("express");
const { verifyToken, login, logout, checkAuth } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /auth/login
router.post("/login", login);

// Endpoint: /auth/logout
router.post("/logout", verifyToken, logout);

// Endpoint: /auth/check
router.get("/check", verifyToken, checkAuth);

module.exports = router;