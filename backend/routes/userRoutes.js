const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");
const { getAllUserController } = require("../controllers/userController");
const {
  getDashboardStatsController,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getAllUserController);
router.get("/:id/dashboard", authMiddleware, getDashboardStatsController);

module.exports = router;
