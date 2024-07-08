const { errorHandler } = require("../middleware/errHandlerMiddleware");
const { successHandler } = require("../middleware/successHandlerMiddleware");
const { Organisation, UserOrganisation, User } = require("../models");

const getUserInOrganisation = async (req, res) => {
	const { id } = req.params;
	const { userId } = req.user;

	try {
		const user = await User.findByPk(id, {
			attributes: ["userId", "firstName", "lastName", "email", "phone"],
		});

		if (!user) {
			return errorHandler(res, "Not found", "User not found", 404);
		}

		if (user.userId === userId) {
			return successHandler(
				res,
				"success",
				"User record retrieved successfully",
				200,
				user
			);
		}

		const organisations = await Organisation.findAll({
			include: [
				{
					model: User,
					where: { userId: req.user.userId },
					attributes: [],
					through: {
						attributes: [],
					},
				},
			],
		});

		const isPartOfOrganisation = await UserOrganisation.findOne({
			where: {
				userId: id,
				orgId: organisations.map((org) => org.orgId),
			},
		});

		if (isPartOfOrganisation) {
			return successHandler(
				res,
				"success",
				"User record retrieved successfully",
				200,
				user
			);
		}

		return errorHandler(res, "Bad request", "Client error", 403);
	} catch (error) {
		console.log(error?.message);
		errorHandler(res, "Bad request", "Client error", 400);
	}
};

module.exports = {
	getUserInOrganisation,
};