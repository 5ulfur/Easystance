const { Op } = require("sequelize");
const { models } = require("../models");

async function addAction(employeeId, ticketId, category, description) {
  const action = await models.Actions.create({
    employeeId,
    ticketId,
    category,
    description,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return action;
}

exports.getTicket = async (req, res) => {
  const id = parseInt(req.query.id);

  try {
    let include = [];
    
    if (req.user.role === "operator" || req.user.role === "administrator" || req.user.role === "technician") {
      include = [
        {
          model: models.Employees,
          as: "technician",
          attributes: ["name", "surname", "email"]
        }
      ]
    }

    const ticket = await models.Tickets.findOne({
      where: { id },
      include
    });

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
    console.error(error);
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
    
    const { rows: tickets, count } = await models.Tickets.findAndCountAll({
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
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
};

exports.createTicket = async (req, res) => {
  const { ticket } = req.body;

  try {
    if (req.user.role !== "operator" && req.user.role !== "administrator") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const customer = await models.Customers.findOne({ where: { email: ticket.customerEmail } });

    if (!customer) {
      return res.status(404).json({ error: "Cliente non esistente!" });
    }

    let technicianId = null;
    if (ticket.technicianEmail) {
      const technician = await models.Employees.findOne({ where: { email: ticket.technicianEmail } });

      if (!technician) {
        return res.status(404).json({ error: "Tecnico non esistente!" });
      }

      technicianId = technician.id;
    }

    const newTicket = await models.Tickets.create({
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: "open",
      customerId: customer.id,
      technicianId: technicianId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await addAction(req.user.id, newTicket.id, "edit", "Ticket creato.");

    res.json({ ticketId: newTicket.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
};

exports.editTicket = async (req, res) => {
  const id = parseInt(req.query.id);
  const edits = req.body;

  try {
    if (req.user.role !== "operator" && req.user.role !== "administrator") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const ticket = await models.Tickets.findByPk(id);

    let newActionDescription = ""

    if (ticket) {
      Object.keys(edits).forEach((key) => {
        if (edits[key] !== undefined) {
          ticket[key] = edits[key];

          newActionDescription = [key] + " changed to " + edits[key];
        }
      });
      ticket["updatedAt"] = new Date();
      await ticket.save();

      addAction(req.user.id, id, "edit", newActionDescription);

      res.json({ message: "Ticket aggiornato!" });
    } else {
      return res.status(404).json({ error: "Nessun ticket con questo id!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
};

exports.getTicketComments = async (req, res) => {
  const { id, page, limit } = req.body;
  const offset = (page - 1) * limit;

  try {
    const ticket = await models.Tickets.findOne({ where: { id } });

    if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    if (req.user.role === "technician" && req.user.id !== ticket.technicianId) {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const { rows: comments, count } = await models.Comments.findAndCountAll({
      where: { ticketId: id },
      include: [
        {
          model: models.Employees,
          as: "employee",
          attributes: ["name", "surname", "email"]
        }
      ],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      comments,
      hasMore: offset + comments.length < count
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
}

exports.createTicketComment = async (req, res) => {
  const { id, comment } = req.body;

  try {
    if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const ticket = await models.Tickets.findOne({ where: { id } });

    if (req.user.role === "technician" && req.user.id !== ticket.technicianId) {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const newComment = await models.Comments.create({
      employeeId: req.user.id,
      ticketId: id,
      description: comment,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ id: newComment.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
};

exports.getTicketActions = async (req, res) => {
  const { id, page, limit } = req.body;
  const offset = (page - 1) * limit;

  try {
    const ticket = await models.Tickets.findOne({ where: { id } });

    if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    if (req.user.role === "technician" && req.user.id !== ticket.technicianId) {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const { rows: actions, count } = await models.Actions.findAndCountAll({
      where: { ticketId: id },
      include: [
        {
          model: models.Employees,
          as: "employee",
          attributes: ["name", "surname", "email"]
        }
      ],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      actions,
      hasMore: offset + actions.length < count
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
}

exports.createTicketAction = async (req, res) => {
  const { id, action } = req.body;

  try {
    if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const ticket = await models.Tickets.findOne({ where: { id } });

    if (req.user.role === "technician" && req.user.id !== ticket.technicianId) {
      return res.status(401).json({ error: "Autorizzazione negata!" });
    }

    const newAction = addAction(req.user.id, id, action.category, action.description);

    res.json({ id: newAction.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore del server!" });
  }
};