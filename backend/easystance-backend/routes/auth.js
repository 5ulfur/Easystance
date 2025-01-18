const express = require("express");
const { login, logout, checkAuth } = require("../controllers/auth");

const router = express.Router();

// Endpoint: /auth/login
router.post("/login", login);

// Endpoint: /auth/logout
router.post("/logout", logout);

// Endpoint: /auth/check
router.get("/check", checkAuth);

module.exports = router;