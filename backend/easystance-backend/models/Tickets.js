const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("Tickets", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM("help", "repair", "maintenance"),
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM("low", "medium", "high", "critical"),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("open", "in_progress", "closed"),
            allowNull: false
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Customers",
                key: "id"
            }
        },
        technicianId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Employees",
                key: "id"
            }
        }
    });
};