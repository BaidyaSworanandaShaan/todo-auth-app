const pool = require("../config/db");

async function createTodo(userId, { title, description, due_date, status }) {
  if (!title) {
    throw new Error("Title is required");
  }

  const [result] = await pool.query(
    "INSERT INTO todos (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)",
    [userId, title, description || null, due_date || null, status || "pending"]
  );

  return {
    id: result.insertId,
    user_id: userId,
    title,
    description,
    due_date,
    status: status || "pending",
  };
}

async function getAllTodos(userId) {
  const [rows] = await pool.query("SELECT * FROM todos WHERE user_id = ?", [
    userId,
  ]);
  return rows;
}

async function getSingleTodo(userId, todoId) {
  const [rows] = await pool.query(
    "SELECT * FROM todos WHERE id = ? AND user_id = ?",
    [todoId, userId]
  );
  if (rows.length === 0) {
    throw new Error("Todo not found");
  }
  return rows[0];
}

async function deleteTodo(userId, todoId) {
  const [result] = await pool.query(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [todoId, userId]
  );
  if (result.affectedRows === 0) {
    throw new Error("Todo not found");
  }
  return true;
}

async function updateTodo(
  userId,
  todoId,
  { title, description, due_date, status }
) {
  const [rows] = await pool.query(
    "SELECT * FROM todos WHERE id = ? AND user_id = ?",
    [todoId, userId]
  );

  if (rows.length === 0) {
    throw new Error("Todo not found");
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

  return { id: todoId, user_id: userId, ...updatedTodo };
}

module.exports = {
  createTodo,
  getAllTodos,
  getSingleTodo,
  deleteTodo,
  updateTodo,
};
