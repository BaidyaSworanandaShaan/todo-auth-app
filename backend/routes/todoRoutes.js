const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const {
  createTodoController,
  getAllTodoController,

  deleteTodoController,
  updateTodoStatusController,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/", authMiddleware, createTodoController);

router.get("/", authMiddleware, getAllTodoController);

router.patch("/:id", authMiddleware, updateTodoStatusController);
router.delete("/:id", authMiddleware, deleteTodoController);

module.exports = router;
