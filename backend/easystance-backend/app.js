require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const ticketsRoutes = require("./routes/tickets");
const usersRoutes = require("./routes/users");

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
*/
app.use("/tickets", ticketsRoutes);

/*
Endpoints:
/users/technicians/list
*/
app.use("/users", usersRoutes);

sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((error) => console.log("Error: " + error));

sequelize.sync(/*{ force: true }*/).then(() => console.log("Database synced"));

const PORT = process.env.PORT || 4343;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));