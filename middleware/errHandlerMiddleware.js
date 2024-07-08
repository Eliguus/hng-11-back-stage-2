const errorHandler = (res, status, message, statusCode) => {
	return res.status(statusCode).json({
		status,
		message,
		statusCode,
	});
};

module.exports = { errorHandler };