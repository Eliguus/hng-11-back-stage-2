const successHandler = (res, status, message, statusCode, data) => {
	return res.status(statusCode).json({
		status,
		message,
		data,
	});
};

module.exports = { successHandler };