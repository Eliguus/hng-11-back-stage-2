require("dotenv").config();
const User = require("../models/User");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(422).json({
                errors: [{
                    field: "email",
                    message: "Invalid email format"
                }]
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            userId: String(uuid.v4()),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                user: {
                    userId: newUser.userId,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                }
            }
        });
    } catch (e) {
        console.error("Error registering user", e);
        res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(422).json({
                errors: [{
                    field: "email",
                    message: "Invalid email format"
                }]
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                status: "Bad request",
                message: "A user with this email doesn't exist here",
                statusCode: 401
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                status: "Bad request",
                message: "Incorrect password. Try again",
                statusCode: 401
            });
        }

        const accessToken = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                }
            }
        });
    } catch (e) {
        console.error("Error logging in user", e);
        res.status(500).json({ message: "Authentication failed" });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: "User not found"
            });
        }
        const { userId, firstName, lastName, email, phone } = user;
        return res.status(200).json({
            status: "User exists",
            message: "User profile found",
            data: {
                userId,
                firstName,
                lastName,
                email,
                phone
            }
        });
    } catch (e) {
        console.error("Error fetching user by ID", e);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserById
};