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
  
      if (ticketsStatusNotClosed && ticketsStatusClosed) {
        res.json({ ticketsStatusNotClosed, ticketsStatusClosed });
      } else {
        return res.status(404).json({ error: "Nessun ticket trovato" });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Errore del server!" });
    }
  };

  exports.getTicketsInfo = async (req, res) => {
    const role = req.user.role

    try {
      if (role !== "administrator") {
        return res.status(401).json( {error: "Autorizzazione negata!"} );
      }

      //const createdTicket = await models.Tickets.count({ where: {} });
      const ticketAction = await models.Actions.count();
      const ticketsComments = await models.Comments.count();
      const tickets = await models.Tickets.count();
      const averageComment = ticketsComments/tickets;
      const averageAction = ticketAction/tickets;

      if (ticketsComments && tickets) {
        res.json({ averageComment, averageAction });
      } else {
        return res.status(404).json({ error: "Informazioni non trovate" });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Errore del server!" });
    }
  }