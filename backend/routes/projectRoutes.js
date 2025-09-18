const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const {
  createProjectController,
  getProjectController,
  getProjectWithTodoController,
  getSingleProjectStatsController,
  deleteProjectController,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", authMiddleware, createProjectController);
router.get("/", authMiddleware, getProjectController);
router.get("/:id/stats", authMiddleware, getSingleProjectStatsController);
router.get("/:id/todos", authMiddleware, getProjectWithTodoController);
router.delete("/:id", authMiddleware, deleteProjectController);
module.exports = router;
