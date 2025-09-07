const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const {
  createTodoController,
  getAllTodoController,
  getSingleTodoController,
  deleteTodoController,
  updateTodoController,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/", authMiddleware, createTodoController);

router.get("/", authMiddleware, getAllTodoController);
router.get("/:id", authMiddleware, getSingleTodoController);
router.patch("/:id", authMiddleware, updateTodoController);
router.delete("/:id", authMiddleware, deleteTodoController);

module.exports = router;
