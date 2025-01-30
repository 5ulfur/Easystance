const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("RevokedTokens", {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
};