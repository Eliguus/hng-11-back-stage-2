const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const organisationRoutes = require("./routes/organisationRoutes");
const usersRoutes = require("./routes/usersRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/organisations", organisationRoutes);
app.use("/api/users", usersRoutes);

app.listen(port, async () => {
	try {
		await sequelize.sync({ alter: true });
		console.log(`Server running on port: ${port}`);
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
});

module.exports = { app };