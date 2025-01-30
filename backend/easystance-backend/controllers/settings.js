const { models } = require("../models");
const bcrypt = require("bcrypt");


exports.getUserData = async (req, res) => {
    const id = parseInt(req.user.id);
    const role = req.user.role;
    let data;

    try {
        if (role === "customer") {
            data = await models.Customers.findOne({ where: { id } });
        } else {
            data = await models.Employees.findOne({ where: { id } });
        }
        
        if (data) {
            res.json( {
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone
            });
        } else {
            return res.status(404).json({ error: "Utente non trovato" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.setEmail = async (req, res) => {
    const {email, phone} = req.body;
    const role = req.user.role;
    const id = req.user.id;
    let data;

    try {
        if (role === "customer") {
            data = await models.Customers.findByPk( id );
        } else {
            data = await models.Employees.findByPk( id );
        }

        if (!data) {
            return res.status(404).json({ error: "Dipendente non trovato" });
        }

        if (!email && !phone) {
            return res.status(400).json({ error: "Fornire almeno un dato da aggiornare!" });
        }

        await data.update (
            {
                email: email,
                phone: phone,
                updateAt: new Date ()
            },
            { where: { id } }
        );

        res.status(200).json({ message: "Email o numero aggiornati con successo" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.setPassword = async (req, res) => {
    const {insertPassword, password2} = req.body;
    const role = req.user.role;
    const id = req.user.id;
    let user;

    try {
        if (role === "customer") {
            user = await models.Customers.findByPk( id );
        } else {
            user = await models.Employees.findByPk( id );
        }

        if (!user) {
            return res.status(404).json({ error: "Dipendente non trovato" });
        }

        const isPasswordCorrect = await bcrypt.compare(insertPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "La password che hai inserito non corrisponde alla password che avevi in precedenza!" });
        } else {
            let encryptedPassword = await bcrypt.hash(password2, 10);

            await user.update (
                {
                    password: encryptedPassword,
                    updateAt: new Date ()
                },
                { where: { id } }
            );

            res.status(200).json({ message: "Password aggiornata con successo" });
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.deleteProfile = async (req, res) => {
    const {flag} = req.body;
    const id = req.user.id;
    
    try {
        let user = await models.Customers.findByPk( id );

        if (!user) {
            return res.status(404).json({ error: "Cliente non trovato" });
        }

        await user.update (
            {
                flag: flag,
                updateAt: new Date ()
            },
            { where: { id } }
        );

        res.status(200).json({ message: "Profilo eliminato!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};