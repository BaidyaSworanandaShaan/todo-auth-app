const {
  createTodo,
  getAllTodos,
  getSingleTodo,
  deleteTodo,
  updateTodo,
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
    const todoStatus = req.query.status || "all";

    const { todos, count } = await getAllTodos(userId, todoStatus);

    res.status(200).json({ success: true, todos, count });
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

const updateTodoController = async (req, res) => {
  try {
    const updatedTodo = await updateTodo(req.user.id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    res
      .status(error.message === "Todo not found" ? 404 : 500)
      .json({ message: error.message });
  }
};

module.exports = {
  createTodoController,
  getAllTodoController,
  getSingleTodoController,
  deleteTodoController,
  updateTodoController,
};
