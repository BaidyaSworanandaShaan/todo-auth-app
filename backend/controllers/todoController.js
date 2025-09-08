const pool = require("../config/db");

const createTodoController = async (req, res) => {
  const { title, description, due_date, status } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO todos (user_id, title, description, due_date,status) VALUES (?, ?, ?, ?,?)",
      [userId, title, description || null, due_date || null, status]
    );

    const newTodoId = result.insertId;

    res.status(201).json({
      message: "Todo created successfully",
      todo: {
        id: newTodoId,
        user_id: userId,
        title,
        description,
        due_date,
        status: "pending",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllTodoController = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query("SELECT * FROM todos WHERE user_id = ?", [
      userId,
    ]);

    res.status(200).json({
      success: true,
      todos: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleTodoController = async (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      success: true,
      todo: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTodoController = async (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;

  try {
    const [result] = await pool.query(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTodoController = async (req, res) => {
  const userId = req.user.id;
  const todoId = req.params.id;
  const { title, description, due_date, status } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [todoId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updatedTodo = {
      title: title || rows[0].title,
      description: description || rows[0].description,
      due_date: due_date || rows[0].due_date,
      status: status || rows[0].status,
    };

    await pool.query(
      "UPDATE todos SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?",
      [
        updatedTodo.title,
        updatedTodo.description,
        updatedTodo.due_date,
        updatedTodo.status,
        todoId,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: { id: todoId, user_id: userId, ...updatedTodo },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTodoController,
  getAllTodoController,
  getSingleTodoController,
  deleteTodoController,
  updateTodoController,
};
