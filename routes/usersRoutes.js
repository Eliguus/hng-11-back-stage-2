const express = require("express");
const { getUserInOrganisation } = require("../controllers/usersController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/:id", getUserInOrganisation);

module.exports = router;