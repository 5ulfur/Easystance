const { Op } = require("sequelize");
const { models } = require("../models");

exports.listComponents = async (req, res) => {
    const { page, limit, filters } = req.body;
    const offset = (page - 1) * limit;
  
    try {
        const where = {};

        if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }
        
        if (filters.word) {
            where.name = { [Op.like]: `%${filters.word}%` };
        }

        where.quantity = { [Op.between]: [filters.quantity.min, filters.quantity.max] };
      
        const { rows: components, count } = await models.Components.findAndCountAll({
            where,
            limit: limit,
            offset: offset,
            order: [["name", "ASC"]]
        });
  
        res.json({
            components,
            hasMore: offset + components.length < count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};