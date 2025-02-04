const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const Actions = require("./Actions");
const ActionsComponents = require("./ActionsComponents");
const Comments = require("./Comments");
const Components = require("./Components");
const Customers = require("./Customers");
const Employees = require("./Employees");
const RevokedTokens = require("./RevokedTokens");
const Tickets = require("./Tickets");

const models = {
    Actions: Actions(sequelize),
    ActionsComponents: ActionsComponents(sequelize),
    Comments: Comments(sequelize),
    Components: Components(sequelize),
    Customers: Customers(sequelize),
    Employees: Employees(sequelize),
    RevokedTokens: RevokedTokens(sequelize),
    Tickets: Tickets(sequelize)
};

const setupAssociations = () => {
    models.Employees.hasMany(models.Tickets, { foreignKey: "technicianId", as: "ticket" });
    models.Tickets.belongsTo(models.Employees, { foreignKey: "technicianId", as: "technician" });

    models.Customers.hasMany(models.Tickets, { foreignKey: "customerId", as: "ticket" });
    models.Tickets.belongsTo(models.Customers, { foreignKey: "customerId", as: "customer" });

    models.Comments.belongsTo(models.Employees, { foreignKey: "employeeId", as: "employee" });
    models.Employees.hasMany(models.Comments, { foreignKey: "employeeId", as: "comment" });

    models.Actions.belongsTo(models.Employees, { foreignKey: "employeeId", as: "employee" });
    models.Employees.hasMany(models.Actions, { foreignKey: "employeeId", as: "action" });

    models.Comments.belongsTo(models.Tickets, { foreignKey: "ticketId", as: "ticket" });
    models.Tickets.hasMany(models.Comments, { foreignKey: "ticketId", as: "comment" });

    models.Actions.belongsTo(models.Tickets, { foreignKey: "ticketId", as: "ticket" });
    models.Tickets.hasMany(models.Actions, { foreignKey: "ticketId", as: "action" });

    models.ActionsComponents.belongsTo(models.Actions, { foreignKey: "actionId", as: "action" });
    models.Actions.hasMany(models.ActionsComponents, { foreignKey: "actionId", as: "actionsComponents" });
    
    models.ActionsComponents.belongsTo(models.Components, { foreignKey: "componentId", as: "component" });
    models.Components.hasMany(models.ActionsComponents, { foreignKey: "componentId", as: "actionsComponents" });
};

setupAssociations();

module.exports = { sequelize, Sequelize, models };