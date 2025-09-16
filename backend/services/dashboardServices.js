const pool = require("../config/db");

/**
 * Get overdue todos for a single user
 */
const getOverdueTodos = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
       t.id AS todo_id,
       t.title,
       t.due_at,
       u.name AS assignee_name,
       p.name AS project_name
     FROM todos t
     LEFT JOIN users u ON t.assignee_id = u.id
     INNER JOIN projects p ON t.project_id = p.id
     WHERE t.completed_at IS NULL
       AND t.due_at < NOW()
       AND t.assignee_id = ?
     ORDER BY t.due_at ASC`,
    [userId]
  );
  return rows;
};

/**
 * Get projects that have no todos
 */
const getProjectsNoTodos = async () => {
  const [rows] = await pool.query(
    `SELECT p.id AS project_id, p.name AS project_name
     FROM projects p
     LEFT JOIN todos t ON p.id = t.project_id
     WHERE t.id IS NULL`
  );
  return rows;
};

/**
 * Get non-closed todo count for a single user
 
 */
const getAssignedNonClosedCount = async (userId) => {
  const [rows] = await pool.query(
    `SELECT COUNT(t.id) AS non_closed_count
     FROM todos t
     LEFT JOIN status s ON t.status_id = s.id
     WHERE t.assignee_id = ?
       AND s.is_closed = FALSE`,
    [userId]
  );
  return rows[0]; // single object with count
};

module.exports = {
  getOverdueTodos,
  getProjectsNoTodos,
  getAssignedNonClosedCount,
};
