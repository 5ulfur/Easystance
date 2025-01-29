const { Op, literal } = require("sequelize");
const Employees = require("../models/Employees");
const Tickets = require("../models/Tickets");

Employees.hasMany(Tickets, { foreignKey: "technicianId", as: "tickets" });
Tickets.belongsTo(Employees, { foreignKey: "technicianId", as: "technician" });

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

        const { rows: technicians, count } = await Employees.findAndCountAll({
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
        return res.status(500).json({ error: "Errore del server!" });
    }
};