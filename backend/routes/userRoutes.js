const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");
const { getAllUserController } = require("../controllers/userController");

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getAllUserController);

module.exports = router;
