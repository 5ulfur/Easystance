const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Graphs = sequelize.define("Graphs", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("doghnut", "bar", "lines")
    },
    management: {
        type: DataTypes.ENUM("management_ticket", "management_technicians", "management_warehouse"),
        allowNull: false
    }
});

module.exports = Graphs;