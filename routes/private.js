const express = require("express")
const privateRouter = express.Router()
const userController = require("../controllers/userController")
const orgController = require("../controllers/orgController")
const authMiddleware = require("../utils/authMiddleware")

/* Protected routes */
privateRouter.get("/api/users/:id", authMiddleware, userController.getUserById)
privateRouter.get("/api/organisations/:orgId", authMiddleware, orgController.getOrganisationById)
privateRouter.post("/api/organisations/:orgId/users", authMiddleware, orgController.addUserToOrganisation)
privateRouter.post("/api/organisations", authMiddleware, orgController.createOrganisation)

module.exports = privateRouter