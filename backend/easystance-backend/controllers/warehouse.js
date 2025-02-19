const { Op } = require("sequelize");
const { models } = require("../models");

exports.getComponent = async (req, res) => {
    const id = parseInt(req.query.id);

    try {
        if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }

        const component = await models.Components.findByPk(id);

        if (component) {
            res.json({ component });
        } else {
            return res.status(404).json({ error: "Nessun componente con questo id!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.listComponents = async (req, res) => {
    const { page, limit, filters } = req.body;
    const offset = (page - 1) * limit;
  
    try {
        const where = {};

        if (req.user.role !== "operator" && req.user.role !== "administrator" && req.user.role !== "technician") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }

        if (filters.word) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.word}%` } },
                { id: { [Op.like]: `%${filters.word}%` } }
            ];
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

exports.createComponent = async (req, res) => {
    const { component } = req.body;
  
    try {
        if (req.user.role !== "administrator") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }

        const newComponent = await models.Components.create({
            name: component.name,
            quantity: component.quantity,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.json({ id: newComponent.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};

exports.setQuantity = async (req, res) => {
    const id = parseInt(req.query.id);
    const quantity = parseInt(req.query.quantity)

    try {
        if (req.user.role !== "administrator") {
            return res.status(401).json({ error: "Autorizzazione negata!" });
        }

        if (quantity < 0 || quantity > 1000) {
            return res.status(400).json({ error: "Quantità non valida!" });
        }

        const component = await models.Components.findByPk(id);

        if (component) {
            await component.update (
                {
                    quantity,
                    updateAt: new Date()
                }
            );
        } else {
            return res.status(404).json({ error: "Nessun componente con questo id!" });
        }
        
        res.json({ message: "Quantità aggiornata!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Errore del server!" });
    }
};