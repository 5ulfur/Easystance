const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customers = require("../models/Customers");
const Employees = require("../models/Employees");
const RevokedTokens = require("../models/RevokedTokens");

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token mancante!" });
    }

    try {
        const token = authHeader.split(" ")[1];

        const isTokenRevoked = await RevokedTokens.findOne({ where: { token } });
        if (isTokenRevoked) {
            return res.status(401).json({ error: "Token non valido!" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token non valido!" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Customers.findOne({ where: { email } });
        let role = "customer";
        if (!user) {
            user = await Employees.findOne({ where: {email} });
            if (user) {
                role = user.role;
            } else {
                return res.status(401).json({ error: "Email o password non validi!" });
            }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Email o password non validi!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role }, process.env.JWT_SECRET, { expiresIn: "12h" });
        res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.logout = async (req, res) => {
    try {
        await RevokedTokens.create({ token });
        res.json({ message: "Logout effettuato!" });
    } catch (error) {
        return res.status(401).json({ error: "Errore del server!" });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        res.json({ message: "Autorizzato!" });
    } catch (error) {
        return res.status(401).json({ error: "Token non valido!" });
    }
};