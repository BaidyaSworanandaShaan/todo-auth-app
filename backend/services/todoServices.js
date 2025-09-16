const pool = require("../config/db");

async function createTodo(
  userId,
  {
    project_id,
    assignee_id = null,
    status_id,
    title,
    priority = 0,
    estimate_hours = null,
    due_at = null,
    completed_at = null,
    tags = null,
  }
) {
  if (!title) {
    throw new Error("Title is required");
  }
  if (!project_id) {
    throw new Error("Project ID is required");
  }
  if (!status_id) {
    throw new Error("Status ID is required");
  }

  const [result] = await pool.query(
    `INSERT INTO todos 
      (project_id, assignee_id, status_id, title, priority, estimate_hours, created_at, due_at, completed_at, tags) 
     VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
    [
      project_id,
      assignee_id,
      status_id,
      title,
      priority,
      estimate_hours,
      due_at,
      completed_at,
      tags ? JSON.stringify(tags) : null, // store JSON as string
    ]
  );

  return {
    id: result.insertId,
    project_id,
    assignee_id,
    status_id,
    title,
    priority,
    estimate_hours,
    created_at: new Date(),
    due_at,
    completed_at,
    tags,
  };
}

async function getAllTodosForUser(userId) {
  let query = "SELECT * FROM todos WHERE assignee_id = ?";
  const params = [userId];
  const [rows] = await pool.query(query, params);
  return { todos: rows };
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
  getAllTodosForUser,
  getSingleTodo,
  deleteTodo,
  updateTodo,
};
