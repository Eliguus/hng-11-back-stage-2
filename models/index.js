const User = require("./User");
const Organisation = require("./Organisation");
const UserOrganisation = require("./UserOrganisation");

User.belongsToMany(Organisation, {
	through: UserOrganisation,
	foreignKey: "userId",
});

Organisation.belongsToMany(User, {
	through: UserOrganisation,
	foreignKey: "orgId",
});

module.exports = { User, Organisation, UserOrganisation };