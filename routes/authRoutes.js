const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post(
	"/register",
	[
		body("firstName")
			.trim()
			.notEmpty()
			.withMessage("First name is required"),
		body("lastName").trim().notEmpty().withMessage("Last name is required"),
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required")
			.bail()
			.isEmail()
			.withMessage("Please enter a valid email.")
			.normalizeEmail(),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("Password is required")
			.bail()
			.isLength({ min: 5 })
			.withMessage("Minimum password length is 5"),
	],
	register
);
router.post(
	"/login",
	[
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required")
			.bail()
			.isEmail()
			.withMessage("Please enter a valid email.")
			.normalizeEmail(),
		body("password").trim().notEmpty().withMessage("Password is required"),
	],
	login
);

module.exports = router;