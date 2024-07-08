const { verifyToken } = require("../utils/jwt");
const { User } = require("../models");
const { errorHandler } = require("./errHandlerMiddleware");

const authenticate = async (req, res, next) => {
	const authorizationHeader = req.headers["authorization"];
	if (!authorizationHeader) {
		return errorHandler(res, "Unauthorized", "No token provided", 401);
	}

	const token = authorizationHeader.replace("Bearer", "").trim();
	try {
		const decoded = verifyToken(token);
		const user = await User.findByPk(decoded.userId);

		if (!user) {
			return errorHandler(res, "Unauthorized", "Invalid token", 401);
		}

		req.user = user;
		next();
	} catch (error) {
		errorHandler(res, "Unauthorized", "Failed to authenticate token", 401);
	}
};

module.exports = { authenticate };