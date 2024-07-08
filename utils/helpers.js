const generateUniqueId = (value) => {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	return `${value.toLowerCase()}-${timestamp}-${randomString}`;
};

module.exports = { generateUniqueId };