const { errorHandler } = require("../middleware/errHandlerMiddleware");
const { successHandler } = require("../middleware/successHandlerMiddleware");
const { Organisation, UserOrganisation, User } = require("../models");
const { generateUniqueId } = require("../utils/helpers");

const createOrganisation = async (req, res) => {
	const { name, description } = req.body;

	if (!name) {
		return res
			.status(422)
			.json({ errors: [{ field: "name", message: "Name is required" }] });
	}

	try {
		const organisation = await Organisation.create({
			orgId: generateUniqueId(`${name}-org`),
			name,
			description,
		});

		await UserOrganisation.create({
			userId: req.user.userId,
			orgId: organisation.orgId,
		});

		successHandler(
			res,
			"success",
			"Organisation created successfully",
			201,
			{
				orgId: organisation.orgId,
				name: organisation.name,
				description: organisation.description,
			}
		);
	} catch (error) {
		errorHandler(res, "Bad Request", "Client error", 400);
	}
};

const getUserOrganisations = async (req, res) => {
	try {
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

		successHandler(
			res,
			"success",
			"Organisations fetched successfully",
			200,
			{
				organisations,
			}
		);
	} catch (error) {
		console.log(error?.message);
		errorHandler(res, "Bad Request", "Client error", 400);
	}
};

const getOrganisationById = async (req, res) => {
	const { orgId } = req.params;
	try {
		const organisation = await Organisation.findOne({
			where: { orgId },
			include: [
				{
					model: User,
					attributes: [],
					through: {
						model: UserOrganisation,
						where: { userId: req.user.userId },
						attributes: [],
					},
				},
			],
		});

		if (!organisation) {
			return errorHandler(
				res,
				"Not Found",
				"Organisation not found",
				404
			);
		}

		successHandler(
			res,
			"success",
			"Organisation fetched successfully",
			200,
			organisation
		);
	} catch (error) {
		console.log(error?.message);
		errorHandler(res, "Bad Request", "Client error", 400);
	}
};

const addUserToOrganisation = async (req, res) => {
	const { orgId } = req.params;
	const { userId } = req.body;

	if (!orgId) {
		return errorHandler(
			res,
			"Bad Request",
			"Organisation ID query params is required",
			400
		);
	}

	if (!userId) {
		return res.status(422).json({
			errors: [{ field: "userId", message: "userId is required" }],
		});
	}

	try {
		const userExists = await User.findByPk(userId);
		const orgExists = await Organisation.findByPk(orgId);

		if (!userExists || !orgExists) {
			return errorHandler(
				res,
				"Bad Request",
				"User or Organisation not found",
				404
			);
		}

		const existingAssociation = await UserOrganisation.findOne({
			where: { userId, orgId },
		});

		if (existingAssociation) {
			return errorHandler(
				res,
				"Bad Request",
				"User is already associated with this organisation",
				400
			);
		}

		await UserOrganisation.create({ userId, orgId });
		return res.status(200).json({
			status: "success",
			message: "User added to organisation successfully",
		});
	} catch (error) {
		console.log(error?.message);
		errorHandler(res, "Bad Request", "Client error", 400);
	}
};

module.exports = {
	createOrganisation,
	getUserOrganisations,
	getOrganisationById,
	addUserToOrganisation,
};