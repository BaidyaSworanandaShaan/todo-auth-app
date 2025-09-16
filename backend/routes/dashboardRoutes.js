const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");

const {
  getDashboardStatsController,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", authMiddleware, getDashboardStatsController);

module.exports = router;
