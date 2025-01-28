const Employees = require("../models/Employees");
const Customers = require("../models/Customers");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


exports.getUserData = async (req, res) => {
    const id = parseInt(req.user.id);

    try {
        data = await Customers.findOne({ where: { id } });
        
        if (data) {
            res.json({ data });
        } else {
            return res.status(404).json({ error: "Utente non trovato" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Errore del server!" });
    }
};

/*exports.setEmeil = async (req, res) => {

};

exports.setPassword = async () => {

};

exports.deleteProfile = async () => {

};*/