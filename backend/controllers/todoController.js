const {
  createTodo,
  getAllTodosForUser,
  getSingleTodo,
  deleteTodo,
  updateTodoStatus,
} = require("../services/todoServices");

const createTodoController = async (req, res) => {
  try {
    const todo = await createTodo(req.user.id, req.body);
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllTodoController = async (req, res) => {
  try {
    const userId = req.user.id;

    const { todos } = await getAllTodosForUser(userId);

    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleTodoController = async (req, res) => {
  try {
    const todo = await getSingleTodo(req.user.id, req.params.id);
    res.status(200).json({ success: true, todo });
  } catch (error) {
    res
      .status(error.message === "Todo not found" ? 404 : 500)
      .json({ message: error.message });
  }
};

const deleteTodoController = async (req, res) => {
  try {
    await deleteTodo(req.user.id, req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    res
      .status(error.message === "Todo not found" ? 404 : 500)
      .json({ message: error.message });
  }
};

const updateTodoStatusController = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;
    const { status_id } = req.body;

    if (!status_id) {
      return res.status(400).json({ message: "Status ID is required" });
    }

    const updatedTodo = await updateTodoStatus(userId, todoId, status_id);

    res.status(200).json({
      message: "Todo status updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    if (error.message === "Todo not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTodoController,
  getAllTodoController,
  getSingleTodoController,
  deleteTodoController,
  updateTodoStatusController,
};
