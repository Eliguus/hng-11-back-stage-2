const express = require("express")
const indexRouter = express.Router()
const userController = require("../controllers/userController")
indexRouter.post("/auth/register", userController.registerUser)
indexRouter.post("/auth/login", userController.loginUser)
module.exports = indexRouter