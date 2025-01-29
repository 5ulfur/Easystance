const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActionsComponents = sequelize.define("ActionsComponents", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    actionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Actions",
            key: "id"
        }
    },
    componentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Components",
            key: "id"
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = ActionsComponents;