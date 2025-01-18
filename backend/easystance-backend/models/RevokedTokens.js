const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RevokedTokens = sequelize.define("RevokedTokens", {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = RevokedTokens;