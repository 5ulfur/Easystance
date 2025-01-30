const { Op, literal } = require("sequelize");
const { models } = require("../models");
const { sendEmail } = require("../services/emailService");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function sendPasswordEmail(email, password) {
    const subject = "Benvenuto in Easystance";
    const content = `<div>
    <p>Il tuo account è stato creato, queste sono le tue nuove credenziali:</p>
    <p>E-mail: ${email}</p>
    <p>Password: ${password}</p>
    <p>Ricorda di cambiare la password al primo accesso.<p>
    </div>`;

    sendEmail(email, subject, content);
}

exports.createCustomer = async (req, res) => {
    const { customer } = req.body;

    try {
        if (req.user.role !== "operator" && req.user.role !== "administrator") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }

        const customerExists = await models.Customers.findOne({ where: { email: customer.email } });
        if (customerExists) {
            return res.status(401).json({ error: "Cliente già registrato con questa email!" });
        }

        const password = crypto.randomBytes(8).toString("hex");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = await models.Customers.create({
            name: customer.name,
            surname: customer.surname,
            email: customer.email,
            phone: customer.phone,
            password: hashedPassword
        });

        sendPasswordEmail(customer.email, password);

        res.json({ id: newCustomer.id, email: newCustomer.email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.listTechnicians = async (req, res) => {
    const { page, limit, filters } = req.body;
    const offset = (page - 1) * limit;

    try {
        const where = { role: "technician" };

        if (req.user.role !== "operator" && req.user.role !== "administrator") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }

        if (filters.word) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.word}%` } },
                { surname: { [Op.like]: `%${filters.word}%` } },
                { email: { [Op.like]: `%${filters.word}%` } }
            ];
        }

        const { rows: technicians, count } = await models.Employees.findAndCountAll({
            attributes: {
                exclude: ["password", "role", "createdAt", "updatedAt"],
                include: [
                    [
                        literal(`(
                            SELECT COUNT(*)
                            FROM Tickets
                            WHERE Tickets.technicianId = Employees.id
                        )`),
                        "assignedTicketsCount"
                    ]
                ]
            },
            where: {
                ...where,
                [Op.and]: [
                    literal(`(
                        SELECT COUNT(*)
                        FROM Tickets
                        WHERE Tickets.technicianId = Employees.id
                    ) BETWEEN ${filters.assignedTickets.min} AND ${filters.assignedTickets.max}`)
                ]
            },
            order: [["name", "ASC"], ["surname", "ASC"]],
            //order: [["assignedTicketsCount", "ASC"]],
            limit,
            offset,
            raw: true
        });

        res.json({
            technicians,
            hasMore: offset + technicians.length < count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};