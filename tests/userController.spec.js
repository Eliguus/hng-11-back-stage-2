const { describe, it, expect} = require('@jest/globals');
const { registerUser, loginUser, getUserById } = require('../controllers/userController');
const User = require('../models/User');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('validator');

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a user successfully with valid input data', async () => {
            const req = {
                body: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    password: "password123",
                    phone: "1234567890"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockUser = {
                userId: "some-unique-id",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890"
            };

            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            validator.isEmail.mockReturnValue(true);
            User.create.mockResolvedValue(mockUser);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: "success",
                message: "Registration successful",
                data: {
                    user: mockUser
                }
            });
        });

        it('should return 422 status code for invalid email format', async () => {
            const req = {
                body: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "invalid-email",
                    password: "password123",
                    phone: "1234567890"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            validator.isEmail.mockReturnValue(false);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                errors: [{
                    field: "email",
                    message: "Invalid email format"
                }]
            });
        });

        it('should handle errors when registering a user', async () => {
            const req = {
                body: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    password: "password123",
                    phone: "1234567890"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            validator.isEmail.mockReturnValue(true);
            //User.create.mockRejectedValue(new Error('Database error'));

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });

    describe('loginUser', () => {
        it('should login a user successfully with valid credentials', async () => {
            const req = {
                body: {
                    email: "john.doe@example.com",
                    password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockUser = {
                userId: "some-unique-id",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
                password: "hashedPassword"
            };

            validator.isEmail.mockReturnValue(true);
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'Login successful',
                data: {
                    accessToken: 'token',
                    user: {
                        userId: mockUser.userId,
                        firstName: mockUser.firstName,
                        lastName: mockUser.lastName,
                        email: mockUser.email,
                        phone: mockUser.phone,
                    }
                }
            });
        });

        it('should return 422 status code for invalid email format', async () => {
            const req = {
                body: {
                    email: "invalid-email",
                    password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            validator.isEmail.mockReturnValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                errors: [{
                    field: "email",
                    message: "Invalid email format"
                }]
            });
        });

        it('should return 401 status code for non-existent user', async () => {
            const req = {
                body: {
                    email: "john.doe@example.com",
                    password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            validator.isEmail.mockReturnValue(true);
            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: "Bad request",
                message: "A user with this email doesn't exist here",
                statusCode: 401
            });
        });

        it('should return 401 status code for incorrect password', async () => {
            const req = {
                body: {
                    email: "john.doe@example.com",
                    password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockUser = {
                userId: "some-unique-id",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890",
                password: "hashedPassword"
            };

            validator.isEmail.mockReturnValue(true);
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                status: "Bad request",
                message: "Incorrect password. Try again",
                statusCode: 401
            });
        });

        it('should handle errors when logging in a user', async () => {
            const req = {
                body: {
                    email: "john.doe@example.com",
                    password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            validator.isEmail.mockReturnValue(true);
            User.findOne.mockRejectedValue(new Error('Database error'));

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed" });
        });
    });

    describe('getUserById', () => {
        it('should return user details if user exists', async () => {
            const req = {
                params: { id: 'some-unique-id' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockUser = {
                userId: "some-unique-id",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "1234567890"
            };

            User.findByPk.mockResolvedValue(mockUser);

            await getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: "User exists",
                message: "User profile found",
                data: {
                    userId: mockUser.userId,
                    firstName: mockUser.firstName,
                    lastName: mockUser.lastName,
                    email: mockUser.email,
                    phone: mockUser.phone
                }
            });
        });

        it('should return 404 if user not found', async () => {
            const req = {
                params: { id: 'some-unique-id' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            User.findByPk.mockResolvedValue(null);

            await getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: "User not found"
            });
        });

        it('should handle errors when fetching user by id', async () => {
            const req = {
                params: { id: 'some-unique-id' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            User.findByPk.mockRejectedValue(new Error('Database error'));

            await getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });
});