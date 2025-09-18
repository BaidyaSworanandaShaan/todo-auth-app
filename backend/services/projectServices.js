const pool = require("../config/db");

// Create a new project
const createProject = async ({ name, owner_id, due_date }) => {
  const [result] = await pool.query(
    `INSERT INTO projects (name, owner_id, due_date) VALUES (?, ?, ?)`,
    [name, owner_id, due_date]
  );
  return result.insertId;
};

// Get all projects of a single user
const getAllProjectsOfUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
       p.id AS project_id,
       p.name AS project_name,
       p.due_date AS project_due_date,
       p.created_at AS project_created_at,
       u.id AS owner_id,
       u.name AS owner_name,
       u.email AS owner_email
     FROM projects p
     JOIN users u ON p.owner_id = u.id
     WHERE p.owner_id = ? 
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return { projects: rows };
};

// Get single project with its todos
const getSingleProjectWithTodo = async (userId, projectId) => {
  // Fetch project info
  const [projectRows] = await pool.query(
    `SELECT 
       p.id AS project_id,
       p.name AS project_name,
       p.due_date AS project_due_date,
       p.created_at AS project_created_at,
       u.id AS owner_id,
       u.name AS owner_name,
       u.email AS owner_email
     FROM projects p
     JOIN users u ON p.owner_id = u.id
     WHERE p.owner_id = ? AND p.id = ?
     ORDER BY p.created_at DESC`,
    [userId, projectId]
  );

  if (!projectRows.length) return { project: null, todos: [] };

  const project = projectRows[0];

  // Fetch todos for this project
  const [todoRows] = await pool.query(
    `SELECT 
   *
     FROM todos t
     WHERE t.project_id = ?`,
    [projectId]
  );

  return { project, todos: todoRows };
};

//For each project, compute: total todos, open todos, closed todos

const getSingleProjectStats = async (userId, projectId) => {
  const [rows] = await pool.query(
    `SELECT
       p.id AS project_id,
       p.name AS project_name,
       COUNT(t.id) AS total_todos,
       SUM(CASE WHEN s.code = 'OPEN' THEN 1 ELSE 0 END) AS open_todos,
       SUM(CASE WHEN s.code = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_todos,
       SUM(CASE WHEN s.code = 'CLOSED' THEN 1 ELSE 0 END) AS closed_todos
     FROM projects p
     LEFT JOIN todos t ON t.project_id = p.id
     LEFT JOIN status s ON t.status_id = s.id
     WHERE p.owner_id = ?
       AND p.id = ?
     GROUP BY p.id, p.name`,
    [userId, projectId]
  );

  return { projectStats: rows[0] || null };
};
const deleteProject = async (userId, projectId) => {
  const [result] = await pool.query(
    "DELETE FROM projects WHERE id = ? AND owner_id = ?",
    [projectId, userId]
  );
  if (result.affectedRows === 0) {
    throw new Error("Project not found");
  }
  return true;
};
module.exports = {
  createProject,
  getAllProjectsOfUser,
  getSingleProjectWithTodo,
  getSingleProjectStats,
  deleteProject,
};
