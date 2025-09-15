const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const {
  createProjectController,
  getProjectController,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", authMiddleware, createProjectController);
router.get("/", authMiddleware, getProjectController);

module.exports = router;
