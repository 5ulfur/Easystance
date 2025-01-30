const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { models } = require("../models");

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token mancante!" });
    }

    try {
        const token = authHeader.split(" ")[1];

        const isTokenRevoked = await models.RevokedTokens.findOne({ where: { token } });
        if (isTokenRevoked) {
            return res.status(401).json({ error: "Token non valido!" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        let userExists = null;
        if (decodedToken.role === "customer") {
            userExists = await models.Customers.findOne({ where: { id: decodedToken.id, email: decodedToken.email } });
        } else {
            userExists = await models.Employees.findOne({ where: { id: decodedToken.id, email: decodedToken.email } });
        }

        if (userExists) {
            req.user = decodedToken;
            next();
        } else {
            return res.status(401).json({ error: "Token non valido!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Token non valido!" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await models.Customers.findOne({ where: { email } });
        let role = "customer";
        if (!user) {
            user = await models.Employees.findOne({ where: {email} });
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
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.logout = async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token mancante!" });
    }

    try {
        const token = authHeader.split(" ")[1];

        await models.RevokedTokens.create({ token });
        res.json({ message: "Logout effettuato!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        res.json({ message: "Autorizzato!" });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Token non valido!" });
    }
};