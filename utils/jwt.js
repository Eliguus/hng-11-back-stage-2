const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };