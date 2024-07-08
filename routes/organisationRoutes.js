const express = require("express");
const {
	createOrganisation,
	getUserOrganisations,
	getOrganisationById,
	addUserToOrganisation,
} = require("../controllers/organisationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", createOrganisation);
router.get("/", getUserOrganisations);
router.get("/:orgId", getOrganisationById);
router.post("/:orgId/users", addUserToOrganisation);

module.exports = router;