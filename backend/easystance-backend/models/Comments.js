const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comments = sequelize.define("Comments", {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Comments;