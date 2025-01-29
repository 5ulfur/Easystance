const Employees = require("../models/Employees");
const Customers = require("../models/Customers");
const bcrypt = require("bcrypt");


exports.getUserData = async (req, res) => {
    const id = parseInt(req.user.id);
    const role = req.user.role;
    let data;

    try {
        if (role === "customer") {
            data = await Customers.findOne({ where: { id } });
        } else {
            data = await Employees.findOne({ where: { id } });
        }
        
        if (data) {
            res.json({ data });
        } else {
            return res.status(404).json({ error: "Utente non trovato" });
        }

    } catch (error) {
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
            data = await Customers.findByPk( id );
        } else {
            data = await Employees.findByPk( id );
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
            user = await Customers.findByPk( id );
        } else {
            user = await Employees.findByPk( id );
        }

        if (!user) {
            return res.status(404).json({ error: "Dipendente non trovato" });
        }

        const hashedPassword = await bcrypt.hash(insertPassword, /*inserire numero di sali*/ );
        console.log("password inserita:", hashedPassword);
        console.log("password vecchia:", user.password);

        const isPasswordCorrect = await bcrypt.compare(hashedPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Email o password non validi!" });
        } else {
            await data.update (
                {
                    password: password2,
                    updateAt: new Date ()
                },
                { where: { id } }
            );

            res.status(200).json({ message: "Password aggiornata con successo" });
        }
        
    } catch (error) {
        return res.status(500).json({ error: "Errore del server!" });
    }
};

/*exports.deleteProfile = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ error: "Errore del server!" });
    }
};*/