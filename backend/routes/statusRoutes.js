const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");

const { getStatusController } = require("../controllers/statusController");

const router = express.Router();

router.get("/", authMiddleware, getStatusController);

module.exports = router;
