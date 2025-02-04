require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const ticketsRoutes = require("./routes/tickets");
const reportsRoutes = require("./routes/reports");
const settingsRoutes = require("./routes/settings");
const usersRoutes = require("./routes/users");
const warehouseRoutes = require("./routes/warehouse");

const app = express();
app.use(express.json());
app.use(cors());

/*
Endpoints:
/auth/login
/auth/logout
/auth/check
*/
app.use("/auth", authRoutes);

/*
Endpoints:
/tickets/ticket
/tickets/list
/tickets/create
/tickets/edit
/tickets/comments/list
/tickets/comments/create
/tickets/actions/list
/tickets/actions/create
*/
app.use("/tickets", ticketsRoutes);

/*
Endpoint:
/reports/tickets/status
/reports/status
*/
app.use("/reports", reportsRoutes);

/*
Endpoint:
/settings/data
/settings/email
/settings/password
/settings/delete
*/
app.use("/settings", settingsRoutes);

/*
Endpoints:
/users/customers/create
/users/technicians/list
*/
app.use("/users", usersRoutes);

/*
Endpoints:
/warehouse/component
/warehouse/list
/warehouse/create
/warehouse/quantity
*/
app.use("/warehouse", warehouseRoutes);

sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((error) => console.log("Error: " + error));

sequelize.sync(/*{ force: true }*/).then(() => console.log("Database synced"));

const PORT = process.env.PORT || 4343;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));