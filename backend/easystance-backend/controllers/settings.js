const Employees = require("../models/Employees");
const Customers = require("../models/Customers");
const db = require("../config/database");
const bcrypt = require("bcrypt");


exports.getUserData = async (req, res) => {
    /*const id = parseInt(req.query.id);

    if (!req.query.id) {
        return res.status(400).json({ error: "ID non fornito" });
    }/*

    const { id } = req.query;
    console.log("ID ricevuto:", id); 
    
    const numericId = parseInt(id, 10);
    console.log("ID numerico:", numericId);
    
    /*if (isNaN(numericId)) {
        return res.status(400).json({ error: "ID non valido" });
    }*/

    try {
        const data = await Customers.findOne({ where: { id:numericId } });

        if (data) {
            res.json({ data });
        } else {
            return res.status(404).json({ error: "Utente non trovato" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Errore del server!" });
    }

    /*const userId = req.Customers.id; 
    const user = await Customers.findByPk(userId);

    if (user) {
        res.json({
            id: Customers.id,
            name: Customers.name,
            surname: Customers.surname,
            email: Customers.email,
            phone: Cust.phone
        });
    } else {
        res.status(404).json({ error: "User not found" });
    }*/
};

/*exports.setEmeil = async (req, res) => {

};

exports.setPassword = async () => {

};

exports.deleteProfile = async () => {

};*/