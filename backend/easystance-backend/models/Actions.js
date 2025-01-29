const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Actions = sequelize.define("Actions", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Employees",
            key: "id"
        }
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Tickets",
            key: "id"
        }
    },
    category: {
        type: DataTypes.ENUM("assignation", "edit", "call", "repair", "document"),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Actions;