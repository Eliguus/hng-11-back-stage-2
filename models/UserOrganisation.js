const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserOrganisation = sequelize.define(
	"UserOrganisation",
	{
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		orgId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = UserOrganisation;