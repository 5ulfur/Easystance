const { models } = require("../models");
const { Op } = require("sequelize");

exports.getTicketsStatus = async (req, res) => {
    const role = req.user.role;
  
    try {
      if (role !== "administrator") {
        return res.status(401).json( {error: "Autorizzazione negata!"} );
      }

      const ticketsStatusNotClosed = await models.Tickets.count({ where: { status: { [Op.not]: "closed" } } });
      const ticketsStatusClosed = await models.Tickets.count({ where: { status: "closed" } });
      const allTicketsStatus = ticketsStatusClosed + ticketsStatusNotClosed;
  
      res.json({ ticketsStatusNotClosed, ticketsStatusClosed, allTicketsStatus });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Errore del server!" });
    }
  };

  exports.getTicketsInfo = async (req, res) => {
    const role = req.user.role;

    try {
      if (role !== "administrator") {
        return res.status(401).json( {error: "Autorizzazione negata!"} );
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const createdTicket = await models.Tickets.count({ where: { createdAt: {[Op.gte]: thirtyDaysAgo} } });
      const ticketAction = await models.Actions.count();
      const ticketsComments = await models.Comments.count();
      const tickets = await models.Tickets.count();
      const averageComment = ticketsComments/tickets;
      const averageAction = ticketAction/tickets;

      if (averageAction == 'null' && averageComment == 'null') {
        res.json({ averageComment: 0, averageAction: 0, createdTicket});
      } else {
        res.json({ averageComment, averageAction, createdTicket });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Errore del server!" });
    }
  };

  exports.getWarehouseInfo = async (req, res) => {
    const role = req.user.role;

    try {
      if (role !== "administrator") {
        return res.status(401).json( {error: "Autorizzazione negata!"} );
      }

      const numberItem = await models.Components.count();
      const lastItem = await models.Components.findOne({ order: [["id", "DESC"]] });
      const greaterItem = await models.Components.findOne({ order: [["quantity", "DESC"]] });

      if (numberItem === 0) {
        res.json({ numberItem, lastItem: {name: "magazzino vuoto"}, greaterItem: {name: "magazzino vuoto"}});
      } else {
        res.json({ numberItem, lastItem, greaterItem });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Errore del server!" });
    }
  };