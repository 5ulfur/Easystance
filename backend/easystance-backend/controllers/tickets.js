const { Op } = require("sequelize");
const Tickets = require("../models/Tickets");
const Customers = require("../models/Customers");

exports.getTicket = async (req, res) => {
  const id = parseInt(req.query.id);

  try {
    const ticket = await Tickets.findOne({ where: { id } });
    if (ticket) {

      if (req.user.role === "customer" && req.user.id !== ticket.customerId) {
        return res.status(401).json({ error: "Autorizzazione negata!" });
      }

      if (req.user.role === "technician" && req.user.id !== ticket.technicianId) {
        return res.status(401).json({ error: "Autorizzazione negata!" });
      }

      res.json({ ticket });
    } else {
      return res.status(404).json({ error: "Nessun ticket con questo id!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Errore del server!" });
  }
};

exports.listTickets = async (req, res) => {
  const { page, limit, filters } = req.body;
  const offset = (page - 1) * limit;

  try {
    const where = {};
    
    if (req.user.role === "customer") {
      where.customerId = req.user.id;
    } else if (req.user.role === "technician") {
      where.technicianId = req.user.id;
    }

    if (filters.word) {
      where.subject = { [Op.like]: `%${filters.word}%` };
    }

    if (filters.category && filters.category.length > 0) {
      where.category = { [Op.in]: filters.category };
    }

    if (filters.priority && filters.priority.length > 0) {
      where.priority = { [Op.in]: filters.priority };
    }

    if (filters.status && filters.status.length > 0) {
      where.status = { [Op.in]: filters.status };
    }
    
    const { rows: tickets, count } = await Tickets.findAndCountAll({
      where,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      tickets: tickets,
      hasMore: offset + tickets.length < count
    });
  } catch (error) {
    return res.status(500).json({ error: "Errore del server!" });
  }
};

exports.createTicket = async (req, res) => {
  const { ticket } = req.body;

  try {
    if (req.user.role !== "operator" && req.user.role !== "administrator") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const customer = await Customers.findOne({ where: { email: ticket.customerEmail } });

    if (!customer) {
      return res.status(404).json({ error: "Cliente non esistente!" });
    }

    const newTicket = await Tickets.create({
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: "open",
      customerId: customer.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ ticketId: newTicket.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
};